import Providers from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LogsProvider } from "@/context/logs.context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stacked",
  description: "Stacked MRU Demo",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      url: "./icon.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col">
            <Navbar />
            <LogsProvider>
              <div className="flex-1 overflow-hidden">{children}</div>
            </LogsProvider>
          </div>
        </Providers>
      </body>
    </html>
  );
}
