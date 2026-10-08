import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { Download, ExternalLink, Github, Mail, MapPin, Phone, X } from "lucide-react";
import { Field, Spinner } from "../../components/ui";
import { projects as projectsApi } from "../../lib/api";
import { useSocket } from "../../lib/socket";

const PERSON = {
  name: "Sekinat Tolani Jimoh",
  short: "Sekinat",
  role: "Full-stack web developer",
  location: "Nigeria",
  email: "tolanijimoh1@gmail.com",
  phone: "+234 802 421 9945",
  resume: "/sekinat-jimoh-resume.pdf",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sekinat-jimoh-71ab0531a/" },
    { label: "X (Twitter)", href: "https://twitter.com/Hartoley1" },
    { label: "WhatsApp", href: "https://wa.me/2348024219945" },
  ],
};

const skills = [
  { group: "Front end", items: ["HTML", "CSS", "React", "Tailwind CSS", "Bootstrap", "Angular"] },
  { group: "Back end", items: ["Node.js", "Express", "PHP", "Laravel"] },
  { group: "Data", items: ["MongoDB", "MySQL"] },
];

function ProjectDialog({ project, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/60 sm:place-items-center sm:p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={project.title}>
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold">{project.title}</h2>
            <p className="mt-1 text-sm font-semibold text-cobalt">{project.status}</p>
          </div>
          <button onClick={onClose} className="btn-quiet px-2" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        {project.image && <img src={project.image} alt="" className="mt-5 w-full rounded-2xl object-cover" />}
        <p className="mt-5 leading-relaxed text-ink-soft">{project.description}</p>
        {project.features?.length > 0 && (
          <>
            <h3 className="mt-6 font-sans text-lg font-bold">What it does</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
              {project.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </>
        )}
        {project.technologies?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span key={t} className="rounded-full bg-cobalt-soft px-3 py-1 text-sm font-semibold text-cobalt-deep">
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          {project.liveDemoLink && (
            <a href={project.liveDemoLink} target="_blank" rel="noreferrer" className="btn-primary">
              <ExternalLink size={17} /> Open live site
            </a>
          )}
          {project.repoLink && (
            <a href={project.repoLink} target="_blank" rel="noreferrer" className="btn-ghost">
              <Github size={17} /> View code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const [values, setValues] = useState({ user_name: "", user_email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const ready = Object.values(values).every((v) => v.trim());
  const set = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const send = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        e.target,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );
      toast.success("Message sent. I'll reply soon.");
      setValues({ user_name: "", user_email: "", subject: "", message: "" });
    } catch {
      toast.error("Your message didn't send. Email me directly instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={send} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="user_name" value={values.user_name} onChange={set} />
        <Field label="Your email" type="email" name="user_email" value={values.user_email} onChange={set} />
      </div>
      <Field label="Subject" name="subject" value={values.subject} onChange={set} />
      <Field label="Message" id="message">
        <textarea id="message" name="message" rows={5} className="field" value={values.message} onChange={set} />
      </Field>
      <button type="submit" disabled={!ready || sending} className="btn-primary px-6 py-3">
        {sending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

export default function Portfolio() {
  const [list, setList] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    projectsApi.list().then((r) => setList(Array.isArray(r) ? r : [])).catch(() => setList([]));
  }, []);

  useSocket({
    newProject: (p) => setList((l) => [p, ...(l || [])]),
    projectDeleted: (p) => setList((l) => (l || []).filter((x) => x._id !== p._id)),
  });

  return (
    <div className="min-h-screen bg-enamel">
      <header className="wrap flex h-16 items-center justify-between">
        <span className="font-display text-lg font-extrabold" style={{ fontStretch: "120%" }}>
          {PERSON.short}
        </span>
        <nav className="flex gap-1 text-sm" aria-label="Portfolio">
          <a href="#work" className="btn-quiet">Work</a>
          <a href="#contact" className="btn-quiet">Contact</a>
        </nav>
      </header>

      <section className="wrap pb-16 pt-12 sm:pt-20">
        <p className="font-semibold text-cobalt">{PERSON.role}</p>
        <h1 className="display-xl mt-3 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">{PERSON.name}</h1>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">
          I build web apps end to end: the screens people use, the APIs behind them, and the data underneath. I
          learn fast, write clean code, and like shipping things that work.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#contact" className="btn-primary px-6 py-3">
            Get in touch
          </a>
          <a href={PERSON.resume} download className="btn-ghost px-6 py-3">
            <Download size={18} /> Download CV
          </a>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="wrap grid gap-12 py-16 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-extrabold">About me</h2>
            <div className="mt-4 space-y-4 text-ink-soft">
              <p>
                I'm a full-stack developer with more than a year of hands-on experience building responsive,
                practical web applications. I care about clear code and interfaces that feel easy.
              </p>
              <p>
                Right now I'm focused on full-stack apps with modern tools, responsive front ends, solid APIs, and
                getting better at data modelling every week.
              </p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {skills.map((s) => (
              <div key={s.group}>
                <h3 className="border-b-4 border-cobalt pb-2 font-sans text-lg font-bold">{s.group}</h3>
                <ul className="mt-3 space-y-1.5 text-ink-soft">
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="wrap scroll-mt-10 py-16">
        <h2 className="text-4xl font-extrabold">Selected work</h2>
        {list === null ? (
          <Spinner label="Loading projects" />
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <Link to="/" className="group block overflow-hidden rounded-3xl bg-cobalt p-6 text-white">
                <img src="/brand/ata-logo-white.svg" alt="" className="h-10" />
                <p className="mt-16 font-display text-2xl font-bold text-white">Ata Kitchen</p>
                <p className="mt-1 text-white/75">Food ordering for a home kitchen in Ibadan. React, Node, MongoDB.</p>
              </Link>
            </li>
            {list.map((p) => (
              <li key={p._id}>
                <button onClick={() => setOpen(p)} className="group block w-full overflow-hidden rounded-3xl bg-white text-left ring-1 ring-line">
                  {p.image && <img src={p.image} alt="" className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.03]" />}
                  <div className="p-5">
                    <p className="font-display text-xl font-bold">{p.title}</p>
                    <p className="mt-1 line-clamp-2 text-ink-soft">{p.description}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="contact" className="scroll-mt-10 bg-white">
        <div className="wrap grid gap-12 py-16 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-4xl font-extrabold">Let's work together</h2>
            <ul className="mt-6 space-y-3 text-ink-soft">
              <li className="flex items-center gap-3"><MapPin size={18} className="text-cobalt" /> {PERSON.location}</li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-cobalt" /> <a href={`mailto:${PERSON.email}`} className="hover:text-ink">{PERSON.email}</a></li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-cobalt" /> {PERSON.phone}</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {PERSON.links.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="btn-ghost px-4 py-2 text-sm">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <Contact />
        </div>
      </section>

      <footer className="wrap flex flex-col gap-2 py-8 text-sm text-ink-faint sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {PERSON.name}</p>
        <Link to="/" className="hover:text-ink">Ata Kitchen</Link>
      </footer>

      {open && <ProjectDialog project={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
