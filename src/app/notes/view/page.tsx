"use client";

import Comments from "./_components/comments";
import PageSkeleton from "./_components/pageskeleton";
import CustomTooltip from "@/components/common/customtooltip";
import PageContainer from "@/components/layout/pagecontainer";
import { EllipsisHorizontalIcon, PlusIcon, LinkIcon } from "@heroicons/react/24/solid";
import { StarIcon, ChartBarIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import { api } from "@convex/api";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { copyToClipboard } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useUser } from '@clerk/nextjs';
import axios from "axios";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (id === null) router.push("/notes");

  const note = useQuery(api.notes.get.id, { id: id as string });
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

        // Use user.update() for client-side metadata update
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

          <Comments
            fileId={id?id:""}
            userId={user?.id as string}
            trigger={
              <CustomTooltip
                trigger={
                  <>
                    <ChatBubbleOvalLeftIcon className="size-4" />
                    <span>{note?.downloads || 0}</span>
                  </>
                }
                content="Comments"
              />
            }
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
  );
}
