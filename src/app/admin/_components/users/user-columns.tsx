"use client"

import { Ban } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import CustomTooltip, { CustomTooltipProps } from "@/components/common/custom-tooltip";
import { EllipsisHorizontalIcon, Square2StackIcon } from "@heroicons/react/24/outline";

import { User } from "@clerk/nextjs/server";
import { cn, copyToClipboard } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface TableTooltipProps extends CustomTooltipProps {};

function TableTooltip(props: TableTooltipProps) {
  return <CustomTooltip
    {...props}
    trigger={
      <div className={cn(
        buttonVariants({ variant: "outline" }),
        "size-8 p-0",
      )}>
        {props.trigger}
      </div>
    }
  />
}

export const userColumns : ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({row}) => {
      const value = row.getValue("id") as string;

      return <TableTooltip 
        content={value}
        onClick={() => copyToClipboard(value)}
        trigger={<Square2StackIcon className="size-4" />}
      />
    }
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({row}) => {
      const value = row.getValue("username") as string

      if(!value) return "-";

      return <div className="flex items-center justify-start">
        <TableTooltip 
          content={value}
          onClick={() => copyToClipboard(value)}
          trigger={<Square2StackIcon className="size-4" />}
        />
      </div> 

    },
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "emailAddresses",
    header: "Email Address",
    cell: ({row}) => {
      const emails = row.original.emailAddresses;
      return emails.map((email) => email.emailAddress).join(", ");
    },
  },
  {
    accessorKey: "lastSignInAt",
    header: "Last Sign In",
    cell: ({row}) => row.original.lastSignInAt ? new Date(row.original.lastSignInAt).toLocaleString() : 'Never',
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({row}) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    accessorKey: "banned",
    header: "Banned",
    cell: ({row}) => (row.original.banned ? "Yes" : "No"),
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
            <DropdownMenuItem onClick={() => copyToClipboard(fullRow.id)}>Copy user ID</DropdownMenuItem>
            <DropdownMenuItem onClick={() => copyToClipboard(fullRow.primaryEmailAddress?.emailAddress || "")}>Copy email address</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Ban className="size-4 mr-2" />
              <span>Ban user</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]