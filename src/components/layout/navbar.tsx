"use client"

import Image from "next/image";
import Link from "next/link";
import { inputStyles } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { CommandDialog, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { api } from "@convex/api";
import { usePaginatedQuery } from "convex/react";
import { useDebouncedCallback } from "use-debounce";
import { useSearch } from "../providers/SearchContextProvider";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const { searchValue, setSearchValue } = useSearch();
  const [ isDialogOpen, setIsDialogOpen ] = useState(false);
  const { results } = usePaginatedQuery(
    api.notes.get.list,
    { fulltext: searchValue },
    { initialNumItems: 5 }
  )

  return(
    <div className="flex justify-center border-b border-gray-100">
      <div className="h-[60px] px-[1%] flex gap-4 items-center w-screen">
        <Link href="/notes">
          <Image
            priority
            src="/Logo.png"
            alt="Noter Logo"
            height={60}
            width={90}
          />
        </Link>
      </div>

      <SignedIn>

      </SignedIn>

      <SignedOut>
        <Link className={buttonVariants({variant: "default"})} href="/sign-in">Sign In</Link>
        <Link className={buttonVariants({variant: "ghost"})} href="/sign-up">Get Started</Link>
      </SignedOut>
    </div>
  )
}