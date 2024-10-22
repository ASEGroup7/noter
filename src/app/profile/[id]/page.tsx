"use client"

import Note from "@/components/common/note";
import EditForm from "./_components/editform";
import { Skeleton } from "@/components/ui/skeleton";
import PageContainer from "@/components/layout/page-container";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EllipsisHorizontalIcon, LinkIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CustomTooltip from "@/components/common/custom-tooltip";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import axios from "axios";
import { api } from "@convex/api";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { User } from "@clerk/clerk-sdk-node";
import { usePaginatedQuery } from "convex/react";
import { useState, useEffect, useRef } from "react";
import { useScroll } from "@/components/hooks/useScroll";
import { toPascalCase, copyToClipboard } from "@/lib/utils";

export default function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const notesRef = useRef<HTMLDivElement | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  const { user: currentUser } = useUser();
  const isProfileOwner = params.id === currentUser?.id;
  const { results, status, loadMore } = usePaginatedQuery(api.notes.get.userId, { userId: params.id ? params.id : "skip" }, { initialNumItems: 5 })

  const router = useRouter();

  const user = useUser();

  if(user.isLoaded && !user.isSignedIn) router.push("/");

  if (!params.id) notFound();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axios.get("/api/user", {
          params: { id: params.id },
        });

        setProfileUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    getUserData();
  }, [params.id]);

  useScroll(notesRef, () => loadMore(5));

  return (
    <PageContainer>
      <div ref={notesRef} className="flex items-center gap-4 py-10 border-b">
        <div className="flex items-center justify-left gap-4">
          <Avatar className="h-[80px] w-[80px]">
            <AvatarImage src={profileUser?.imageUrl} />
            <AvatarFallback />
          </Avatar>
          <div className="flex flex-col">
            {
              profileUser ? <>
                <h1 className="text-4xl font-bold">
                  {toPascalCase(
                    profileUser?.username || profileUser?.fullName || ""
                  )}
                </h1>
                <small className="text-xs">
                  {format(
                    new Date(profileUser?.createdAt || 0),
                    "'Joined ' MMM yyyy"
                  )}
                </small>
              </>
              : <>
                <Skeleton className="h-[40px] w-[200px]" />
                <Skeleton className="h-[16px] w-[80px] mt-1" />
              </>
            }
          </div>
        </div>

        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-auto">
              <EllipsisHorizontalIcon className="size-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {isProfileOwner && (
                <DropdownMenuGroup>
                  <DialogTrigger className="w-full">
                    <DropdownMenuItem>
                      <PencilIcon className="size-4 mr-2" />
                      Edit profile
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem
                    onClick={() => copyToClipboard(window.location.href)}
                  >
                    <LinkIcon className="size-4 mr-2" />
                    Copy link
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}

              {!isProfileOwner && (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => copyToClipboard(window.location.href)}
                    >
                      <LinkIcon className="size-4 mr-2" />
                      Copy link
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="focus:text-red-500 text-red-500 transition-all">
                    Report user
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile information</DialogTitle>
            </DialogHeader>
            <EditForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-between items-center border-b pt-2 pb-5">
        <h1 className="text-3xl font-bold pt-2">My Notes</h1>
        <div className="flex justify-end">
          <CustomTooltip
            trigger={
              <PlusIcon className="size-10 pt-3 hover:cursor-pointer fill-slate-600 hover:fill-black transition-all" />
            }
            content="New note"
            onClick={() => router.push("/notes/upload")}
          />
        </div>
      </div>
      <div className="overflow-y-auto max-h-[26rem] hide-scrollbar">
        {results.map((note) => (
          <Note key={note._id} note={note} />
        ))}
      </div>
    </PageContainer>
  );
}