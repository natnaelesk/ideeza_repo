import type { Metadata } from "next";
import { ChallengesView } from "@/components/views/Challenges";

export const metadata: Metadata = {
  title: "Challenges",
};

export default function Page() {
  return <ChallengesView />;
}
