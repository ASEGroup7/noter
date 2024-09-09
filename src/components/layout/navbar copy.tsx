"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { inputStyles } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { api } from "@convex/api";
import { useRouter } from "next/navigation";
import { usePaginatedQuery } from "convex/react";
import { useDebouncedCallback } from "use-debounce";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setSearchOpen] = useState(false);
  const { results } = usePaginatedQuery(
    api.notes.get.list,
    { fulltext: searchValue },
    { initialNumItems: 5 }
  );

  return (
    <div className="flex justify-center border-b border-gray-100">
      <div className="h-[60px] px-[1%] flex gap-4 items-center w-screen">
        <Link href="/notes">
          <Image
            priority
            src="/Logo.png"
            alt="Noter logo"
            height={60}
            width={90}
          />
        </Link>

        <div
          onClick={() => setSearchOpen(true)}
          className={cn(
            inputStyles,
            "flex items-center w-[300px] gap-2 text-muted-foreground hover:cursor-pointer"
          )}
        >
          <MagnifyingGlassIcon className="size-3" aria-hidden="true"/>
          <span>Search notes, topics ...</span>
        </div>

        <CommandDialog open={isSearchOpen} onOpenChange={setSearchOpen}>
          <CommandInput
            onChangeCapture={(e) => setSearchValue(e.currentTarget.value)}
            placeholder="Search ..."
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Notes">
              {
                results ? results.map((item) => (
                  <CommandItem key={item._id}>{item.title}</CommandItem>
                )) : <span>Loading...</span>
              }
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        <SignedIn>
          <div className="flex ml-auto items-center pr-4">
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <Button variant="ghost" onClick={() => router.push("/sign-up")}>
            Sign Up
          </Button>
          <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
        </SignedOut>
      </div>
    </div>
  );
}
