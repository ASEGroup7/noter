"use client"

import { Search } from "lucide-react";
import { inputStyles } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface CmdkSearchBarProps {
  onActivate: () => void;
  className?: string;
}

export default function CmdkSearchBar(props: CmdkSearchBarProps) {

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if(e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        props.onActivate();
      }
    }

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [props])

  return (
    <div 
      onClick={() => props.onActivate()}
      className={cn(
        inputStyles,
        "flex items-center w-full gap-2 text-muted-foreground hover:cursor-text mr-auto rounded-full hover:cursor-pointer",
        props.className,
      )}>
      <Search aria-hidden="true" />
      <div className="flex w-full space-x-2">
        <span className="mr-auto">Search notes, topics ...</span>
        <kbd className="rounded border bg-muted px-1.5 text-[10px] shadow-sm">
          <span>⌘ K</span>
        </kbd>
      </div>
    </div>
  )
}