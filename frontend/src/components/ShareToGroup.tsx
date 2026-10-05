import { Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { addPost, myGroups, type GroupSummary } from "../lib/groups";
import { clock } from "../lib/study";

// "Share" on the study page (plan v3): send the video (optionally opened on its AI notes or mind map) or ask a
// doubt at the current second, to one of her groups.
export default function ShareToGroup({
  videoId,
  getTime,
}: {
  videoId: string;
  getTime: () => number;
}) {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<GroupSummary[] | null>(null);
  const [groupId, setGroupId] = useState("");
  const [mode, setMode] = useState<"video" | "doubt">("video");
  const [attach, setAttach] = useState<"" | "notes" | "map">("notes");
  const [text, setText] = useState("");
  const [at, setAt] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const first = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!open) return;
    setAt(Math.floor(getTime()));
    myGroups()
      .then((r) => {
        setGroups(r.groups);
        setGroupId((g) => g || r.groups[0]?.id || "");
      })
      .catch(() => setGroups([]));
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, getTime]);
  useEffect(() => {
    if (open && groups?.length) first.current?.focus();
  }, [open, groups]);

  async function send() {
    setState("sending");
    try {
      await addPost(
        mode === "video"
          ? {
              group_id: groupId,
              kind: "video",
              video_id: videoId,
              text: text.trim(),
              ...(attach ? { attach } : {}),
            }
          : {
              group_id: groupId,
              kind: "doubt",
              video_id: videoId,
              t_seconds: at,
              text: text.trim(),
            },
      );
      setState("sent");
      setText("");
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <button
        className="star-video"
        onClick={() => (setOpen(true), setState("idle"))}
        title="Share to a study group"
      >
        <Share2 size={19} aria-hidden="true" /> Share
      </button>
      {open &&
        createPortal(
          <div
            className="guide-backdrop"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <div
              className="guide share-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-title"
            >
              <div className="mm-card-head">
                <h2 id="share-title">Share to a study group</h2>
                <button
                  className="mm-close"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              {!groups && (
                <div
                  className="skeleton"
                  style={{ height: 80 }}
                  aria-busy="true"
                />
              )}
              {groups && groups.length === 0 && (
                <p>
                  You’re not in a group yet.{" "}
                  <Link to="/groups">Create one</Link> and invite friends.
                </p>
              )}
              {groups && groups.length > 0 && state !== "sent" && (
                <>
                  <label htmlFor="share-group">Group</label>
                  <select
                    id="share-group"
                    ref={first}
                    className="ai-lang"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                  <div
                    className="segmented"
                    role="group"
                    aria-label="What to share"
                    style={{ marginTop: 12 }}
                  >
                    <button
                      className={mode === "video" ? "on" : ""}
                      aria-pressed={mode === "video"}
                      onClick={() => setMode("video")}
                    >
                      Share this video
                    </button>
                    <button
                      className={mode === "doubt" ? "on" : ""}
                      aria-pressed={mode === "doubt"}
                      onClick={() => setMode("doubt")}
                    >
                      Ask a doubt at {clock(at)}
                    </button>
                  </div>
                  {mode === "video" && (
                    <>
                      <label htmlFor="share-attach">Open it on</label>
                      <select
                        id="share-attach"
                        className="ai-lang"
                        value={attach}
                        onChange={(e) =>
                          setAttach(e.target.value as "" | "notes" | "map")
                        }
                      >
                        <option value="notes">AI notes</option>
                        <option value="map">Mind map</option>
                        <option value="">Just the video</option>
                      </select>
                    </>
                  )}
                  <label htmlFor="share-text">
                    {mode === "doubt" ? "Your doubt" : "Message (optional)"}
                  </label>
                  <textarea
                    id="share-text"
                    className="share-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={2000}
                  />
                  {state === "error" && (
                    <p className="error" role="alert">
                      Couldn’t share. Check your connection and try again.
                    </p>
                  )}
                  <button
                    onClick={send}
                    disabled={state === "sending" || !groupId}
                    style={{ marginTop: 12 }}
                  >
                    {state === "sending" ? "Sharing…" : "Share"}
                  </button>
                </>
              )}
              {state === "sent" && (
                <p className="notice-line" role="status">
                  Shared. <Link to={`/groups/${groupId}`}>Open the group</Link>
                </p>
              )}
            </div>
          </div>,
          document.body, // above the page's own layers (sticky player, tab bar), so nothing covers the sheet
        )}
    </>
  );
}
