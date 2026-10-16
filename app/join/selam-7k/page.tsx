import type { Metadata } from "next";
import { JoinView } from "@/components/views/Join";

export const metadata: Metadata = {
  title: "Invite",
};

export default function Page() {
  return <JoinView />;
}
