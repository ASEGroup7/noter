"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DOMPurify from "dompurify";
import { generateReactHelpers } from "@uploadthing/react";
import { api } from "@convex/api";
import { OurFileRouter } from "@/app/api/uploadthing/core";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Tiptap from "@/components/common/editor/tiptap";
import ImageSelector from "@/components/common/image-selector";
import { TagSelector } from "@/components/common/tag-selector";

const { uploadFiles } = generateReactHelpers<OurFileRouter>();

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  tags: z.array(z.string()),
  image: z.instanceof(File),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateNotePage() {
  const [editorContent, setEditorContent] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const { user } = useUser();
  const createNewNote = useMutation(api.notes.put.create);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      image: undefined,
    },
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const [uploadResult] = await uploadFiles("fileUploader", { files: [file] });
      return uploadResult.url;
    } catch (error) {
      console.error("File upload failed:", error);
      throw new Error("File upload failed");
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setIsUploading(true);

    try {
      const fileUrl = await handleImageUpload(values.image);
      const cleanHTML = DOMPurify.sanitize(editorContent);

      const noteId = await createNewNote({
        description: values.description,
        html: cleanHTML,
        fileUrl: fileUrl,
        fileId: "",
        stars: 0,
        downloads: 0,
        tags: values.tags,
        title: values.title,
        userId: user?.id,
      });

      router.push(`/notes/view?id=${noteId}`);
    } catch (error) {
      console.error("Note creation failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      <EditorPanel content={editorContent} onChange={setEditorContent} />
      <ResizableHandle withHandle />
      <FormPanel form={form} onSubmit={handleSubmit} isUploading={isUploading} />
    </ResizablePanelGroup>
  );
}

const EditorPanel = ({ content, onChange }: { content: string; onChange: (content: string) => void }) => (
  <ResizablePanel defaultSize={70}>
    <Tiptap
      initialValue={content}
      className="p-4 no-scrollbar"
      onChange={onChange}
      editable
    />
  </ResizablePanel>
);

const FormPanel = ({ form, onSubmit, isUploading } : {
  form: any;
  onSubmit: (values: any) => Promise<void>;
  isUploading: boolean;
}) => (
  <ResizablePanel defaultSize={30} maxSize={30}>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 gap-4 flex flex-col h-full">
        <h1 className="text-3xl font-bold">Details</h1>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Header Image</FormLabel>
              <FormControl>
                <ImageSelector name="image" control={form.control} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
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
          name="description"
          render={({ field }) => (
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
        <SubmitButton isUploading={isUploading} />
      </form>
    </Form>
  </ResizablePanel>
);

const SubmitButton = ({ isUploading } : { isUploading : boolean }) => (
  <Button type="submit" className="mt-auto" disabled={isUploading}>
    {isUploading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Uploading...
      </>
    ) : (
      'Upload'
    )}
  </Button>
);