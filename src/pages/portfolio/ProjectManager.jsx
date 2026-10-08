import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, ImageUp, Pencil, Trash2, X } from "lucide-react";
import { Empty, Field, PageTitle, Spinner } from "../../components/ui";
import { errorMessage, projects as api } from "../../lib/api";

const blank = {
  title: "",
  description: "",
  features: [],
  technologies: [],
  liveDemoLink: "",
  repoLink: "",
  status: "Ongoing",
  image: null,
};

function TagInput({ label, values, onChange, placeholder }) {
  const [text, setText] = useState("");
  const add = () => {
    const v = text.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setText("");
  };
  return (
    <Field label={label} id={label}>
      <div className="field flex flex-wrap items-center gap-2 py-2">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-full bg-cobalt-soft py-1 pl-3 pr-1 text-sm font-semibold text-cobalt-deep">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="grid h-5 w-5 place-items-center rounded-full hover:bg-white" aria-label={`Remove ${v}`}>
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          id={label}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
          placeholder={placeholder}
          className="min-w-[10rem] flex-1 bg-transparent py-1 outline-none"
        />
      </div>
    </Field>
  );
}

export default function ProjectManager() {
  const [list, setList] = useState(null);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.list().then((r) => setList(Array.isArray(r) ? r : [])).catch(() => setList([]));
  useEffect(() => {
    load();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));

  const reset = () => {
    setForm(blank);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return toast.error("Add a title and a description");
    if (!editingId && !form.image) return toast.error("Add a cover image");
    setSaving(true);
    try {
      if (editingId) {
        const { image, ...rest } = form;
        await api.update(editingId, rest);
        toast.success("Project updated");
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, Array.isArray(v) ? JSON.stringify(v) : v));
        await api.create(fd);
        toast.success("Project published");
      }
      reset();
      load();
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't save the project."));
    } finally {
      setSaving(false);
    }
  };

  const edit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      features: p.features || [],
      technologies: p.technologies || [],
      liveDemoLink: p.liveDemoLink || "",
      repoLink: p.repoLink || "",
      status: p.status || "Ongoing",
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    try {
      await api.remove(p._id);
      toast.success("Project deleted");
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-enamel px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/portfolio" className="btn-quiet -ml-3 mb-4">
          <ArrowLeft size={18} /> Back to portfolio
        </Link>
        <PageTitle title={editingId ? "Edit project" : "Publish a project"}>Projects you publish appear on the portfolio straight away.</PageTitle>

        <form onSubmit={submit} className="space-y-5 rounded-3xl bg-white p-6 ring-1 ring-line">
          <Field label="Title" name="title" value={form.title} onChange={set("title")} />
          <Field label="Description" id="description">
            <textarea id="description" rows={4} className="field" value={form.description} onChange={set("description")} />
          </Field>
          <TagInput label="Features" values={form.features} onChange={set("features")} placeholder="Type a feature and press Enter" />
          <TagInput label="Technologies" values={form.technologies} onChange={set("technologies")} placeholder="e.g. React, then Enter" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Live site link" name="liveDemoLink" value={form.liveDemoLink} onChange={set("liveDemoLink")} placeholder="https://" />
            <Field label="Code repository link" name="repoLink" value={form.repoLink} onChange={set("repoLink")} placeholder="https://github.com/…" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Status" id="status">
              <select id="status" className="field" value={form.status} onChange={set("status")}>
                <option>Ongoing</option>
                <option>Completed</option>
              </select>
            </Field>
            {!editingId && (
              <Field label="Cover image" id="cover">
                <label className="field flex cursor-pointer items-center gap-2 text-ink-soft">
                  <ImageUp size={18} />
                  <span className="truncate">{form.image ? form.image.name : "Choose an image"}</span>
                  <input id="cover" type="file" accept="image/*" className="sr-only" onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))} />
                </label>
              </Field>
            )}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary px-6">
              {saving ? "Saving…" : editingId ? "Save changes" : "Publish project"}
            </button>
            {editingId && (
              <button type="button" onClick={reset} className="btn-quiet">
                Cancel editing
              </button>
            )}
          </div>
        </form>

        <h2 className="mb-4 mt-12 text-2xl font-extrabold">Published</h2>
        {list === null ? (
          <Spinner />
        ) : list.length ? (
          <ul className="divide-y divide-line rounded-3xl bg-white ring-1 ring-line">
            {list.map((p) => (
              <li key={p._id} className="flex items-center gap-4 p-4">
                {p.image && <img src={p.image} alt="" className="h-14 w-20 rounded-xl object-cover" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.title}</p>
                  <p className="text-sm text-ink-faint">{p.status}</p>
                </div>
                <button onClick={() => edit(p)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-enamel" aria-label={`Edit ${p.title}`}>
                  <Pencil size={17} />
                </button>
                <button onClick={() => remove(p)} className="grid h-10 w-10 place-items-center rounded-full text-ink-faint hover:bg-ata-soft hover:text-ata" aria-label={`Delete ${p.title}`}>
                  <Trash2 size={17} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <Empty title="Nothing published yet">Your first project will show up here.</Empty>
        )}
      </div>
    </div>
  );
}
