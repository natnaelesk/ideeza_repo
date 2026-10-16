import type { Metadata } from "next";
import { PointsView } from "@/components/views/Points";

export const metadata: Metadata = {
  title: "Points",
  description: "Refer, Build, Bug, and Show up. Golden Tickets redeem for IDEEZA gifts, never cash.",
};

export default function Page() {
  return <PointsView />;
}
