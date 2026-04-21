"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirm: string;
  terms: boolean;
}

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
  form?: string;
}

export default function RegisterForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (!form.confirm) e.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password)
      e.confirm = "Passwords do not match.";
    if (!form.terms) e.terms = "You must accept the terms to continue.";
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      // TODO: replace with real registration call, e.g. register(form)
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(true);
    } catch {
      setErrors({ form: "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md bg-white p-10 text-center">
        <div className="w-8 h-8 bg-black mx-auto mb-8" />
        <h2 className="text-xl font-semibold tracking-tight text-black mb-2">
          Account created
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          Your account has been created successfully.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-black text-white text-sm font-medium tracking-widest uppercase px-8 py-3.5 hover:bg-gray-900 transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white p-10">
      <div className="mb-10">
        <div className="w-8 h-8 bg-black mb-8" />
        <h1 className="text-2xl font-semibold tracking-tight text-black">
          Create account
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in your details to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium uppercase tracking-widest text-black mb-2"
          >
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full border px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:border-black transition-colors ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Jane Doe"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium uppercase tracking-widest text-black mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full border px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:border-black transition-colors ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium uppercase tracking-widest text-black mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={`w-full border px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:border-black transition-colors ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="At least 8 characters"
          />
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirm"
            className="block text-xs font-medium uppercase tracking-widest text-black mb-2"
          >
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className={`w-full border px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:border-black transition-colors ${
              errors.confirm ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Repeat your password"
          />
          {errors.confirm && (
            <p className="mt-1.5 text-xs text-red-500">{errors.confirm}</p>
          )}
        </div>

        <div className="pt-1">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.checked })}
              className="mt-0.5 w-4 h-4 accent-black flex-shrink-0"
            />
            <span className="text-xs text-gray-500 leading-relaxed">
              I agree to the{" "}
              <a href="#" className="text-black font-medium hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-black font-medium hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1.5 text-xs text-red-500">{errors.terms}</p>
          )}
        </div>

        {errors.form && (
          <p className="text-xs text-red-500 text-center">{errors.form}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white text-sm font-medium tracking-widest uppercase py-3.5 hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-gray-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-black font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
