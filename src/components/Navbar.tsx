"use client"

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [ isNavOpen, setIsNavOpen ] = useState(false);

  return(
    <div className="flex justify-center border-b">
      <div className="h-[60px] w-[min(1440px,90%)] flex gap-2 items-center">

        <Image src="/Logo.png" alt="Noter logo" height={60} width={90} />
        <Input placeholder="Search notes" />

        <Button variant="ghost">Sign Up</Button>
        <Button>Sign In</Button>
      </div>
    </div>
  )
}