"use client"

import PageSkeleton from "./_components/pageskeleton";
import CustomTooltip from "@/components/common/customtooltip";
import PageContainer from "@/components/layout/pagecontainer";
import { StarIcon, ChartBarIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { EllipsisHorizontalIcon, PlusIcon, LinkIcon } from "@heroicons/react/24/solid";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import { api } from "@convex/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { copyToClipboard } from "@/lib/utils";
import { useSearchParams, usePathname } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if(id === null) router.push("/notes");

  const note = useQuery(api.notes.get.id, { id: id as string });

  if(note === undefined) return <PageSkeleton />

  return (
    <PageContainer>
      <h1 className="text-4xl font-bold mt-12">{note?.title}</h1>
      <h3 className="text-xl mt-5 mb-2 text-zinc-600">{note?.description}</h3>
      <small className="flex w-full flex-wrap mb-5 gap-1">
        <span>In</span>
        {note?.tags.map((tag, index) => (
          <span key={tag} className="underline">
            {tag}
            {index !== note.tags.length - 1 && ", "}
          </span>
        ))}
      </small>
      <div className="flex px-1 py-4 border-y justify-between mb-4">
        <div className="flex gap-4">
          <CustomTooltip 
            trigger={<><StarIcon className="size-4" /><span>{note?.stars || 0}</span></>}
            content="Likes"
          />
          <CustomTooltip 
            trigger={<><ChartBarIcon className="size-4" /><span>{note?.downloads || 0}</span></>}
            content="Downloads"
          />
          <CustomTooltip
            trigger={<><ChatBubbleOvalLeftIcon className="size-4" /><span>{note?.downloads || 0}</span></>}
            content="Comments"
          />
        </div>

        {/* TODO: Add creator information section here. */}

        <div className="flex gap-4">
          <CustomTooltip trigger={<PlusIcon className="size-6" />} onClick={() => console.log("Clicked!")}/>
          <CustomTooltip trigger={<LinkIcon className="size-5" />} onClick={() => console.log("Clicked!")} />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisHorizontalIcon className="size-6"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Download</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span className="text-red-700">Report note</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Here we display the sanitized HTML */}
    </PageContainer>
  )
}