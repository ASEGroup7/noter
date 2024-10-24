"use client" 

import Note from "@/components/common/note";
import PageContainer from "@/components/layout/page-container";

import { useRef } from "react";
import { api } from "@convex/api";
import { useRouter } from "next/navigation";
import { usePaginatedQuery } from "convex/react";
import NoteSkeleton from "@/components/common/note-skeleton";

export default function Page({ params } : { params : { tag : string }}) {
  const notesRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  
  const tag = params.tag;
  if(!tag) router.push("/");

  const { results : taggedNotes, status, loadMore } = usePaginatedQuery(
    api.notes.get.list,
    { fulltext: tag.replace(/%20/g, ' ') },
    { initialNumItems: 5 }
  )

	function handleScroll(e: React.UIEvent<HTMLDivElement>) { //Load more chats when user scrolls to the bottom
		const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
		if(bottom && status === "CanLoadMore") loadMore(3);
	}
  
  return(
    <PageContainer>
      <div className="py-10 border-b gap-2">
        <h2 className="text-4xl font-bold text-center">{tag.replace(/%20/g, ' ')}</h2>
        <h4 className="text-center">Topic · {taggedNotes.length + " notes"}</h4>
      </div>

      <div 

        className="flex-1 mx-10 h-[90vh] flex flex-col overflow-y-auto no-scrollbar"
        onScroll={handleScroll}
      >
        {status == "LoadingFirstPage" ? (
          <NoteSkeleton />
        ) : (
          taggedNotes.map((note) => (
            <Note key={note._id} note={note} />
          ))
        )}
      </div>
    </PageContainer>
  )
}