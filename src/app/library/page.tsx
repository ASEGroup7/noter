"use client"

import { Button } from "@/components/ui/button";
import PageContainer from "@/components/layout/page-container";
import CustomTooltip from "@/components/common/custom-tooltip";
import { PlusIcon } from "@heroicons/react/24/solid";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import NotesSection from "./_components/notes-section";

export default function Page() {

  const user = useUser();
  const router = useRouter();

  if(user.isLoaded && !user.isSignedIn) router.push("/");

  return(
    <PageContainer>
      <div className="flex items-center gap-4 py-10 border-b">
        <h1 className="text-4xl font-bold">Your notes</h1>
        <div className="flex ml-auto items-center">
          <CustomTooltip
            trigger={<PlusIcon className="size-7 hover:cursor-pointer fill-slate-600 hover:fill-black transition-all" />}
            content="New note" 
            onClick={() => router.push("/notes/upload")}
          />
        </div>
      </div>
      <div>
        <NotesSection starredFileId={user.user?.publicMetadata.starredFileId as Array<string>}/>
      </div>
    </PageContainer>
  )
}