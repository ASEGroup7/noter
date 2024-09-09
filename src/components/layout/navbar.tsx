"use client"

import Image from "next/image";
import Link from "next/link";
import { inputStyles } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { CommandDialog, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

import { cn } from "@/lib/utils";
import { api } from "@convex/api";
import { useState, useEffect } from "react";
import { usePaginatedQuery } from "convex/react";
import { useDebouncedCallback } from "use-debounce";
import { useSearch } from "../providers/SearchContextProvider";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const { searchValue, setSearchValue } = useSearch();
  const [ isDialogOpen, setIsDialogOpen ] = useState(false);
  const setDebouncedSearchValue = useDebouncedCallback(setSearchValue, 300);
  const { results } = usePaginatedQuery(
    api.notes.get.list,
    { fulltext: searchValue },
    { initialNumItems: 5 }
  )

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if(e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsDialogOpen(prevState => !prevState);
      }
    }

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [])

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

        <SignedIn>
          <div 
            onClick={() => setIsDialogOpen(true)}
            className={cn(
              inputStyles,
              "flex items-center w-[300px] gap-2 text-muted-foreground hover:cursor-text mr-auto"
            )}>
              <MagnifyingGlassIcon className="h-3 w-3" aria-hidden="true" />
              <span className="mr-auto">Search notes, topics ...</span>
              <kbd className="rounded border bg-muted px-1.5 text-[10px]">
                <span>⌘ K</span>
              </kbd>
            </div>
            <UserButton />
        </SignedIn>

        <SignedOut>
          <Link className={buttonVariants({variant: "default"})} href="/sign-in">Sign In</Link>
          <Link className={buttonVariants({variant: "ghost"})} href="/sign-up">Get Started</Link>
        </SignedOut>
      </div>

      <CommandDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <CommandInput
          onChangeCapture={(e) => setDebouncedSearchValue(e.currentTarget.value)}
          placeholder="Search ..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Notes">
            {
              results ? results.map((item) => (
                <CommandItem key={item._id}>{item.title}</CommandItem>
              )) : <span>Loading ... </span>
            }
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}