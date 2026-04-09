import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { appConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.subtitle,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold text-brand">
                {appConfig.name}
              </Link>
              <nav>
                <Link href="/admin" className="text-sm font-medium text-slate-700 hover:text-brand">
                  Admin
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
