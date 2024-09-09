import "./globals.css";
import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const noto = Noto_Sans({ weight: ['400', '700'], subsets: ['latin']})

import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer";
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
            noto.className
          )}
        >
          <ConvexClientProvider>
            <SearchContextProvider>
              <Navbar />
              { children }
              <Footer />
            </SearchContextProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
