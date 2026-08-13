import type { Metadata } from "next";
import AccountProfile from "@/components/auth/AccountProfile";

export const metadata: Metadata = {
  title: "My account",
};

export default function AccountPage() {
  return <AccountProfile />;
}
