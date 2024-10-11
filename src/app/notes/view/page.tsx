"use client";

import Image from "next/image";
import Comments from "./_components/comments";
import PageSkeleton from "./_components/pageskeleton";
import CustomTooltip from "@/components/common/custom-tooltip";
import PageContainer from "@/components/layout/page-container";
import { EllipsisHorizontalIcon, PlusIcon, LinkIcon } from "@heroicons/react/24/solid";
import { StarIcon, ChartBarIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { api } from "@convex/api";
import { useDebouncedCallback } from "use-debounce";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { copyToClipboard } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Id } from "@convex/dataModel";
import axios from "axios";
import Tiptap from "@/components/common/editor/tiptap";

export default function Page() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (id === null) router.push("/notes");
  
  const note = useQuery(api.notes.get.id, { id: id as string });
  const updateNotesMutation = useMutation(api.notes.put.update);
  const deleteNote = useMutation(api.notes.delete.remove);
  
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [noOfLikes, setNoOfLikes] = useState(note?.stars || 0);
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    if (user?.publicMetadata?.starredFileId && Array.isArray(user.publicMetadata.starredFileId) && id) {
      return user.publicMetadata.starredFileId.includes(id as string);
    }
    return false;
  });  
  
  const isOwner = note?.userId === user?.id;
  
  useEffect(() => {
    if(note) setNoOfLikes(note.stars);
  }, [note]);

  const handleLikeClick = async () => {
    if (!isLoaded || !user || !id) return;

    const newLikeState = !isLiked;
    const newLikeCount = newLikeState ? noOfLikes + 1 : noOfLikes - 1;

    setIsLiked(newLikeState);
    setNoOfLikes(newLikeCount);

    try {
      await updateNotesMutation({
        id,
        stars: newLikeCount,
      });

      let currentStarredFileId = user.publicMetadata?.starredFileId as string[] || [];
      const updatedStarredFileId = newLikeState
        ? [...currentStarredFileId, id]
        : currentStarredFileId.filter(item => item !== id);

        await axios.post("/api/user", {
          id: user.id,
          starredFileId: updatedStarredFileId
        });

        console.log("StarredFileId updated successfully!");
    } catch (error) {
      console.error("Failed to update likes or starredFileId:", error);

      setIsLiked(!newLikeState);
      setNoOfLikes(noOfLikes);
    }
  };
  
  function handleDelete() {
    deleteNote({ id: id as Id<"notes"> });
    router.push("/notes");
  }
  
  if (note === undefined) return <PageSkeleton />;
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
            trigger={
              <>
                <StarIcon className={cn(
                  isLiked ? "fill-yellow-400" : "",
                  "transition-colors duration-200 size-4"
                )}
                />
                <span>{noOfLikes || 0}</span>
              </>
            }
            content="Likes"
            onClick={handleLikeClick}
          />
          <CustomTooltip
            trigger={
              <>
                <ChartBarIcon className="size-4" />
                <span>{note?.downloads || 0}</span>
              </>
            }
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
          <CustomTooltip trigger={<LinkIcon className="size-5" />} onClick={() => copyToClipboard(window.location.href)} />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisHorizontalIcon className="size-6" />
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
        {
          note?.html && (
            <Tiptap
              initialValue={note.html}
              editable={false}
            />
          )
        }
      </div>

      <Comments fileId={id || ""} open={isCommentsOpen} onOpenChange={setIsCommentsOpen} />
    </PageContainer>
  );
}
