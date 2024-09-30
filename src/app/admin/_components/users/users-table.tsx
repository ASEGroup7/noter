"use client"

//Painful to both read and write

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bars3BottomRightIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { DropdownMenu,DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import axios from "axios";
import { User } from "@clerk/nextjs/server";
import { useState, useEffect } from "react";
import { ColumnDef, SortingState, ColumnFiltersState, VisibilityState, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { userColumns } from "./user-columns";

interface UserTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DataTable<TData, TValue>({ columns, data } : UserTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilter] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    }
  })

  return(<div className="m-4">
    <div className="flex">
      <Input
      placeholder="Filter usernames ..."
      value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
      onChange={(event) => table.getColumn("username")?.setFilterValue(event.target.value)}
      className="max-w-sm"
      /> 
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            <Bars3BottomRightIcon className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuItem
                key={column.id}
                className="capitalize flex gap-1"
                onClick={() => column.toggleVisibility(!column.getIsVisible())}
              >
                <span className="mr-auto">{column.id}</span>
                {
                  column.getIsVisible() ? <CheckIcon className="size-4" /> : ""
                }
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className="rounded-md border mt-2">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          )))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </div>
  )
}

export default function UserTable() {
  const [users, setUsers] = useState<User[] | null>();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axios.get("/api/user", {});
        console.log(data.users.data);
        setUsers(data.users.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    getUserData();
  }, []);

  return (
    <>
      {users ? <DataTable columns={userColumns} data={users} /> : null}
    </>
  );
}