import { Play, X } from "../components/icons";
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import Feed from "../components/Feed";
import { ALL, feedKey, loadFeed } from "../lib/search";
import { api, forget, fresh, peek, remember } from "../lib/api";
import { APP_NAME } from "../config";
import {
  chooseMeaning,
  getActiveGoal,
  goalSummary,
  setGoal,
  type Goal,
} from "../lib/goals";
import { useSession } from "../lib/session";
import {
  clock,
  homeSummary,
  lectureTitle,
  type HomeSummary,
} from "../lib/study";

// The last lecture, one tap away (like YouTube's "continue watching").
function Continue({ s, onRemove }: { s: HomeSummary; onRemove: () => void }) {
  if (!s.resume) return null;
  const v = s.resume.video;
  const to = `/watch/${s.resume.video_id}`;
  const pct = v?.duration_s
    ? Math.min(100, (s.resume.position_s / v.duration_s) * 100)
    : 0;
  return (
    <div className="continue">
      <button className="continue-close" onClick={onRemove} aria-label="Remove from Continue watching" title="Remove from Continue watching">
        <X size={18} aria-hidden="true" />
      </button>
      <Link to={to} aria-hidden="true" tabIndex={-1} className="vcard-link">
        <div className="vcard-thumb">
          {v?.thumbnail_url && (
            <img src={v.thumbnail_url} alt="" width={168} height={94} />
          )}
        </div>
        {pct > 0 && (
          <span className="vcard-watched">
            <span style={{ width: `${pct}%` }} />
          </span>
        )}
      </Link>
      <div>
        <p className="continue-k">Continue watching</p>
        <Link to={to} className="t">
          {lectureTitle(v, s.resume.video_id)}
        </Link>
        <p className="s">
          {v?.channel_title ? `${v.channel_title} · ` : ""}stopped at{" "}
          {clock(s.resume.position_s)}
        </p>
        <Link to={to} className="button small" style={{ marginTop: 8 }}>
          <Play size={15} aria-hidden="true" /> Resume
        </Link>
      </div>
    </div>
  );
}

// First visit: one question, so the feed has something to start from. Searching or following works too.
function GoalCard({
  onSaved,
  editing,
  onCancel,
}: {
  onSaved: (g: Goal) => void;
  editing: boolean;
  onCancel: () => void;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      onSaved(await setGoal(text.trim()));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn’t save that. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="start-card">
      <h2>What do you want to learn?</h2>
      <p>
        Anything: a subject, an exam, a skill, a language. Home fills with
        videos for it. You can change it any time.
      </p>
      <form className="inline-form" onSubmit={onSubmit}>
        <label htmlFor="goal" className="visually-hidden">
          Your learning goal
        </label>
        <input
          id="goal"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. CA Inter costing, UPSC polity, spoken English…"
          autoComplete="off"
        />
        <button type="submit" disabled={busy || !text.trim()}>
          {busy ? "Saving…" : "Start"}
        </button>
        {editing && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function greeting(d = new Date()) {
  const h = d.getHours();
  return h < 5
    ? "Up late"
    : h < 12
      ? "Good morning"
      : h < 17
        ? "Good afternoon"
        : "Good evening";
}

export default function Home() {
  const { me } = useSession();
  const kept = peek<{ goal: Goal | null; summary: HomeSummary | null }>("home");
  const [goal, setGoalState] = useState<Goal | null>(kept?.goal ?? null);
  const [summary, setSummary] = useState<HomeSummary | null>(kept?.summary ?? null);
  const [loading, setLoading] = useState(!kept);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fresh(feedKey(ALL), () => loadFeed(ALL)).catch(() => undefined); // start the feed now, not after the cards
    // Draw Home once both are in, so the top never flashes the wrong thing.
    // A failed refresh keeps what was already on screen.
    let next = { goal: kept?.goal ?? null, summary: kept?.summary ?? null };
    Promise.allSettled([
      homeSummary().then((s) => (next = { ...next, summary: s })),
      getActiveGoal().then((g) => (next = { ...next, goal: g && g.id ? g : null })),
    ]).then(() => {
      remember("home", next);
      setSummary(next.summary);
      setGoalState(next.goal);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per visit to Home
  }, []);

  // ✕ on Continue watching: the video leaves it (and History, as on YouTube); it comes back if that fails.
  const removeResume = async () => {
    const before = summary;
    const id = summary?.resume?.video_id;
    if (!before || !id) return;
    const next = { ...before, resume: null };
    setSummary(next);
    remember("home", { goal, summary: next });
    try {
      await api("/api/history/remove", { method: "POST", body: JSON.stringify({ video_id: id }) });
      forget("library");
    } catch {
      setSummary(before);
      remember("home", { goal, summary: before });
    }
  };

  // A new or changed goal changes the feed: drop the kept feeds so the next ones are fresh.
  const changeGoal = (g: Goal) => {
    setGoalState(g);
    remember("home", { goal: g, summary });
    forget("feed:");
  };

  // The greeting shows at once (it is the page's heading); only the cards below wait for data.
  const hello = (
    <header className="hello">
      <span className="hello-avatar" aria-hidden="true">
        {(me?.email ?? "L").charAt(0).toUpperCase()}
      </span>
      <div>
        <h1>{greeting()}!</h1>
        <p>What will you learn today?</p>
      </div>
    </header>
  );

  if (loading)
    return (
      <section>
        {hello}
        <div aria-busy="true" aria-label="Loading">
          <div className="skeleton" style={{ height: 40, margin: "12px 0" }} />
          <div className="skeleton" style={{ aspectRatio: "16 / 6" }} />
        </div>
      </section>
    );

  return (
    <section>
      {hello}
      {(!goal || editing) && (
        <GoalCard
          editing={editing}
          onCancel={() => setEditing(false)}
          onSaved={(g) => {
            changeGoal(g);
            setEditing(false);
          }}
        />
      )}
      {goal && !editing && goal.did_you_mean.length > 0 && (
        <div className="start-card">
          <h2>Did you mean…</h2>
          <p>“{goal.text}” can mean more than one thing.</p>
          <div className="chips">
            {goal.did_you_mean.map((c) => (
              <button
                key={c.index}
                className="chip"
                onClick={async () =>
                  changeGoal(await chooseMeaning(goal.id, c.index))
                }
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {summary && <Continue s={summary} onRemove={removeResume} />}
      {goal && !editing && (
        <p className="page-sub">
          Learning: <b>{goalSummary(goal)}</b>{" "}
          <button className="link" onClick={() => setEditing(true)}>
            Change
          </button>
        </p>
      )}
      {goal && goal.minor_signals.length > 0 && (
        <p className="notice-line" role="note">
          This goal mentions school (“{goal.minor_signals[0]}”). {APP_NAME} is
          for ages 18 and over for now.
        </p>
      )}
      <Feed
        key={goal?.id ?? "none"}
        topics={goal && !editing ? goal.topics : []}
      />
    </section>
  );
}
