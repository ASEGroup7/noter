"use client" 

import Note from "@/components/common/note";
import PageContainer from "@/components/layout/page-container";

import { useRef } from "react";
import { api } from "@convex/api";
import { useRouter } from "next/navigation";
import { usePaginatedQuery } from "convex/react";
import { useScroll } from "@/components/hooks/useScroll";
import NoteSkeleton from "@/components/common/note-skeleton";

export default function Page({ params } : { params : { tag : string }}) {
  const notesRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  
  const tag = params.tag;
  if(!tag) router.push("/");

  const { results : taggedNotes, status, loadMore } = usePaginatedQuery(
    api.notes.get.list,
    { fulltext: tag },
    { initialNumItems: 5 }
  )

  useScroll(notesRef, () => loadMore(5))

  return(
    <PageContainer>
      <div className="py-10 border-b gap-2">
        <h2 className="text-4xl font-bold text-center">{tag.replace(/%20/g, ' ')}</h2>
        <h4 className="text-center">Topic · {taggedNotes.length + " notes"}</h4>
      </div>

      {status == "LoadingFirstPage" ? (
        <NoteSkeleton />
      ) : (
        taggedNotes.map((note) => (
          <Note key={note._id} note={note} />
        ))
      )}
    </PageContainer>
  )
}