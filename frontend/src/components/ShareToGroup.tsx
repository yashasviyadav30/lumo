import { Copy, Share2, ShareNetwork, TelegramLogo, WhatsappLogo, X } from "./icons";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { APP_URL } from "../config";
import { useBackToClose } from "../lib/useBackToClose";
import { videoShareText } from "../lib/exportNotes";
import { addPost, myGroups, type GroupSummary } from "../lib/groups";
import { clock } from "../lib/study";

// The row of quick ways out: WhatsApp, Telegram, the phone's own share sheet, or copy.
function ShareLinks({ title, videoId }: { title: string; videoId: string }) {
  const [copied, setCopied] = useState(false);
  const text = videoShareText(title, videoId);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", `${APP_URL}/watch/${videoId}`);
    }
  };
  return (
    <div className="share-links" role="group" aria-label="Send the video">
      <a className="share-link wa" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">
        <WhatsappLogo size={22} weight="fill" aria-hidden="true" /> WhatsApp
      </a>
      <a
        className="share-link tg"
        href={`https://t.me/share/url?url=${encodeURIComponent(`${APP_URL}/watch/${videoId}`)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <TelegramLogo size={22} weight="fill" aria-hidden="true" /> Telegram
      </a>
      {"share" in navigator && (
        <button
          type="button"
          className="share-link"
          onClick={() => navigator.share({ title, text }).catch(() => undefined)}
        >
          <ShareNetwork size={22} aria-hidden="true" /> More
        </button>
      )}
      <button type="button" className="share-link" onClick={copy} aria-live="polite">
        <Copy size={22} aria-hidden="true" /> {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

// "Share" on the study page: send the video anywhere (WhatsApp, Telegram, the share sheet), or to one of their
// study groups (optionally opened on its summary or mind map), or ask the group a doubt at the current second.
export default function ShareToGroup({
  videoId,
  title,
  getTime,
}: {
  videoId: string;
  title: string;
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
  useBackToClose(open, () => setOpen(false));

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

  const sheet = useRef<HTMLElement>(null);
  useEffect(() => {
    if (open) sheet.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [open]);

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
          <section
            className="share-sheet share-inline"
            aria-labelledby="share-title"
            ref={sheet}
          >
            <div>
              <div className="mm-card-head">
                <h2 id="share-title">Share this video</h2>
                <button
                  className="mm-close"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <ShareLinks title={title} videoId={videoId} />
              <h3 className="share-sub">Or send it to a study group</h3>
              {!groups && (
                <div
                  className="skeleton"
                  style={{ height: 80 }}
                  aria-busy="true"
                />
              )}
              {groups && groups.length === 0 && (
                <p className="share-none">
                  You’re not in a study group yet. <Link to="/groups">Create one</Link>, invite friends, and share
                  videos and doubts at the exact second.
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
                        <option value="notes">AI summary</option>
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
                    {state === "sending" ? "Sending…" : "Send to group"}
                  </button>
                </>
              )}
              {state === "sent" && (
                <p className="notice-line" role="status">
                  Shared. <Link to={`/groups/${groupId}`}>Open the group</Link>
                </p>
              )}
            </div>
          </section>,
          // In the page under the title, never a layer over the player (R7: nothing covers the YouTube player).
          document.getElementById("share-slot") ?? document.body,
        )}
    </>
  );
}
