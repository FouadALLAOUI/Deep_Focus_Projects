"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

interface FormState {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
  form?: string;
}

export default function LoginForm() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
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
      // TODO: replace with real auth call, e.g. signIn(form)
      await new Promise((r) => setTimeout(r, 1000));
    } catch {
      setErrors({ form: "Invalid email or password." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white p-10">
      <div className="mb-10">
        <div className="w-8 h-8 bg-black mb-8" />
        <h1 className="text-2xl font-semibold tracking-tight text-black">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your credentials to access your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              className="block text-xs font-medium uppercase tracking-widest text-black"
            >
              Password
            </label>
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-black transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={`w-full border px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:border-black transition-colors ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
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
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="text-black font-medium hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
