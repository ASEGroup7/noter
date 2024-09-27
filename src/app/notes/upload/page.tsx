"use client"

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import Tiptap from "@/components/common/editor/tiptap";
import { TagSelector } from "@/components/common/tag-selector";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import { z } from "zod";
import { useState } from "react";
import { api } from "@convex/api";
import DOMPurify from "dompurify";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { HTMLContent } from "@tiptap/core";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  tags: z.array(z.string()),
});

export default function Page() {
  const [editorContent, setEditorContent] = useState<HTMLContent>("");
  const [isUploading, setIsUploading] = useState(false); 
  
  const router = useRouter();
  const { user } = useUser();
  const createNewNote = useMutation(api.notes.put.create);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true);

    const cleanHTML = DOMPurify.sanitize(editorContent);
    createNewNote({
      description: values.description,
      html: cleanHTML,
      fileUrl: "",
      fileId: "",
      stars: 0,
      downloads: 0,
      tags: values.tags,
      title: values.title,
      userId: user?.id,
    })
    .then(id => router.push(`/notes/view?id=${id}`))
    .catch(e => {
      console.log(e);
      setIsUploading(false);
    });
  }

  return(
    <ResizablePanelGroup
      direction="horizontal"
      className="flex-1"
    >
      <ResizablePanel defaultSize={70}>
        <Tiptap
          initialValue=""
          className="p-4 no-scrollbar"
          onChange={setEditorContent}
          editable
        />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={30} maxSize={30}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4 gap-4 flex flex-col h-full">
          <h1 className="text-3xl font-bold">Details</h1>
          <FormField
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Write a title ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Briefly describe your notes ..."
                    className="max-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagSelector value={field.value} onChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-auto"
            disabled={isUploading} // Disable button when loading
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </form>
      </Form>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}