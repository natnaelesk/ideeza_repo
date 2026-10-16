import type { Metadata } from "next";
import { HistoryView } from "@/components/views/History";

export const metadata: Metadata = {
  title: "History",
};

export default function Page() {
  return <HistoryView />;
}
