"use client"

import EditForm from "./_components/editform";
import { Skeleton } from "@/components/ui/skeleton";

import { useState, useEffect } from "react";
import { api } from "@convex/api";
import { useQuery } from "convex/react";
import { useSearchParams, notFound } from "next/navigation";

//TODO : We need to add id verification. As of right now we are assuming that all the id's being passed are valid.
export default function Page() { 
  const [ noteFileUrl, setNoteFileUrl ] = useState<string>("");
  
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const note = useQuery(api.notes.get.id, { id });

  useEffect(() => {
    setNoteFileUrl(note?.fileUrl || "");
  }, [note])

  return(
    <div className="flex-1 grid grid-cols-[1fr_auto] px-[5%] py-4 gap-4">
      <div className="flex items-center">
        <EditForm id={id} className="w-full" />
      </div>
      
      {
        noteFileUrl === "" ? <Skeleton className="w-[700px] h-full" /> : 
        <embed src={noteFileUrl} width="700px" height="100%" type="application/pdf" />
      }
      
    </div>
  )
}