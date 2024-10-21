"use client";

import Note from "@/components/common/note";
import PageContainer from "@/components/layout/page-container";

import { useRef } from "react";
import { api } from "@convex/api";
import { usePaginatedQuery } from "convex/react";
import { useScroll } from "@/components/hooks/useScroll";
import NoteSkeleton from "@/components/common/note-skeleton";

export default function Page() {
  const notesRef = useRef<HTMLDivElement | null>(null);

  const { results: notes, status, loadMore } = usePaginatedQuery(api.notes.get.list, {}, { initialNumItems: 5 });

  useScroll(notesRef, () => loadMore(5));

  return (
    <PageContainer>
      <div 
        ref={notesRef}
        className="flex-1 flex flex-col overflow-y-auto no-scrollbar"
      >
        {status === "LoadingFirstPage" ? (
          <>
            <NoteSkeleton />
            <NoteSkeleton />
            <NoteSkeleton />
          </>
        ) : null}
        {notes.map((note) => (
          <Note key={note._id} note={note} />
        ))}
      </div>
    </PageContainer>
  )

}