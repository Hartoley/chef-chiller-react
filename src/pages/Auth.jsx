import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { Bowl, Field, Logo } from "../components/ui";
import { auth, errorMessage } from "../lib/api";
import { useSession } from "../lib/session";
import { showcase } from "../data/showcase";

function AuthLayout({ title, intro, children, dish = 0 }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-cobalt p-10 text-white lg:flex">
        <Logo white className="h-10" />
        <div className="flex items-center gap-8">
          <Bowl src={showcase[dish].image} alt={showcase[dish].name} size="h-56 w-56" rim="thin" className="ring-white" />
          <p className="max-w-[14rem] font-display text-3xl font-extrabold leading-tight text-white" style={{ fontStretch: "115%" }}>
            {showcase[dish].name}, cooked this morning.
          </p>
        </div>
        <p className="text-white/70">Nigerian home cooking, delivered hot across Ibadan.</p>
      </aside>

      <main className="flex flex-col px-4 py-8 sm:px-10">
        <div className="lg:hidden">
          <Logo className="h-8" />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-4xl font-extrabold">{title}</h1>
          <p className="mt-2 text-ink-soft">{intro}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}

function PasswordField({ formik, label = "Password", hint }) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} id="password" hint={hint} error={formik.touched.password && formik.errors.password}>
      <div className="relative">
        <input
          id="password"
          name="password"
          type={show ? "text" : "password"}
          autoComplete={label === "Password" ? "current-password" : "new-password"}
          className="field pr-12"
          {...formik.getFieldProps("password")}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-ink-faint hover:text-ink"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </Field>
  );
}

export function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useSession();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: yup.object({
      email: yup.string().email("Enter a valid email address").required("Enter your email"),
      password: yup.string().required("Enter your password"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await auth.login(values);
        signIn({ id: res.id, role: res.role, email: res.email });
        toast.success("Signed in");
        const next = location.state?.next;
        navigate(res.role === "Admin" ? "/admin" : next || "/app", { replace: true });
      } catch (err) {
        toast.error(errorMessage(err, "Couldn't sign you in. Check your email and password."));
      }
    },
  });

  return (
    <AuthLayout title="Welcome back" intro="Sign in to order and track your food.">
      <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          error={formik.touched.email && formik.errors.email}
          {...formik.getFieldProps("email")}
        />
        <PasswordField formik={formik} />
        <button type="submit" disabled={formik.isSubmitting} className="btn-primary w-full py-3 text-base">
          {formik.isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-8 text-center text-ink-soft">
        New here?{" "}
        <Link to="/signup" className="font-semibold text-cobalt underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

export function SignUp() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: "", email: "", phoneNumber: "", password: "", agree: false },
    validationSchema: yup.object({
      username: yup.string().trim().min(5, "Use at least 5 characters").required("Choose a username"),
      email: yup.string().email("Enter a valid email address").required("Enter your email"),
      phoneNumber: yup
        .string()
        .matches(/^\+?[0-9 ]{10,15}$/, "Enter a phone number like 0803 000 0000")
        .required("We need a number for delivery"),
      password: yup.string().min(6, "Use at least 6 characters").required("Choose a password"),
      agree: yup.boolean().oneOf([true], "Please accept the terms to continue"),
    }),
    onSubmit: async ({ agree, ...values }, helpers) => {
      try {
        await auth.register(values);
        toast.success("Account created. Sign in to start ordering.");
        helpers.resetForm();
        navigate("/signin");
      } catch (err) {
        toast.error(errorMessage(err, "Couldn't create your account. Try again."));
      }
    },
  });

  const err = (k) => formik.touched[k] && formik.errors[k];

  return (
    <AuthLayout title="Create your account" intro="It takes a minute. Then the whole menu is yours." dish={1}>
      <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
        <Field label="Username" autoComplete="username" error={err("username")} {...formik.getFieldProps("username")} />
        <Field label="Email" type="email" autoComplete="email" error={err("email")} {...formik.getFieldProps("email")} />
        <Field
          label="Phone number"
          type="tel"
          autoComplete="tel"
          hint="Our rider calls this number on delivery."
          error={err("phoneNumber")}
          {...formik.getFieldProps("phoneNumber")}
        />
        <PasswordField formik={formik} label="Create a password" hint="At least 6 characters." />

        <div>
          <label className="flex items-start gap-3 text-[15px] text-ink-soft">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-cobalt" {...formik.getFieldProps("agree")} checked={formik.values.agree} />
            I agree to the terms of service and privacy policy.
          </label>
          {err("agree") && <p className="mt-1.5 text-[13px] font-medium text-ata">{err("agree")}</p>}
        </div>

        <button type="submit" disabled={formik.isSubmitting} className="btn-primary w-full py-3 text-base">
          {formik.isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-8 text-center text-ink-soft">
        Already have an account?{" "}
        <Link to="/signin" className="font-semibold text-cobalt underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
