"use client"

import EditForm from "./_components/editform";
import { Skeleton } from "@/components/ui/skeleton";
import PageContainer from "@/components/layout/page-container";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EllipsisHorizontalIcon, LinkIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import axios from "axios";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { User } from "@clerk/clerk-sdk-node";
import { toPascalCase, copyToClipboard } from "@/lib/utils";

export default function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const [profileUser, setProfileUser] = useState<User | null>(null);

  const { user: currentUser } = useUser();
  const isProfileOwner = params.id === currentUser?.id;

  if (!params.id) notFound();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axios.get("/api/user", {
          params: { id: params.id },
        });
        console.log(data.user);
        setProfileUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    getUserData();
  }, [params.id]);

  // TODO: Add skeleton for when user is still loading.
  return (
    <PageContainer>
      <div className="flex items-center gap-4 py-10 border-b">
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
    </PageContainer>
  );
}