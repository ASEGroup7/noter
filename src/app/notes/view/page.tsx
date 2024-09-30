"use client";

import Image from "next/image";
import Comments from "./_components/comments";
import { Button } from "@/components/ui/button";
import PageSkeleton from "./_components/pageskeleton";
import CustomTooltip from "@/components/common/custom-tooltip";
import PageContainer from "@/components/layout/page-container";
import { EllipsisHorizontalIcon, PlusIcon, LinkIcon } from "@heroicons/react/24/solid";
import { StarIcon, ChartBarIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { api } from "@convex/api";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { copyToClipboard } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Tiptap from "@/components/common/editor/tiptap";
import { Id } from "@convex/dataModel";
import axios from "axios";

export default function Page() {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (id === null) router.push("/notes");

  const note = useQuery(api.notes.get.id, { id: id as string });
  const deleteNote = useMutation(api.notes.delete.remove);
  const creatorId = note?.userId;
  const isOwner = creatorId === user?.user?.id;
  const { user, isLoaded } = useUser(); // Get the user and loading state here at the top

  // Mutation to increment likes in the database
  const updateNotesMutation = useMutation(api.notes.put.update);

  // Local state to manage likes (optimistic UI)
  const [noOfLikes, setNoOfLikes] = useState(note?.stars || 0);
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    // Check if user, publicMetadata, starredFileId, and id exist before checking includes
    console.log("has user liked this: ", user?.publicMetadata?.starredFileId);
    if (user?.publicMetadata?.starredFileId && Array.isArray(user.publicMetadata.starredFileId) && id) {
      return user.publicMetadata.starredFileId.includes(id as string);
    }
    return false; // Default to false if no match
  });  

  useEffect(() => {
    // When the note is fetched, update the likes in the state
    if (note) {
      setNoOfLikes(note.stars);
    }
  }, [note]);

  // Function to handle the like click
  const handleLikeClick = async () => {
    if (!isLoaded || !user) return; // Ensure the user is loaded

    if (!isLiked){
      setNoOfLikes((prevLikes) => prevLikes + 1); // Optimistic update
    }
    else {
      setNoOfLikes((prevLikes) => prevLikes - 1); // Optimistic update
    }
    setIsLiked(!isLiked);

    try {
      // Call the mutation to update the stars (likes)
      if (id !=null && !isLiked){
        await updateNotesMutation({
          id,
          stars: (note?.stars || 0) + 1, // Increment the stars in the mutation
        });  

        let currentStarredFileId = user.publicMetadata?.starredFileId || [];
        const updatedStarredFileId = Array.isArray(currentStarredFileId)
          ? [...currentStarredFileId, id]
          : [id]; // Ensure it's an array
        // Use user.update() for client-side metadata update
        const { data } = await axios.post("/api/user", {
          id: user.id,
          starredFileId: updatedStarredFileId
        });
        currentStarredFileId = updatedStarredFileId;
      }
      else if (id !=null && isLiked){
        await updateNotesMutation({
          id,
          stars: (note?.stars || 0) - 1, 
        });  

        let currentStarredFileId = user.publicMetadata?.starredFileId || [];
        const updatedStarredFileId = Array.isArray(currentStarredFileId)
        ? [...currentStarredFileId.filter(item => item !== id)]
        : []

        const { data } = await axios.post("/api/user", {
          id: user.id,
          starredFileId: updatedStarredFileId
        });

        currentStarredFileId = updatedStarredFileId;
      }
      
      console.log("StarredFileId updated successfully!");
    } catch (error) {
      console.error("Failed to update likes or starredFileId:", error);
      setIsLiked(!isLiked);
      setNoOfLikes(noOfLikes - 1);
    }
  };

  if (note === undefined) return <PageSkeleton />;

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
            trigger={
              <>
                <StarIcon className={`${
                  isLiked ? "size-6 text-yellow-400" : "size-4"
                  } transition-all duration-200`
                } />
                <span>{noOfLikes}</span>
              </>
            }
            content="Likes"
            onClick={handleLikeClick} // Handle click event
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
          <CustomTooltip trigger={<PlusIcon className="size-6" />} onClick={() => console.log("Clicked!")} />
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
        {note?.html && (
          <div className="prose prose-sm sm:prose-base max-w-none">
            <div dangerouslySetInnerHTML={{ __html: note.html }} />
          </div>
        )}
      </div>

      <Comments open={isCommentsOpen} onOpenchange={setIsCommentsOpen}/>
    </PageContainer>
  );
}
