"use client" 

import Note from "@/components/common/note";
import PageContainer from "@/components/layout/page-container";

import { api } from "@convex/api";
import { useScroll } from "@/components/hooks/useScroll";
import { useRouter } from "next/navigation";
import { usePaginatedQuery } from "convex/react";

export default function Page({ params } : { params : { id : string }}) {

  const router = useRouter();

  const id = params.id;
  if(!id) router.push("/");

  const { results : taggedNotes, status, loadMore } = usePaginatedQuery(
    api.notes.get.list,
    { fulltext: id },
    { initialNumItems: 5 }
  )


  return(
    <PageContainer>
      
    </PageContainer>
  )
}