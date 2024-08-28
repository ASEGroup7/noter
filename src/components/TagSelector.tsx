"use client"

import { inputStyles } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "@/lib/utils";

export function TagSelector({ onTagChange } : { onTagChange: (tags: string[]) => void }) {

  const [ selectedTags, setSelectedTags ] = useState<string[]>([]);
  const tags = useQuery(api.tags.get.list, {});

  return (
    <Popover>
      <PopoverTrigger asChild>
        
        <div className={cn(
          inputStyles,
          "flex flex-wrap gap-2 items-center min-h-9 h-fit py-2",
        )}>
          {selectedTags.length == 0 ?
            <span className="text-muted-foreground">No tags selected</span> :
            selectedTags.map((tag) => (
              <Badge key={tag}>
                {tag}
              </Badge>
            ))
          }
            <ChevronDownIcon className="size-4 text-muted-foreground ml-auto"/>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search Tags"/>
          <CommandList>
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
              {tags?.map((row) => (
                <CommandItem
                  key={row._id}
                  value={row.tag}
                  onSelect={() => {
                    if (selectedTags.includes(row.tag)) setSelectedTags(selectedTags.filter(tag => tag !== row.tag));
                    else setSelectedTags([...selectedTags, row.tag]);
                  }}
                >
                  <p>{row.tag}</p>
                  <CheckIcon className={`ml-auto size-4 ${selectedTags?.includes(row.tag) ? "text-primary" : "text-transparent"}`} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}