import type { Metadata } from "next";
import { ProfileView } from "@/components/views/Profile";

export const metadata: Metadata = {
  title: "Profile",
};

export default function Page() {
  return <ProfileView />;
}
