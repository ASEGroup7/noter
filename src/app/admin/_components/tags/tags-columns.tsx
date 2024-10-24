/* eslint-disable react-hooks/rules-of-hooks */

import { BarChart2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Square2StackIcon } from "@heroicons/react/24/outline";
import { StarIcon, EllipsisHorizontalIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import React from "react";
import { api } from "@convex/api";
import { format } from "date-fns";
import { Doc } from "@convex/dataModel";
import { useMutation } from "convex/react";
import { ColumnDef } from "@tanstack/react-table";
import { copyToClipboard, truncateString } from "@/lib/utils";

export const tagsColumns: ColumnDef<Doc<"tags">>[] = [
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
    accessorKey: "tag",
    header: "Tag",
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
      const deleteRow = useMutation(api.tags.delete.remove);

      return (
        <Button variant="destructive" onClick={() => deleteRow({ id: fullRow._id })}>
          <Trash2 className="size-4" />
        </Button>
      )
    }
  },
]