import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle2, Heart, ImageUp, Mail, MessageCircle, Phone, X } from "lucide-react";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { Empty, Field, PageTitle, Spinner } from "../../components/ui";
import { shortDate } from "../../lib/format";

// The journal runs on a separate blog service. Point VITE_BLOG_API_URL at it.
const BLOG = axios.create({ baseURL: import.meta.env.VITE_BLOG_API_URL || "http://localhost:5003" });
const READER_ID = import.meta.env.VITE_BLOG_READER_ID;
const POST_ID = import.meta.env.VITE_BLOG_POST_ID;
const ADMIN_ID = import.meta.env.VITE_BLOG_ADMIN_ID;
const msg = (err) => err?.response?.data?.error || err?.message || "Something went wrong";

function Avatar({ person, size = "h-8 w-8" }) {
  const name = person?.userName || "?";
  return person?.avatarUrl ? (
    <img src={person.avatarUrl} alt="" className={`${size} rounded-full object-cover`} />
  ) : (
    <span className={`${size} grid place-items-center rounded-full bg-cobalt-soft text-xs font-bold text-cobalt`}>
      {name[0]?.toUpperCase()}
    </span>
  );
}

function Post({ post, reload, onShowLikers }) {
  const [comment, setComment] = useState("");
  const [replies, setReplies] = useState({});
  const liked = (post.likes || []).some((l) => (l?._id || l) === READER_ID);

  const call = async (fn, done) => {
    try {
      await fn();
      if (done) toast.success(done);
      reload();
    } catch (err) {
      toast.error(msg(err));
    }
  };

  return (
    <article className="rounded-3xl bg-white p-6 ring-1 ring-line sm:p-10">
      <p className="text-sm text-ink-faint">{shortDate(post.createdAt)}</p>
      <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{post.title}</h2>
      {post.subtitle && <p className="mt-3 text-xl text-cobalt">{post.subtitle}</p>}
      <div className="mt-6 max-w-prose whitespace-pre-line text-[17px] leading-[1.75] text-ink-soft">{post.body}</div>

      <div className="mt-8 flex items-center gap-5 border-t border-line pt-5">
        <button onClick={() => call(() => BLOG.put(`/likeblog/${READER_ID}/${post._id}`))} className={`inline-flex items-center gap-2 font-semibold ${liked ? "text-ata" : "text-ink-soft hover:text-ata"}`} aria-pressed={liked}>
          <Heart size={20} fill={liked ? "currentColor" : "none"} /> {post.likesCount ?? post.likes?.length ?? 0}
        </button>
        <span className="inline-flex items-center gap-2 text-ink-soft">
          <MessageCircle size={20} /> {post.commentsCount ?? post.comments?.length ?? 0}
        </span>
        {post.likes?.length > 0 && (
          <button onClick={() => onShowLikers(post.likes)} className="ml-auto text-sm font-semibold text-cobalt hover:underline">
            See who liked this
          </button>
        )}
      </div>

      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!comment.trim()) return;
          call(() => BLOG.put(`/comment/${READER_ID}/${post._id}`, { comment, model: "User" }), "Comment posted").then(() => setComment(""));
        }}
      >
        <label className="sr-only" htmlFor={`c-${post._id}`}>Add a comment</label>
        <input id={`c-${post._id}`} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" className="field rounded-full" />
        <button className="btn-primary shrink-0">Post</button>
      </form>

      <ul className="mt-6 space-y-4">
        {(post.comments || []).map((c) => {
          const who = c.commenter?.userId;
          return (
            <li key={c._id} className="rounded-2xl bg-enamel p-4">
              <div className="flex items-center gap-3">
                <Avatar person={who} />
                <Link to={`/profile/${who?._id}`} className="font-semibold hover:underline">{who?.userName || "Reader"}</Link>
                <button onClick={() => call(() => BLOG.put(`/likecomment/${post._id}/${c._id}`, { userId: READER_ID }))} className="ml-auto inline-flex items-center gap-1 text-sm text-ink-faint hover:text-ata">
                  <Heart size={15} /> {c.likesCount || 0}
                </button>
              </div>
              <p className="mt-2">{c.comment}</p>

              <ul className="mt-3 space-y-2 border-l-2 border-line pl-4">
                {(c.replies || []).map((r, idx) => {
                  const rp = r.commenter?.id;
                  return (
                    <li key={r._id || idx} className="text-[15px]">
                      <div className="flex items-center gap-2">
                        <Avatar person={rp} size="h-6 w-6" />
                        <Link to={`/profile/${rp?._id}`} className="text-sm font-semibold hover:underline">{rp?.userName || "Reader"}</Link>
                        <button onClick={() => call(() => BLOG.put(`/likereply/${post._id}/${c._id}/${idx}`, { userId: READER_ID }))} className="ml-auto inline-flex items-center gap-1 text-xs text-ink-faint hover:text-ata">
                          <Heart size={13} /> {r.likesCount || 0}
                        </button>
                      </div>
                      <p className="mt-1 text-ink-soft">{r.comment}</p>
                    </li>
                  );
                })}
                <li>
                  <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const text = replies[c._id];
                      if (!text?.trim()) return;
                      call(
                        () => BLOG.put(`/replycomment/${post._id}/${c._id}`, { comment: text, commenter: { id: READER_ID, model: "User" } }),
                        "Reply posted"
                      ).then(() => setReplies((r) => ({ ...r, [c._id]: "" })));
                    }}
                  >
                    <input value={replies[c._id] || ""} onChange={(e) => setReplies((r) => ({ ...r, [c._id]: e.target.value }))} placeholder="Reply" aria-label="Write a reply" className="field rounded-full py-2 text-sm" />
                    <button className="btn-quiet shrink-0 text-sm text-cobalt">Reply</button>
                  </form>
                </li>
              </ul>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export function Journal() {
  const [posts, setPosts] = useState(null);
  const [likers, setLikers] = useState(null);

  const load = useCallback(() => {
    BLOG.get("/blogs")
      .then((r) => setPosts(Array.isArray(r.data) ? r.data : []))
      .catch(() => setPosts([]));
  }, []);
  useEffect(load, [load]);

  return (
    <>
      <SiteHeader />
      <main className="wrap max-w-3xl py-12 sm:py-16">
        <h1 className="display-xl text-5xl sm:text-6xl">The Ata journal</h1>
        <p className="mt-4 max-w-lg text-lg text-ink-soft">Stories from the kitchen, recipes we love, and what's coming to the menu.</p>
        <div className="mt-12 space-y-10">
          {posts === null ? (
            <Spinner label="Loading posts" />
          ) : posts.length ? (
            posts.map((p) => <Post key={p._id} post={p} reload={load} onShowLikers={setLikers} />)
          ) : (
            <Empty title="No posts yet">The first story from the kitchen is coming soon.</Empty>
          )}
        </div>
      </main>
      <SiteFooter />

      {likers && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" onClick={() => setLikers(null)} role="dialog" aria-modal="true" aria-label="Liked by">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold">Liked by</h2>
              <button onClick={() => setLikers(null)} className="btn-quiet px-2" aria-label="Close"><X size={18} /></button>
            </div>
            <ul className="max-h-80 space-y-2 overflow-y-auto">
              {likers.map((l) => (
                <li key={l._id || l}>
                  <Link to={`/profile/${l._id || l}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-enamel">
                    <Avatar person={l} /> <span className="font-semibold">{l.userName || "Reader"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export function JournalEditor() {
  const [form, setForm] = useState({ title: "", subtitle: "", body: "" });
  const [existing, setExisting] = useState([]);
  const [keep, setKeep] = useState([]);
  const [added, setAdded] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    BLOG.get(`/getblog/${POST_ID}`)
      .then(({ data }) => {
        setForm({ title: data.title || "", subtitle: data.subtitle || "", body: data.body || "" });
        setExisting(data.image || []);
        setKeep((data.image || []).map((m) => m.image));
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("imagesToKeep", JSON.stringify(keep));
    added.forEach((f) => fd.append("files", f));
    try {
      await BLOG.put(`/updateblog/${ADMIN_ID}/${POST_ID}`, fd);
      toast.success("Post updated");
      setAdded([]);
    } catch (err) {
      toast.error(msg(err));
    }
  };

  const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-enamel px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/journal" className="btn-quiet -ml-3 mb-4">Back to journal</Link>
        <PageTitle title="Edit post" />
        {state === "loading" && <Spinner label="Loading post" />}
        {state === "error" && <Empty title="Couldn't load this post">Check VITE_BLOG_API_URL and VITE_BLOG_POST_ID in your .env file.</Empty>}
        {state === "ready" && (
          <form onSubmit={save} className="space-y-5 rounded-3xl bg-white p-6 ring-1 ring-line">
            <Field label="Title" name="title" value={form.title} onChange={set("title")} required />
            <Field label="Subtitle" name="subtitle" value={form.subtitle} onChange={set("subtitle")} />
            <Field label="Body" id="body">
              <textarea id="body" rows={12} className="field" value={form.body} onChange={set("body")} required />
            </Field>

            <div>
              <p className="label">Photos and videos</p>
              <div className="flex flex-wrap gap-3">
                {existing.filter((m) => keep.includes(m.image)).map((m) => (
                  <div key={m.image} className="relative">
                    {isVideo(m.image) ? <video src={m.image} className="h-24 w-24 rounded-xl object-cover" /> : <img src={m.image} alt="" className="h-24 w-24 rounded-xl object-cover" />}
                    <button type="button" onClick={() => setKeep((k) => k.filter((u) => u !== m.image))} className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-ata text-white" aria-label="Remove">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {added.map((f, i) => (
                  <div key={i} className="relative">
                    {f.type.startsWith("video/") ? <video src={URL.createObjectURL(f)} className="h-24 w-24 rounded-xl object-cover" /> : <img src={URL.createObjectURL(f)} alt="" className="h-24 w-24 rounded-xl object-cover" />}
                    <button type="button" onClick={() => setAdded((a) => a.filter((_, j) => j !== i))} className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-ata text-white" aria-label="Remove">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <label className="grid h-24 w-24 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-line text-ink-faint hover:border-cobalt hover:text-cobalt">
                  <ImageUp size={22} />
                  <span className="sr-only">Add photos or videos</span>
                  <input type="file" multiple accept="image/*,video/*" className="sr-only" onChange={(e) => setAdded((a) => [...a, ...Array.from(e.target.files || [])])} />
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary px-6">Save post</button>
          </form>
        )}
      </div>
    </div>
  );
}

export function ReaderProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    BLOG.get(`/qurioans/getuser/${userId}`)
      .then((r) => setUser(r.data))
      .catch(() => setUser(null));
  }, [userId]);

  return (
    <>
      <SiteHeader />
      <main className="wrap max-w-2xl py-12">
        {user === undefined ? (
          <Spinner label="Loading profile" />
        ) : !user ? (
          <Empty title="We couldn't find that reader" action={<Link to="/journal" className="btn-primary">Back to journal</Link>} />
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
            <div className="flex flex-col items-center bg-cobalt px-6 pb-8 pt-10 text-center text-white">
              <Avatar person={user} size="h-28 w-28 ring-4 ring-white text-3xl" />
              <h1 className="mt-4 text-3xl font-extrabold text-white">{user.userName}</h1>
              {(user.firstName || user.lastName) && <p className="mt-1 text-white/80">{[user.firstName, user.lastName].filter(Boolean).join(" ")}</p>}
              <div className="mt-3 flex items-center gap-3 text-sm">
                {user.role && <span className="rounded-full bg-white/15 px-3 py-1">{user.role}</span>}
                {user.isVerified && (
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 size={15} /> Verified
                  </span>
                )}
              </div>
            </div>
            <ul className="space-y-3 p-6 text-ink-soft">
              {user.email && <li className="flex items-center gap-3"><Mail size={18} className="text-cobalt" /> {user.email}</li>}
              {user.phoneNumber && <li className="flex items-center gap-3"><Phone size={18} className="text-cobalt" /> {user.phoneNumber}</li>}
            </ul>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
