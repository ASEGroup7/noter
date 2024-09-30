"use client"

import Link from "next/link";
import Image from "next/image";
import CustomTooltip from "./custom-tooltip";
import { PlusIcon } from "@heroicons/react/24/solid";
import { StarIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import axios from "axios";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Doc } from "@convex/dataModel";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { User } from "@clerk/clerk-sdk-node";
import { copyToClipboard, toPascalCase } from "@/lib/utils";

export default function Note({
  note,
  variant = "horizontal",
  className,
}: {
  note: Doc<"notes">,
  variant?: "horizontal" | "vertical",
  className?: string,
}) {
  const [ creator, setCreator ] = useState<User| null>(null);

  useEffect(() => {
    async function getCreatorData() {
      axios
        .get("/api/user", { params: { id: note.userId }})
        .then((res) => {
          console.log(res.data);
          setCreator(res.data.user);
        })
        .catch((e) => console.log("Error fetching creator data", e));
    }

    getCreatorData();
  }, [note?.userId]);

  if(creator === null) return null;

  return(
    <Link href={`/notes/view?id=${note?._id}`} className={cn(
      className,
      "flex gap-3",
      variant === "horizontal" ? "items-center" : "flex-col",
    )}>
      <Image
        src={note?.fileUrl || ""}
        alt="Header image"
        height={80}
        width={100}
        className={cn(
          "order-last",
          variant === "horizontal" ? "ml-auto" : "",
        )}
      />

      <div className="flex flex-col my-4">
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="size-4">
            <AvatarImage src={creator?.imageUrl} />
            <AvatarFallback />
          </Avatar>

          <Link href={`/profile/${creator.id}`} className="text-sm hover:underline">{toPascalCase(creator?.username || creator?.fullName || "")}</Link>
          {note?.tags && note?.tags.length > 0 && (
            <small className="flex w-full gap-1">
              <span className="text-muted-foreground">in</span>
              {/* {note.tags[0]} */}
                {note.tags.map((tag,index) => (
                  <span key={tag+index}>
                    {tag}
                    {index !== note.tags.length - 1 && ", "}  
                  </span>
                ))}
            </small>
          )}
        </div>

        <h1 className="text-xl font-bold">{note?.title}</h1>
        <h3 className="text-muted-foreground mb-6">{note?.description}</h3>
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-4">
            <small>
              {format(
                new Date(note?._creationTime || 0),
                "MMM yyy"
              )}
            </small>

            <CustomTooltip 
              trigger={<><StarIcon className="size-4" /><span className="text-sm">{note?.stars || 0}</span></>}
              content={note?.stars + " likes"}
            />

            <CustomTooltip
              trigger={<><ChartBarIcon className="size-4" /><span className="text-sm">{note?.downloads || 0}</span></>}
              content={note?.downloads + " downloads"}
            />
          </div>
        </div>
      </div>
    </Link>
  )
  
}