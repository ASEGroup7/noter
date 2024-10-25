"use client";

import Note from "@/components/common/note";
import Sidebar from "./_components/sidebar";
import NoteSkeleton from "@/components/common/note-skeleton";
import PageContainer from "@/components/layout/page-container";

import { api } from "@convex/api";
import { useRef, useState } from "react";
import { usePaginatedQuery } from "convex/react";


export default function Page() {
  const notesRef = useRef<HTMLDivElement | null>(null);
  const { results: notes, status, loadMore } = usePaginatedQuery(api.notes.get.list, {}, { initialNumItems: 5 });

	function handleScroll(e: React.UIEvent<HTMLDivElement>) { 
		const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
		if(bottom && status === "CanLoadMore") loadMore(3);
	}
        
  return (
    <PageContainer className="grid grid-cols-1 lg:grid-cols-[1fr_450px]">

      <div 
        className="flex-1 mx-10 h-[90vh] flex flex-col overflow-y-auto no-scrollbar"
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

      <Sidebar className="hidden lg:block lg:sticky"/>

    </PageContainer>
  );
}
