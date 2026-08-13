"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
};

type SignupStage = "form" | "validating" | "success";

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signupStage, setSignupStage] = useState<SignupStage>("form");
  const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const validationStartedAt = Date.now();
    if (isSignup) setSignupStage("validating");

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
        requiresEmailConfirmation?: boolean;
      };

      if (!response.ok) {
        if (isSignup) setSignupStage("form");
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      if (isSignup) {
        // Keep the real validation state visible long enough to feel intentional,
        // even when the network request returns almost instantly.
        const elapsed = Date.now() - validationStartedAt;
        if (elapsed < 900) {
          await new Promise((resolve) => setTimeout(resolve, 900 - elapsed));
        }

        setRequiresEmailConfirmation(Boolean(data.requiresEmailConfirmation));
        setPassword("");
        setConfirmPassword("");
        setSignupStage("success");
        return;
      }

      window.dispatchEvent(new Event("auth-changed"));
      router.push("/account");
      router.refresh();
    } catch {
      if (isSignup) setSignupStage("form");
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isSignup && signupStage === "validating") {
    return (
      <section className="container-x py-14 sm:py-20">
        <div className="mx-auto flex min-h-[430px] max-w-md flex-col items-center justify-center rounded-[var(--radius-card)] border border-brand-line bg-brand-surface p-8 text-center shadow-sm sm:p-10">
          <div className="auth-validating-ring" aria-hidden="true" />
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">
            Almost there
          </p>
          <h1 className="mt-3 font-heading text-4xl text-brand-ink">Creating your account</h1>
          <p className="mt-4 max-w-sm text-base leading-7 text-brand-muted">
            We&apos;re securely validating your details and preparing your Khushi&apos;s Store account.
          </p>
          <div className="mt-8 flex items-center gap-2 text-sm text-brand-muted">
            <span className="auth-validating-dot" />
            <span className="auth-validating-dot auth-validating-dot-delay-1" />
            <span className="auth-validating-dot auth-validating-dot-delay-2" />
          </div>
        </div>
      </section>
    );
  }

  if (isSignup && signupStage === "success") {
    return (
      <section className="container-x py-14 sm:py-20">
        <div className="auth-success-card mx-auto max-w-md overflow-hidden rounded-[var(--radius-card)] border border-brand-line bg-brand-surface p-8 text-center shadow-sm sm:p-10">
          <div className="auth-success-icon mx-auto" aria-hidden="true">
            <svg viewBox="0 0 64 64" className="h-full w-full">
              <circle className="auth-success-circle" cx="32" cy="32" r="29" fill="none" strokeWidth="3" />
              <path className="auth-success-check" d="M18 33.5 27.5 43 47 22.5" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="auth-success-copy">
            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">
              Account verified
            </p>
            <h1 className="mt-3 font-heading text-4xl sm:text-5xl text-brand-ink">
              Account created successfully!
            </h1>
            <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-brand-muted">
              {requiresEmailConfirmation
                ? "Your account is ready. Please confirm the email we sent you, then sign in using the email and password you just created."
                : "Your account is ready. Sign in now using the email and password you just created."}
            </p>

            <div className="mt-5 rounded-2xl border border-brand-line bg-brand-bg px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-muted">Your sign-in email</p>
              <p className="mt-1 break-all text-base font-semibold text-brand-ink">{email}</p>
            </div>

            <Link href="/login" className="btn-primary mt-7 w-full text-base">
              Sign in now
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/" className="mt-5 inline-block text-sm font-medium text-brand-muted transition hover:text-brand-primary">
              Continue browsing instead
            </Link>
          </div>
        </div>
      </section>
    );
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
              ? "Just your name, email and password. Delivery details can wait until you actually need them."
              : "Sign in to access your Khushi's Store account."}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {isSignup && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">Full name</span>
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
            <span className="mb-2 block text-sm font-medium text-brand-ink">Email address</span>
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
            <span className="mb-2 block text-sm font-medium text-brand-ink">Password</span>
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
              <span className="mb-2 block text-sm font-medium text-brand-ink">Confirm password</span>
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
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting
              ? isSignup
                ? "Validating account..."
                : "Signing in..."
              : isSignup
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-brand-muted">
          {isSignup ? "Already have an account?" : "New to Khushi's Store?"}{" "}
          <Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-brand-primary hover:underline">
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </section>
  );
}
