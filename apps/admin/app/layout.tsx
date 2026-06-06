import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "In Between Admin",
  description: "Admin dashboard for In Between MVP",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
