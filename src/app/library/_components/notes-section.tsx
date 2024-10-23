"use client";

import Note from "@/components/common/note";
import NoteSkeleton from "@/components/common/note-skeleton";

import { cn } from "@/lib/utils";
import { api } from "@convex/api";
import { useRef } from "react";
import { usePaginatedQuery } from "convex/react";

export default function NotesSection({ 
  className,
  starredFileId = []
}: { 
  className?: string;
  starredFileId: string[];
}) {

  const notesRef = useRef<HTMLDivElement | null>(null);
  const {
    results: notes,
    status,
    loadMore,
  } = usePaginatedQuery(api.notes.get.list, {
    fileId: starredFileId
  }, { initialNumItems: 5 });


	function handleScroll(e: React.UIEvent<HTMLDivElement>) { //Load more chats when user scrolls to the bottom
		const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
		if(bottom && status === "CanLoadMore") loadMore(3);
  }

  return (
    <div
      className={cn(
        className,
        "flex-1 h-[80vh] flex-col overflow-y-auto no-scrollbar"
      )}
      onScroll={handleScroll}
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
  );
}
