"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isSignup ? { name } : {}),
          email,
          password,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container-x py-14 sm:py-20">
      <div className="mx-auto max-w-md rounded-[var(--radius-card)] border border-brand-line bg-brand-surface p-6 shadow-sm sm:p-9">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">
            {isSignup ? "Join Khushi's Store" : "Welcome back"}
          </p>
          <h1 className="font-heading text-4xl text-brand-ink">
            {isSignup ? "Create your account" : "Sign in"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-brand-muted">
            {isSignup
              ? "Save your details and enjoy a smoother shopping experience."
              : "Sign in to access your Khushi's Store account."}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {isSignup && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">
                Full name
              </span>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                maxLength={80}
                required
                className="w-full rounded-xl border border-brand-line bg-brand-bg px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted focus:border-brand-primary"
                placeholder="Your name"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink">
              Email address
            </span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              required
              className="w-full rounded-xl border border-brand-line bg-brand-bg px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted focus:border-brand-primary"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink">
              Password
            </span>
            <input
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              maxLength={128}
              required
              className="w-full rounded-xl border border-brand-line bg-brand-bg px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted focus:border-brand-primary"
              placeholder={isSignup ? "At least 8 characters" : "Your password"}
            />
          </label>

          {isSignup && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">
                Confirm password
              </span>
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                maxLength={128}
                required
                className="w-full rounded-xl border border-brand-line bg-brand-bg px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted focus:border-brand-primary"
                placeholder="Re-enter your password"
              />
            </label>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting
              ? isSignup
                ? "Creating account..."
                : "Signing in..."
              : isSignup
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-brand-muted">
          {isSignup ? "Already have an account?" : "New to Khushi's Store?"}{" "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-semibold text-brand-primary hover:underline"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </section>
  );
}
