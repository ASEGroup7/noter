"use client"

import Image from "next/image";
import Comments from "./_components/comments";
import { Button } from "@/components/ui/button";
import PageSkeleton from "./_components/pageskeleton";
import CustomTooltip from "@/components/common/custom-tooltip";
import PageContainer from "@/components/layout/page-container";
import { EllipsisHorizontalIcon, PlusIcon, LinkIcon } from "@heroicons/react/24/solid";
import { StarIcon, ChartBarIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import { api } from "@convex/api";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { copyToClipboard } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Tiptap from "@/components/common/editor/tiptap";
import { Id } from "@convex/dataModel";

export default function Page() {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if(id === null) router.push("/notes");

  const note = useQuery(api.notes.get.id, { id: id as string });
  const deleteNote = useMutation(api.notes.delete.remove);
  const creatorId = note?.userId;
  const isOwner = creatorId === user?.user?.id;

  if(note === undefined) return <PageSkeleton />

  function handleDelete() {
    deleteNote({ id: id as Id<"notes"> });
    router.push("/notes");
  }

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
            onClick={() => setIsCommentsOpen(true)}
            content="Comments"
          />
        </div>

        {/* TODO: Add creator information section here. */}

        <div className="flex gap-4">
          <CustomTooltip trigger={<span><PlusIcon className="size-6" /></span>} onClick={() => console.log("Clicked!")}/>
          <CustomTooltip trigger={<span><LinkIcon className="size-5" /></span>} onClick={() => copyToClipboard(window.location.href)} />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisHorizontalIcon className="size-6"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {isOwner && (
                  <DropdownMenuItem onClick={() => router.push(`/notes/edit?id=${id}`)}>
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>Download</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {isOwner ? (
                <DropdownMenuItem onClick={handleDelete}>
                  <span className="text-red-700">Delete note</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <span className="text-red-700">Report note</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Here we display the sanitized HTML */}
      <div className="flex flex-col">
        {note?.html && (
          <div className="prose prose-sm sm:prose-base max-w-none">
            <div dangerouslySetInnerHTML={{ __html: note.html }} />
          </div>
        )}
      </div>

      <Comments open={isCommentsOpen} onOpenchange={setIsCommentsOpen}/>
    </PageContainer>
  )
}