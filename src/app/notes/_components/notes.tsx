"use client"

import Note from "./note";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@convex/api";
import { useRef, useEffect } from "react";
import { usePaginatedQuery } from "convex/react";
import { useSearch } from "@/components/providers/SearchContextProvider"
import { cn } from "@/lib/utils";

//TODO : Add infinite scrolling
export default function Notes({
  className,
} : {
  className ?: string,
}) {
  const notesRef = useRef<HTMLDivElement | null>(null);
  const { searchValue, setSearchValue } = useSearch();
  const { results : notes, status, loadMore } = usePaginatedQuery(
    api.notes.get.list,
    { fulltext: searchValue },
    { initialNumItems: 10 }
  );

  return(
    <div ref={notesRef} className={cn(
      className,
      "flex flex-col gap-3"
    )}>
      { status === "LoadingFirstPage" ? <Skeleton className="h-[60px] w-full rounded-lg" /> : null }
      { notes.map(note => <Note key={note._id} {...note} />) }
    </div>
  )
}