"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { buttonVariants } from "./ui/button";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import React, { useState } from "react";

interface NavLinkProps {
  title: string | React.ReactNode;
  href: string;
  description?: string;
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
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex justify-center border-b">
      <div className="h-[60px] w-[min(1440px,90%)] flex gap-2">

        {/* Mobile UI */}
        <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
          <SheetTrigger>
            <Bars3Icon className="size-7" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex flex-col justify-between h-full"
          >
            <SheetHeader>
              <SheetTitle>
                <VisuallyHidden.Root>
                  Menu
                </VisuallyHidden.Root>
              </SheetTitle>
            </SheetHeader>

            <div className="grid grid-cols-1 gap-2">
              <Image src="/Logo.png" alt="Noter Logo" height={60} width={90} />
              {navLinks.map((item) => (
                <Link className="ml-2" href={item.href} key={item.href}>
                  {item.title}
                </Link>
              ))}
            </div>

            <SignedIn>
              <div className="flex ml-2 gap-4">
                <UserButton />
                <div className="flex flex-col">
                  <span >{user.user?.fullName}</span>
                  <span className="font-semibold">{user.user?.primaryEmailAddress?.toString()}</span>
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </SheetContent>
        </Sheet>

        <Image src="/Logo.png" alt="Noter Logo" height={60} width={90} />
      </div>
    </div>
  );
}
