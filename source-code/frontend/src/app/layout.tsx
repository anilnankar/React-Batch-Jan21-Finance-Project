import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import BootstrapClient from "@/components/client/BootstrapClient";

export const metadata: Metadata = {
  title: "Finance Project",
  description: "Finance domain frontend built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}

