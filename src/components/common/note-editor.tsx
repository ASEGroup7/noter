"use client"

import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Tiptap from "@/components/common/editor/tiptap";
import ImageSelector from "@/components/common/image-selector";
import { TagSelector } from "@/components/common/tag-selector";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form schema derived from FormProps
const formSchema = z.object({
  html: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  tags: z.array(z.string()),
  image: z.union([z.instanceof(File), z.string()]),
});

type FormProps = z.infer<typeof formSchema>;

interface NoteEditorProps {
  editable?: boolean,
  onSubmit: (data: FormProps) => void;
  onError?: () => void;
  onSuccess?: () => void;
  html: string,
  title: string,
  description: string,
  tags: string[]
  image: string | File,
}

export default function NoteEditor(props: NoteEditorProps) {
  const form = useForm<FormProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      html: props.html,
      title: props.title,
      description: props.description,
      tags: props.tags
    }
  });

  return(
    <ResizablePanelGroup
      direction="horizontal"
      className="flex-1"
    >
      <ResizablePanel defaultSize={70}>
        {!props.html ? null : (
          <Tiptap
            initialValue={props.html}
            className="p-4 no-scrollbar"
            editable={props.editable}
            onChange={(value) => form.setValue('html', value)}
          />
        )}
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={30} maxSize={30}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(props.onSubmit)} className="p-4 gap-4 flex flex-col h-full">
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
              name="description"
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
            <Button type="submit" className="mt-auto">
              Save
            </Button>
          </form>
        </Form>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}