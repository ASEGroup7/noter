"use client"

import PageContainer from "@/components/layout/page-container";

import { useUser } from "@clerk/nextjs";
import NotesSection from "./_components/notes-section";

export default function Page() {

  const user = useUser();
  
  return(
    <PageContainer>
      <div className="flex items-center gap-4 py-10 border-b">
        <h1 className="text-4xl font-bold">Liked Notes</h1>
      </div>
      <div>
        <NotesSection starredFileId={user.user?.publicMetadata.starredFileId as Array<string>}/>
      </div>
    </PageContainer>
  )
}