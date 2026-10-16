import type { Metadata } from "next";
import { InternshipView } from "@/components/views/Internship";

export const metadata: Metadata = {
  title: "Internship",
};

export default function Page() {
  return <InternshipView />;
}
