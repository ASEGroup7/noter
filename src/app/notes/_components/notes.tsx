"use client";

import Note from "./note";
import NoteSkeleton from "./noteskeleton";

import { cn } from "@/lib/utils";
import { api } from "@convex/api";
import { useRef, useEffect } from "react";
import { usePaginatedQuery } from "convex/react";
import useScroll from "@/components/hooks/useScroll";

export default function Notes({ className }: { className?: string }) {
  const notesRef = useRef<HTMLDivElement | null>(null);
  const {
    results: notes,
    status,
    loadMore,
  } = usePaginatedQuery(api.notes.get.list, {}, { initialNumItems: 5 });

  useScroll(notesRef, () => loadMore(5));

  return (

    <div
      ref={notesRef}
      className={cn(
        className,
        "flex flex-col h-[calc(100vh-122px)] overflow-y-auto no-scrollbar"
      )}
    >
      {status === "LoadingFirstPage" ? (
        <>
          <NoteSkeleton />
          <NoteSkeleton />
          <NoteSkeleton />
        </>
      ) : null}
      {notes.map((note) => (
        <Note key={note._id} {...note} />
      ))}
    </div>
  );
}
