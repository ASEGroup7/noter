
"use client"

// Painful to both read and write
// I made it a client component because I have no idea how to query the convex database without using the useQuery hook..

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bars3BottomRightIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { DropdownMenu,DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { api } from "@convex/api";
import { notesColumns } from "./notes-columns";
import { usePaginatedQuery } from "convex/react";
import { ColumnDef, SortingState, ColumnFiltersState, VisibilityState, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";

interface NotesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DataTable<TData, TValue>({ columns, data } : NotesTableProps<TData, TValue>) {
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
      placeholder="Filter titles ..."
      value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
      onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
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

export default function NotesTable() {
  const {
    results: notes,
    status,
    loadMore,
  } = usePaginatedQuery(api.notes.get.list, {}, { initialNumItems: 5 });

  return (
    <DataTable columns={notesColumns} data={notes} />
  )
}