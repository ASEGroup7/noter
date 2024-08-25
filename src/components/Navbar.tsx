"use client"

import Image from "next/image";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface NavLinkProps {
  title: string | React.ReactNode;
  href: string;
}

const navLinks: NavLinkProps[] = [
  { title: "Notes", href: "#" },
  { title: "Pricing", href: "#" },
  { title: "Company", href: "#" },
  { title: "Faq", href: "#" },
  { title: "Contact", href: "#" },
];

export default function Navbar() {
  const user = useUser(); 
  const router = useRouter();
  const [ isNavOpen, setIsNavOpen ] = useState(false);

  return(
    <div className="flex justify-center border-b border-gray-100">
      <div className="h-[60px] px-[5%] flex gap-4 items-center w-screen">

        <Image src="/Logo.png" alt="Noter logo" height={60} width={90} />
        <Input placeholder="Search notes, topics, users ...." />

        <SignedIn>
          <div className="hidden lg:block">
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <Button className="hidden lg:block" variant="ghost" onClick={() => router.push("/sign-up")}>Sign Up</Button>
          <Button className="hidden lg:block" onClick={() => router.push("/sign-in")}>Sign In</Button>
        </SignedOut>

        {/* Mobile UI */}
        <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
          <SheetTrigger className="lg:hidden">
            <Bars3Icon className="size-7" />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <Image src="/Logo.png" alt="Noter logo" height={60} width={90} />
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}