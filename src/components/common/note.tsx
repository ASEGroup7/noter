"use client"

import Link from "next/link";
import Image from "next/image"
import { BarChart2, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import axios from "axios";
import { cn, toPascalCase } from "@/lib/utils";
import { format } from "date-fns";
import { Doc } from "@convex/dataModel";
import { useState, useEffect } from "react";
import { User } from "@clerk/clerk-sdk-node";

interface NoteProps {
  note: Doc<"notes">,
  className?: string,
}

export default function Note({ note, className } : NoteProps) {

  const [creatorData, setCreatorData] = useState<User | null>(null);

  useEffect(() => {
    async function getCreatorData() {
      axios
      .get("/api/user", { params: { id: note.userId }})
      .then((res) => setCreatorData(res.data.user))
      .catch((e) => console.log("Error fetching creator data", e))
    }

    getCreatorData();
  }, [note])

  return (
    <Link 
      href={`/notes/view?id=${note._id}`}
      className={cn(
        "",
        className
      )}>
      <div className="flex flex-col sm:flex-row-reverse gap-4 max-w-3xl mx-auto p-4">
          <Image
            src={note.fileUrl}
            alt="Header Image"
            width={150}
            height={150}
            className="w-full h-[150px] sm:w-[150px] object-cover rounded-sm"
          />
        <div className="flex-1 flex flex-col justify-evenly gap-y-2">
          <div className="flex items-center space-x-1 text-sm">
            <Avatar className="size-6">
              <AvatarImage src={creatorData?.imageUrl} />
              <AvatarFallback>{creatorData?.username?.[0]}</AvatarFallback>
            </Avatar>
            <Link 
              href={`/profile/${creatorData?.id}`}
              className="hover:underline pl-1"
            >
              {toPascalCase(creatorData?.username || creatorData?.fullName || "Username")}
            </Link>
            <span className="text-sm text-muted-foreground">{note.tags[0]}</span>
          </div>
          
          <h2 className="text-2xl font-bold">{note.title}</h2>
          <p className="text-muted-foreground">{note.description}</p>
          <div className="flex items-center space-x-4 text-sm text-muted-foregrond">
            <span>{format(new Date(note._creationTime || 0), "MMM yyy")}</span>
            <div className="flex items-center">
              <Star className="size-4 mr-1" />
              <span>{note.stars}</span>
            </div>
            <div className="flex items-center">
              <BarChart2 className="size-4 mr-1" />
              <span>{note.downloads}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}