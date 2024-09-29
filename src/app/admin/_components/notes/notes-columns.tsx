/* eslint-disable react-hooks/rules-of-hooks */

import { ExternalLink, Trash2 } from "lucide-react";
import { Square2StackIcon } from "@heroicons/react/24/outline";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StarIcon, ChartBarIcon, EllipsisHorizontalIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import React from "react";
import { api } from "@convex/api";
import { format } from "date-fns";
import { Doc } from "@convex/dataModel";
import { useMutation } from "convex/react";
import { ColumnDef } from "@tanstack/react-table";
import { cn, copyToClipboard, truncateString } from "@/lib/utils";

export const notesColumns: ColumnDef<Doc<"notes">>[] = [
  {
    accessorKey: "_id",
    header: () => <div className="font-bold">Id</div>,
    cell: ({row}) => (
      <Button variant="outline" onClick={() => copyToClipboard(row.getValue("_id"))}>
        <Square2StackIcon className="size-4" />
      </Button>
    )
  },
  {
    accessorKey: "userId",
    header: "Owner",
    cell: ({row}) => {
      const userId = row.getValue("userId") as string;
      return truncateString(userId, 10);
    }
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({row}) => {
      const value = row.getValue("description") as string;
      return truncateString(value, 50);
    }
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({row}) => {
      const tags = row.getValue("tags") as string[];
      console.log(typeof tags === 'object' && Array.isArray(tags));
      return tags?.map((tag, index) => (
        <span key={tag}>
          <span className="underline">{tag}</span>
          {index !== tags.length - 1 && ", "}
        </span>
      ))
    }
  },
  {
    accessorKey: "stars",
    header: () => <div className="flex items-center justify-center"><StarIcon className="size-4 fill-yellow-400" /></div>,
    cell: ({row}) => {
      const value = row.getValue("stars") as number;
      return <div className="text-center">{value}</div>
    }
  },
  {
    accessorKey: "downloads",
    header: () => <div className="flex items-center justify-center"><ChartBarIcon className="size-4" /></div>,
    cell: ({row}) => {
      const value = row.getValue("downloads") as number;
      return <div className="text-center">{value}</div>
    }
  },
  {
    accessorKey: "_creationTime",
    header: ({column}) => {
      return <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <span>Created on</span>
        <ArrowsUpDownIcon className="size-4 ml-2" />
      </Button>
    },
    cell: ({row}) => {
      const formattedDate = format(row.getValue("_creationTime"), "MMM dd");
      return formattedDate;
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({row}) => {
      const fullRow = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => copyToClipboard(fullRow._id)}>Copy ID</DropdownMenuItem>
            <DropdownMenuItem onClick={() => copyToClipboard(fullRow.userId)}>Copy owner ID</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
]