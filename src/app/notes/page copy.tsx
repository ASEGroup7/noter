"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UploadDropzone } from "@/lib/uploadthing";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { DocumentTextIcon, StarIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { formatTimeSince } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { api } from "../../../convex/_generated/api";
import { usePaginatedQuery, useQuery, useMutation } from "convex/react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function Page() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <div className="min-h-[calc(100vh-60px)] px-[5%] grid grid-cols-12">
      <TagsSection onSelectedTagsChange={setSelectedTags} />
      <NotesSection selectedTags={selectedTags} />
    </div>
  );
}

function TagsSection({
  onSelectedTagsChange,
}: {
  onSelectedTagsChange: (tags: string[]) => void;
}) {
  const [tagsFilter, setTagsFilter] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const debouncedTagFilter = useDebouncedCallback(setTagsFilter, 300);
  const tags = useQuery(api.tags.get.list, { search: tagsFilter });

  useEffect(() => {
    onSelectedTagsChange(selectedTags);
  }, [selectedTags, onSelectedTagsChange]);

  return (
    <section className="col-span-4 border-r border-gray-100 pt-6 pr-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <Input
          defaultValue={tagsFilter}
          placeholder="Filter tags"
          onChange={(e) => debouncedTagFilter(e.target.value)}
        />
        <Button variant="destructive" onClick={() => setSelectedTags([])}>
          Reset
        </Button>
      </div>

      {/* Tag Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
         {tags ? (
          tags.map((item) => {
            return (
              <Badge
                key={item.tag}
                variant="outline"
                onClick={() => {
                  if (selectedTags.includes(item.tag))
                    setSelectedTags(
                      selectedTags.filter(
                        (selectedTag) => selectedTag !== item.tag
                      )
                    );
                  else setSelectedTags([...selectedTags, item.tag]);
                }}
                className={`hover:cursor-pointer hover:bg-slate-100 transition ${selectedTags.includes(item.tag) ? "bg-slate-100" : "bg-white"}`}
              >
                {item.tag}
              </Badge>
            );
          })
        ) : (
          <>
            <Skeleton className="w-[100px] h-[20px] rounded-md shadow-md" />
            <Skeleton className="w-[90px] h-[20px] rounded-md shadow-md" />
            <Skeleton className="w-[80px] h-[20px] rounded-md shadow-md" />
            <Skeleton className="w-[70px] h-[20px] rounded-md shadow-md" />
            <Skeleton className="w-[60px] h-[20px] rounded-md shadow-md" />
            <Skeleton className="w-[50px] h-[20px] rounded-md shadow-md" />
            <Skeleton className="w-[50px] h-[20px] rounded-md shadow-md" />
          </>
        )}
      </div>
    </section>
  );
}

function NotesSection({ selectedTags }: { selectedTags: string[] }) {
  const router = useRouter();

  const [nameFilter, setNameFilter] = useState("");
  const [fileUploadComplete, setFileUploadComplete] = useState(false);

  const debouncedNameFilter = useDebouncedCallback(setNameFilter, 300);
  const createNewNote = useMutation(api.notes.put.create);
  const {
    results: notes,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.notes.get.list,
    {
      search: nameFilter,
      tags: selectedTags,
    },
    { initialNumItems: 10 }
  );

  return (
    <section className="col-span-8 pt-6 pl-4">
      {/* Search Bar */}
      <div className="flex items-center text-lg gap-2">
        <h1>Notes</h1>
        <h2 className="text-slate-400">0</h2>
        <Input
          defaultValue={nameFilter}
          placeholder="Filter by name"
          onChange={(e) => debouncedNameFilter(e.target.value)}
        />
        <Dialog>
          <DialogTrigger>
            <div className={buttonVariants({ variant: "secondary" })}>
              <ArrowUpTrayIcon className="h-6 w-6" />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
              <DialogDescription>
                Drag and drop your files here. Click to upload.
              </DialogDescription>
            </DialogHeader>
            <UploadDropzone
              disabled={fileUploadComplete}
              endpoint="fileUploader"
              className="
                ut-label:text-primary
                ut-button:bg-primary
                ut-allowed-content:uppercase
              "
              onClientUploadComplete={async (res) => {
                setFileUploadComplete(true);
                const newNoteId = await createNewNote({
                  fileUrl: res[0].url,
                  fileId: res[0].key,
                });
                router.push(`/notes/upload/${newNoteId}`);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes List */}
      <div className="flex flex-col gap-4 px-2 mt-3">
        {notes.map(note => {
          return(<Link href={`/notes/view/${note._id}`} key={note._id} className="w-full h-[60px] bg-slate-50 shadow-sm rounded-lg grid grid-rows-2 px-3 py-1.5">
            <div className="w-full text-md font-semibold">{note.title}</div>
            <div className="flex items-center text-muted-foreground gap-1">
              <small className="flex items-center">
                <DocumentTextIcon className="size-4 mr-1" />
                PDF
              </small>
              <span>•</span>
              <small>{`Uploaded ${formatTimeSince(note._creationTime)}`}</small>
              <span>•</span>
              <small className="flex items-center">
                {note.stars}
                <StarIcon className="size-4 ml-1 fill-yellow-300" />
              </small>
            </div>
          </Link>)
        })}
      </div>
    </section>
  );
}