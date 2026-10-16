import type { Metadata } from "next";
import { RoadmapView } from "@/components/views/Roadmap";

export const metadata: Metadata = {
  title: { absolute: "IDEEZA Builders Cohort" },
};

export default function Page() {
  return <RoadmapView />;
}
