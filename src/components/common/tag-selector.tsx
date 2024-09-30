"use client"

import { inputStyles } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronUpIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@convex/api"
import { useState, useEffect } from "react";

export function TagSelector({
  value = [],
  onChange,
} : {
  value : string[],
  onChange : (tags : string[]) => void,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(value);

  const tags = useQuery(api.tags.get.list, {});

  function handleSelect(tag: string) {
    let newTags;
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      if (selectedTags.length < 3) {
        newTags = [...selectedTags, tag];
      } else {
        return;
      }
    }

    setSelectedTags(newTags);
    onChange(newTags);
  }

  useEffect(() => {
    setSelectedTags(value);
  }, [value]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={cn(inputStyles, "flex gap-2 min-h-9 h-fit py-2")}>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {value.length == 0 ? (
              <span className="text-muted-foreground">
                No tags selected ...
              </span>
            ) : (
              value.map((tag) => (
                <Badge className="bg-secondary text-primary" key={tag}>
                  {tag}
                </Badge>
              ))
            )}
          </div>

          <div className="flex items-center">
            <ChevronUpIcon
              className={cn(
                isOpen ? "rotate-0" : "rotate-180",
                "size-4 text-muted-foreground transition-all"
              )}
            />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="p-0 ml-auto">
        <Command>
          <CommandInput placeholder="Search Tags" />
          <CommandList>
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
              {tags?.map((row) => (
                <CommandItem
                  key={row._id}
                  value={row.tag}
                  onSelect={() => handleSelect(row.tag)}
                >
                  <p>{row.tag}</p>
                  <CheckIcon
                    className={`ml-auto size-4 ${selectedTags?.includes(row.tag) ? "text-primary" : "text-transparent"}`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}