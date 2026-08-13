import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Khushi's Store account.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
