"use client";

import { Label } from "@/components/ui/label";
import Tiptap from "@/components/common/editor/tiptap";
import { TagSelector } from "@/components/common/tag-selector";
import PageContainer from "@/components/layout/page-container";
// import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
// import EditorShortcutsDialog from "@/components/common/editor-shortcuts-dialog";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { z } from "zod";
import { api } from "@convex/api";
import DOMPurify from "dompurify";
import { useUser } from "@clerk/nextjs";
import { HTMLContent } from "@tiptap/core";
import { useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { stripHtmlTags } from "@/lib/utils";
import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import CustomTooltip from "@/components/common/custom-tooltip";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();
const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
})

export default function Page() {
  const [ isEditorEmpty, setIsEditorEmpty ] = useState(true);
  const [ editorTitle, setEditorTitle ] = useState<HTMLContent>("");
  const [ editorContent, setEditorContent ] = useState<HTMLContent>("");
  const [ selectedTags, setSelectedTags ] = useState<string[]>([]);

  const router = useRouter();
  const { user } = useUser();
  const createNewNote = useMutation(api.notes.put.create);

  function handleSubmit() {
    if(editorTitle === "") return;

    const cleanHTML = DOMPurify.sanitize(editorContent);
    createNewNote({
      description: "", 
      html: cleanHTML, //TODO : remove title first then store as html.
      fileUrl: "",
      fileId: "",
      stars: 0,
      downloads: 0,
      tags: selectedTags,
      title: editorTitle,
      userId: user?.id,
    })
    .then(id => router.push(`/notes/view?id={id}`))
    .catch(e => console.log(e));
  }

  useEffect(() => {
    setIsEditorEmpty(editorTitle === "");
  }, [editorTitle])

  return (
    <PageContainer className="relative flex-1 flex w-full">
        <Tiptap 
          initialValue=""
          onTitleChange={setEditorTitle}
          onContentChange={setEditorContent} 
          editable
        />
        <Dialog>
          <DialogContent>
            <DialogHeader>
              Publishing to : <span className="font-bold">{user?.username || user?.fullName || ""}</span>
            </DialogHeader>
            <Label>Add or change topics so readers know what your note is about</Label>
            <TagSelector value={selectedTags} onChange={setSelectedTags} />
          </DialogContent>
        </Dialog>
      {/* <EditorShortcutsDialog trigger={<QuestionMarkCircleIcon className="size-10 stroke-1 fixed bottom-5 right-5" />} /> */}
    </PageContainer>
  );
}
