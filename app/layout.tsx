import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import type { ReactNode } from "react";
import { Shell } from "@/components/Shell";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "IDEEZA Builders",
    template: "%s · IDEEZA Builders",
  },
  description: "A three-page demo of the IDEEZA Build The Future campaign: leaderboard, challenges, and a sample profile.",
};

export const viewport: Viewport = {
  themeColor: "#6a2ff0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-clip bg-deep text-ink">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
