"use client";

import Note from "@/components/common/note";
import NoteSkeleton from "@/components/common/note-skeleton";

import { Id } from "@convex/dataModel";
import { cn } from "@/lib/utils";
import { api } from "@convex/api";
import { useQuery } from "convex/react";

export default function NotesSection({ 
  className,
  starredFileId = []
}: { 
  className?: string;
  starredFileId: string[];
}) {

  const notes = useQuery(api.notes.get.idList, { fileIds: starredFileId as Id<"notes">[] });

  return (
    <div>
      {
        notes ? notes.map((note) => <Note key={note._id} note={note} />) : <>
          <NoteSkeleton />
          <NoteSkeleton />
          <NoteSkeleton />
        </>
      }
    </div>
  );
}
