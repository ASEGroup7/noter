"use client";

import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/lib/uploadthing";
import { buttonVariants } from "@/components/ui/button";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { api } from "@convex/api";
import { useMutation } from "convex/react";
import { useDebouncedCallback } from "use-debounce";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSearch } from "@/components/providers/SearchContextProvider";

export default function FullTextSearchBar({
  className,
}: {
  className?: string;
}) {
  const [ isFileUploadComplete, setIsFileUploadComplete ] = useState(false);
  const { searchValue, setSearchValue } = useSearch();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const createNewNote = useMutation(api.notes.put.create);
  const debouncedSetSearchValue = useDebouncedCallback(setSearchValue, 300);

  return (
    <div className={cn(className, "flex items-center gap-2")}>
      <h1 className="text-lg">Notes</h1>
      <Input
        placeholder="Filter names ..."
        defaultValue={searchValue}
        onChange={(e) => debouncedSetSearchValue(e.target.value)}
      />

      <Dialog>
        <DialogTrigger>
          <div className={buttonVariants({  variant: "secondary" })}>
            <ArrowUpTrayIcon className="size-4" />
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
            disabled={isFileUploadComplete}
            endpoint="fileUploader"
            className="
              ut-label:text-primary
              ut-button:bg-primary
              ut-allowed-content:uppercase
            "
            onClientUploadComplete={async (res) => {
              setIsFileUploadComplete(true);
              
              const newNoteId = await createNewNote({
                fileUrl: res[0].url,
                fileId: res[0].key,
              });
              
              const params = new URLSearchParams(searchParams.toString());
              params.set("id", newNoteId);
              router.push(pathName + "/upload?" + params);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
