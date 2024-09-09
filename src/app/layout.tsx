import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/navbar"
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { SearchContextProvider } from "@/components/providers/SearchContextProvider";

export const metadata: Metadata = {
  title: "Noter",
  description: "All your notes in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen flex flex-col bg-background font-sans antialiased",
            inter.variable
          )}
        >
          <Navbar />
          <ConvexClientProvider>
            <SearchContextProvider>
              { children }
            </SearchContextProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
