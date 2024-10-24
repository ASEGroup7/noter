import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Noto_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { SearchContextProvider } from "@/components/providers/SearchContextProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const noto = Noto_Sans({ weight: ["400", "700"], subsets: ["latin"] });

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <body
          className={cn(
            "min-h-screen flex flex-col bg-background antialiased",
            noto.className
          )}
        >
          <ConvexClientProvider>
            <SearchContextProvider>
              <TooltipProvider>
                <Navbar />
                <div className="flex-1 flex pt-[4.5rem]">
                  {children}
                </div>
                <Toaster />
              </TooltipProvider>
            </SearchContextProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
