import { CircleHelp, EllipsisVertical, Flag, MessageSquare, Play, Send, Share2, StickyNote, Trash2, UserMinus, UsersRound } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import {
  addPost,
  addReply,
  deletePost,
  getThread,
  leaveGroup,
  openGroup,
  relTime,
  removeMember,
  reportPost,
  shareInvite,
  type GroupView,
  type Post,
} from '../lib/groups'
import { clock } from '../lib/study'

const KIND_LABEL: Record<string, string> = { note: 'Note', doubt: 'Doubt', video: 'Shared a video', reply: 'Reply' }

function PostMenu({ post, onReport, onDelete }: { post: Post; onReport: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: Event) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])
  return (
    <div className="card-menu" ref={ref}>
      <button className="menu-btn" aria-label="Post actions" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <EllipsisVertical size={18} aria-hidden="true" />
      </button>
      {open && (
        <div className="menu" role="menu">
          {!post.mine && (
            <button role="menuitem" disabled={post.reported} onClick={() => (setOpen(false), onReport())}>
              <Flag size={16} aria-hidden="true" /> {post.reported ? 'Reported' : 'Report'}
            </button>
          )}
          {post.can_delete && (
            <button role="menuitem" onClick={() => (setOpen(false), onDelete())}>
              <Trash2 size={16} aria-hidden="true" /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function PostBody({ post }: { post: Post }) {
  const v = post.video
  const tab = post.attach ?? (post.kind === 'doubt' ? 'mine' : undefined)
  return (
    <>
      {post.text && <p className="post-text">{post.text}</p>}
      {post.video_id && (
        <Link to={`/watch/${post.video_id}`} state={{ t: post.t_seconds ?? undefined, tab }} className="post-video">
          <span className="post-thumb">{v?.thumbnail_url && <img src={v.thumbnail_url} alt="" width={120} height={68} loading="lazy" />}</span>
          <span className="post-video-text">
            <b>{v?.title ?? 'Open the video'}</b>
            <span className="help">
              {post.t_seconds !== null && (
                <>
                  <Play size={12} aria-hidden="true" /> at {clock(post.t_seconds)}
                </>
              )}
              {post.attach && (post.t_seconds !== null ? ' · ' : '') + (post.attach === 'notes' ? 'with the AI summary' : 'with the mind map')}
            </span>
          </span>
        </Link>
      )}
    </>
  )
}

function Thread({ post, onCount, onDelete, onReport }: { post: Post; onCount: (n: number) => void; onDelete: (p: Post) => void; onReport: (p: Post) => void }) {
  const [replies, setReplies] = useState<Post[] | null>(null)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    getThread(post.id)
      .then((t) => setReplies(t.replies))
      .catch(() => setError('Couldn’t load the thread.'))
  }, [post.id])
  async function send(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setBusy(true)
    setError(null)
    try {
      const r = await addReply(post.id, text.trim())
      const next = [...(replies ?? []), r]
      setReplies(next)
      onCount(next.length)
      setText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Couldn’t send.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="thread">
      {!replies && !error && <div className="skeleton" style={{ height: 40 }} aria-busy="true" />}
      {replies?.map((r) => (
        <div key={r.id} className="reply">
          <div className="post-head">
            <b>{r.author}</b>
            <span className="help">{relTime(r.created_at)}</span>
            <PostMenu
              post={r}
              onReport={() => onReport(r)}
              onDelete={() => {
                onDelete(r)
                const next = replies.filter((x) => x.id !== r.id)
                setReplies(next)
                onCount(next.length)
              }}
            />
          </div>
          <p className="post-text">{r.text}</p>
        </div>
      ))}
      <form className="reply-form" onSubmit={send}>
        <label htmlFor={`reply-${post.id}`} className="visually-hidden">
          Reply
        </label>
        <input id={`reply-${post.id}`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Reply in thread…" maxLength={2000} autoComplete="off" />
        <button type="submit" className="icon-btn" aria-label="Send reply" disabled={busy || !text.trim()}>
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function Composer({ groupId, onPosted }: { groupId: string; onPosted: (p: Post) => void }) {
  const [kind, setKind] = useState<'note' | 'doubt'>('note')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function send(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setBusy(true)
    setError(null)
    try {
      onPosted(await addPost({ group_id: groupId, kind, text: text.trim() }))
      setText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Couldn’t post.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <form className="composer" onSubmit={send}>
      <div className="segmented" role="group" aria-label="Post type">
        <button type="button" className={kind === 'note' ? 'on' : ''} aria-pressed={kind === 'note'} onClick={() => setKind('note')}>
          <StickyNote size={15} aria-hidden="true" /> Note
        </button>
        <button type="button" className={kind === 'doubt' ? 'on' : ''} aria-pressed={kind === 'doubt'} onClick={() => setKind('doubt')}>
          <CircleHelp size={15} aria-hidden="true" /> Doubt
        </button>
      </div>
      <label htmlFor="compose" className="visually-hidden">
        Write a {kind}
      </label>
      <textarea
        id="compose"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={2000}
        placeholder={kind === 'doubt' ? 'What didn’t make sense?' : 'Share something with the group…'}
      />
      <div className="composer-foot">
        <span className="help">To share a video or a doubt at a moment, use Share on the video’s page.</span>
        <button type="submit" className="small" disabled={busy || !text.trim()}>
          {busy ? 'Posting…' : 'Post'}
        </button>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}

function Members({ group, onChange }: { group: GroupView; onChange: () => void }) {
  const navigate = useNavigate()
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [error, setError] = useState<string | null>(null)
  return (
    <div className="card members">
      <h2>Members ({group.members.length})</h2>
      <ul>
        {group.members.map((m) => (
          <li key={m.id}>
            <span>
              {m.name}
              {m.me && ' (you)'}
              {m.owner && <span className="badge"> Owner</span>}
            </span>
            {group.i_own && !m.me && (
              <button
                className="link danger-link"
                onClick={async () => {
                  try {
                    await removeMember(group.id, m.id)
                    onChange()
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Couldn’t remove.')
                  }
                }}
              >
                <UserMinus size={15} aria-hidden="true" /> Remove
              </button>
            )}
          </li>
        ))}
      </ul>
      {!confirmLeave ? (
        <button className="secondary small" onClick={() => setConfirmLeave(true)}>
          Leave group
        </button>
      ) : (
        <div className="confirm" role="group" aria-label="Confirm leaving">
          <p>Leave “{group.name}”? Your posts stay unless you delete them first.</p>
          <button
            className="danger small"
            onClick={async () => {
              await leaveGroup(group.id)
              navigate('/groups', { replace: true })
            }}
          >
            Leave
          </button>{' '}
          <button className="secondary small" onClick={() => setConfirmLeave(false)}>
            Cancel
          </button>
        </div>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Group() {
  const { groupId = '' } = useParams()
  const justCreated = (useLocation().state as { justCreated?: boolean } | null)?.justCreated
  const [data, setData] = useState<(GroupView & { posts: Post[] }) | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [showMembers, setShowMembers] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(() => {
    openGroup(groupId)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Couldn’t open the group.'))
  }, [groupId])
  useEffect(load, [load])

  const setPosts = (fn: (p: Post[]) => Post[]) => setData((d) => d && { ...d, posts: fn(d.posts) })
  const onDelete = async (p: Post) => {
    try {
      await deletePost(p.id)
      if (p.kind !== 'reply') setPosts((all) => all.filter((x) => x.id !== p.id))
      setNotice('Deleted.')
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Couldn’t delete.')
    }
  }
  const onReport = async (p: Post) => {
    await reportPost(p.id).catch(() => undefined)
    setPosts((all) => all.map((x) => (x.id === p.id ? { ...x, reported: true } : x)))
    setNotice('Reported. Thank you: the group owner can remove it, and we review reports.')
  }
  const invite = async () => {
    if (!data) return
    const how = await shareInvite(data.name, data.invite_code)
    setNotice(how === 'copied' ? 'Invite link copied. Paste it in WhatsApp or anywhere.' : how === 'whatsapp' ? 'Opening WhatsApp…' : null)
  }

  if (error)
    return (
      <section>
        <p className="error" role="alert">
          {error}
        </p>
        <Link to="/groups">Back to your groups</Link>
      </section>
    )
  if (!data) return <div className="skeleton" style={{ height: 240, marginTop: 16 }} aria-busy="true" />

  return (
    <section className="group-page">
      <div className="group-head">
        <div>
          <h1 className="page-title">{data.name}</h1>
          <button className="link" onClick={() => setShowMembers(!showMembers)} aria-expanded={showMembers}>
            <UsersRound size={15} aria-hidden="true" /> {data.members.length} member{data.members.length === 1 ? '' : 's'}
          </button>
        </div>
        <button className="small" onClick={invite}>
          <Share2 size={16} aria-hidden="true" /> Invite
        </button>
      </div>
      {justCreated && data.members.length === 1 && (
        <p className="notice-line">Group made. Tap Invite and send the link to your friends on WhatsApp.</p>
      )}
      {notice && (
        <p className="notice-line" role="status">
          {notice}
        </p>
      )}
      {showMembers && <Members group={data} onChange={load} />}
      <Composer groupId={data.id} onPosted={(p) => setPosts((all) => [p, ...all])} />
      {data.posts.length === 0 && (
        <div className="feed-empty">
          <h3>Nothing here yet</h3>
          <p>Post a note or a doubt, or open any video and tap Share to send it here.</p>
        </div>
      )}
      <ul className="post-list" aria-label="Posts">
        {data.posts.map((p) => (
          <li key={p.id} className={`post-card kind-${p.kind}`}>
            <div className="post-head">
              <b>{p.author}</b>
              <span className={`kind-label kind-${p.kind}`}>{KIND_LABEL[p.kind]}</span>
              <span className="help">{relTime(p.created_at)}</span>
              <PostMenu post={p} onReport={() => onReport(p)} onDelete={() => onDelete(p)} />
            </div>
            <PostBody post={p} />
            <button className="link thread-toggle" aria-expanded={open === p.id} onClick={() => setOpen(open === p.id ? null : p.id)}>
              <MessageSquare size={15} aria-hidden="true" />{' '}
              {p.replies === 0 ? 'Reply' : `${p.replies} repl${p.replies === 1 ? 'y' : 'ies'}`}
            </button>
            {open === p.id && (
              <Thread
                post={p}
                onCount={(n) => setPosts((all) => all.map((x) => (x.id === p.id ? { ...x, replies: n } : x)))}
                onDelete={onDelete}
                onReport={onReport}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
