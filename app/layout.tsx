import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HobbyBox — Try the hobby, not the price tag",
  description: "A demo rental desk for complete beginner hobby kits.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
