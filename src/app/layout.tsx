import type { Metadata } from "next";
import { AppProvider } from "@/providers/AppProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campaign Manager",
  description: "Manage your marketing campaigns efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
