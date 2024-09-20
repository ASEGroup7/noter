"use client";

import Image from "next/image";
import PageSkeleton from "@/app/notes/view/_components/pageskeleton";
import { StarIcon, ChartBarIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Doc } from "@convex/dataModel";
import { useUser } from "@clerk/nextjs";
import { copyToClipboard } from "@/lib/utils";

export default function Note({
  note,
  variant,
}: {
  note: Doc<"notes">;
  variant: "vertical" | "horizontal";
}) {
  
  const user = useUser();
  const id = user.user?.id;

  // Shit. how the fuck are we going to handle likes?
  return(
    <div className={cn(
      "flex",
      variant === "vertical" ? "flex-col" : ""
    )}>
      <Image src={note?.fileUrl} alt="placeholder" height={100} width={80} />
      
    </div>
  )
}
