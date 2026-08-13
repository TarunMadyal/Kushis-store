"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

export default function AuthActions() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = (await response.json()) as { user?: CurrentUser | null };
        if (active) setUser(data.user || null);
      } catch {
        if (active) setUser(null);
      }
    }

    void loadUser();
    window.addEventListener("auth-changed", loadUser);

    return () => {
      active = false;
      window.removeEventListener("auth-changed", loadUser);
    };
  }, []);

  return (
    <Link
      href={user ? "/account" : "/login"}
      className="flex items-center gap-2 text-brand-ink transition hover:text-brand-primary"
      aria-label={user ? "Your account" : "Sign in"}
    >
      <AccountIcon />
      <span className="hidden max-w-24 truncate text-xs sm:block">
        {user ? user.name.split(" ")[0] : "Sign in"}
      </span>
    </Link>
  );
}

function AccountIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}
