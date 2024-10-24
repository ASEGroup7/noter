"use client";
import PageContainer from "@/components/layout/page-container";
import NoteSkeleton from "@/components/common/note-skeleton";
import Sidebar from "./_components/sidebarPanel"; // Your sidebar component
import Note from "@/components/common/note";
import { useRef, useState } from "react";
import { api } from "@convex/api";
import { usePaginatedQuery } from "convex/react";

import { ChevronFirst, ChevronLast } from 'lucide-react';

export default function Page() {
  const notesRef = useRef<HTMLDivElement | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state

  const { results: notes, status, loadMore } = usePaginatedQuery(api.notes.get.list, {}, { initialNumItems: 5 });

	function handleScroll(e: React.UIEvent<HTMLDivElement>) { //Load more chats when user scrolls to the bottom
		const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
		if(bottom && status === "CanLoadMore") loadMore(3);
	}
        
  return (
    <PageContainer className="relative flex">
      {/* Notes Section */}
      <div 
        ref={notesRef}
        className="flex-1 h-[90vh] flex flex-col overflow-y-auto no-scrollbar"
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

      {/* Toggle Button for Sidebar (Only visible on small screens) */}
      <button
        className="fixed bottom-5 right-5 z-50 p-3 bg-gray-600 text-white rounded-full shadow-lg lg:hidden" // Visible only on small screens
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle sidebar
      >
        {isSidebarOpen ? <ChevronLast size={24} /> : <ChevronFirst size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`transition-transform duration-300 hidden lg:block w-[300px] flex-shrink-0 sticky top-0`}>
        <Sidebar />
      </div>

      {/* Fullscreen Sidebar on Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-white p-5 flex flex-col md:hidden">
          <div className="flex-1 mt-5">
            <Sidebar />
          </div>
        </div>
      )}
    </PageContainer>
  );
}
