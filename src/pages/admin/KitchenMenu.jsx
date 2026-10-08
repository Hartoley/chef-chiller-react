import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { ArrowLeft, ImageUp, Pencil, Plus, Trash2 } from "lucide-react";
import { Bowl, Empty, Field, PageTitle, Spinner } from "../../components/ui";
import { errorMessage, menu } from "../../lib/api";
import { naira } from "../../lib/format";
import { categories } from "../../data/showcase";

const isNew = (p) => (Date.now() - new Date(p.createdAt).getTime()) / 36e5 < 48;

export function KitchenMenu() {
  const [items, setItems] = useState(null);
  const [view, setView] = useState("all");

  const load = () => menu.list().then(setItems).catch(() => setItems([]));
  useEffect(() => {
    load();
  }, []);

  const remove = async (p) => {
    if (!window.confirm(`Delete ${p.name} from the menu?`)) return;
    try {
      await menu.remove(p._id);
      toast.success(`${p.name} deleted`);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  if (items === null) return <Spinner label="Loading the menu" />;
  const shown = items.filter((p) =>
    view === "specials" ? /special/i.test(p.category || "") : view === "new" ? isNew(p) : true
  );

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle
        title="Menu"
        action={
          <Link to="/admin/menu/new" className="btn-hot">
            <Plus size={18} /> Add a dish
          </Link>
        }
      >
        What customers see on the site and in the app.
      </PageTitle>

      <div className="mb-6 flex gap-2">
        {[
          ["all", "All dishes"],
          ["specials", "Specials"],
          ["new", "Added in the last 2 days"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setView(k)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${view === k ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-line"}`}
          >
            {l}
          </button>
        ))}
      </div>

      {shown.length ? (
        <ul className="divide-y divide-line rounded-3xl bg-white ring-1 ring-line">
          {shown.map((p) => (
            <li key={p._id} className="flex items-center gap-4 p-4 sm:p-5">
              <Bowl src={p.image} alt="" rim="thin" size="h-14 w-14" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-bold">{p.name}</p>
                <p className="truncate text-sm text-ink-faint">
                  {[p.category, p.prepTime].filter(Boolean).join(", ")}
                </p>
              </div>
              <span className="hidden font-semibold sm:block">{naira(p.price)}</span>
              <Link to={`/admin/menu/${p._id}`} className="grid h-10 w-10 place-items-center rounded-full hover:bg-enamel" aria-label={`Edit ${p.name}`}>
                <Pencil size={17} />
              </Link>
              <button onClick={() => remove(p)} className="grid h-10 w-10 place-items-center rounded-full text-ink-faint hover:bg-ata-soft hover:text-ata" aria-label={`Delete ${p.name}`}>
                <Trash2 size={17} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title="No dishes here yet" action={<Link to="/admin/menu/new" className="btn-primary">Add a dish</Link>}>
          Dishes you add show up on the site straight away.
        </Empty>
      )}
    </div>
  );
}

export function DishForm() {
  const { productId } = useParams();
  const editing = Boolean(productId);
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(!editing);
  const [preview, setPreview] = useState(null);

  const formik = useFormik({
    initialValues: { name: "", category: "", price: "", prepTime: "", description: "", image: null },
    validationSchema: yup.object({
      name: yup.string().trim().required("Give the dish a name"),
      category: yup.string().required("Choose a category"),
      price: yup.number().typeError("Enter a number").positive("Price must be above zero").required("Enter a price"),
      prepTime: yup.string().required("How long does it take? e.g. 20 mins"),
      description: yup.string().trim().required("Describe the dish in a sentence or two"),
      image: editing ? yup.mixed().nullable() : yup.mixed().required("Add a photo"),
    }),
    onSubmit: async (values) => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (k === "image" && !(v instanceof File)) return; // keep the current photo
        fd.append(k, v);
      });
      try {
        if (editing) await menu.update(productId, fd);
        else await menu.create(fd);
        toast.success(editing ? "Dish updated" : "Dish added to the menu");
        navigate("/admin/menu");
      } catch (err) {
        toast.error(errorMessage(err, "Couldn't save this dish."));
      }
    },
  });

  useEffect(() => {
    if (!editing) return;
    menu
      .get(productId)
      .then((d) => {
        formik.setValues({
          name: d.name || "",
          category: d.category || "",
          price: d.price ?? "",
          prepTime: d.prepTime || "",
          description: d.description || "",
          image: null,
        });
        setPreview(d.image);
      })
      .catch(() => toast.error("Couldn't load this dish"))
      .finally(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (!loaded) return <Spinner label="Loading dish" />;
  const err = (k) => formik.touched[k] && formik.errors[k];

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/menu" className="btn-quiet -ml-3 mb-4">
        <ArrowLeft size={18} /> Back to menu
      </Link>
      <PageTitle title={editing ? "Edit dish" : "Add a dish"} />

      <form onSubmit={formik.handleSubmit} noValidate className="grid gap-8 rounded-3xl bg-white p-6 ring-1 ring-line md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-4">
          <Bowl src={preview} alt="Dish photo" size="h-44 w-44" rim="thin" />
          <label className="btn-ghost cursor-pointer">
            <ImageUp size={17} /> {preview ? "Change photo" : "Add photo"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                formik.setFieldValue("image", f);
                setPreview(URL.createObjectURL(f));
              }}
            />
          </label>
          {err("image") && <p className="text-[13px] font-medium text-ata">{err("image")}</p>}
        </div>

        <div className="space-y-5">
          <Field label="Name" error={err("name")} {...formik.getFieldProps("name")} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" id="category" error={err("category")}>
              <select id="category" className="field" {...formik.getFieldProps("category")}>
                <option value="">Choose one</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Price (₦)" type="number" inputMode="numeric" error={err("price")} {...formik.getFieldProps("price")} />
          </div>
          <Field label="Preparation time" placeholder="e.g. 20 mins" error={err("prepTime")} {...formik.getFieldProps("prepTime")} />
          <Field label="Description" id="description" error={err("description")}>
            <textarea id="description" rows={4} className="field" {...formik.getFieldProps("description")} />
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={formik.isSubmitting} className="btn-primary px-6">
              {formik.isSubmitting ? "Saving…" : editing ? "Save changes" : "Add to menu"}
            </button>
            <Link to="/admin/menu" className="btn-quiet">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export function KitchenMessages() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title="Messages" />
      <div className="rounded-3xl bg-white ring-1 ring-line">
        <Empty title="Customer chat isn't connected yet">
          When live chat is added to the backend, conversations with customers will show up here.
        </Empty>
      </div>
    </div>
  );
}
