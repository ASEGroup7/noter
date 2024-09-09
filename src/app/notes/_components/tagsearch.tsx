"use client"

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectSeparator } from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { api } from "@convex/api";
import { useQuery } from "convex/react";
import { useDebouncedCallback } from "use-debounce";
import { useToggle } from "@/components/hooks/useToggle";
import { useSearch } from "@/components/providers/SearchContextProvider";
import { Skeleton } from "@/components/ui/skeleton";

//TODO : Implement tag search on top of our fulltext search
export default function TagSearch({
  className,
} : {
  className?: string,
}) {
  
  const { searchValue, setSearchValue } = useSearch();
  const [ searchTagsValue, setSearchTagsValue ] = useState("");
  const [ selectedTags, setSelectedTags ] = useState<string[]>([]);

  const tags = useQuery(api.tags.get.list ,{ search: searchTagsValue });
  const debouncedSearchTagValue = useDebouncedCallback(setSearchTagsValue, 300);

  return(
    <div className={cn(
      className,
      ""
    )}>
      <Input placeholder="Search tags ..." defaultValue={searchTagsValue} onChange={(e) => debouncedSearchTagValue(e.target.value)} />
      <div className="flex flex-wrap pt-4 gap-2">
        {
          tags ? tags.map(row => (
            <Badge
              key={row.tag}
              variant="outline"
              className={`hover:cursor-pointer hover:bg-slate-100 transition ${selectedTags.includes(row.tag) ? "bg-slate-100" : "bg-white"}`}
            >
              {row.tag}
            </Badge>
          )) : <Skeleton className="w-[100px] h-[20px] rounded-md shadow-md" />
        }
      </div>
    </div>
  )
}