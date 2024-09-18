"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TagSelector } from "@/components/common/tagselector";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { api } from "@convex/api";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "convex/react"
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string(),
  tags: z.array(z.string()).min(1),
})

export default function EditForm({
  id,
  className,
} : {
  id : string,
  className ?: string,
}) {
  const [ isSubmitted, setIsSubmitted ] = useState(false);

  const note = useQuery(api.notes.get.id, { id });
  const updateNote = useMutation(api.notes.put.update);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note?.title,
      description: note?.description,
      tags: note?.tags,
    }
  })
  
  function handleSubmit(values : z.infer<typeof formSchema>) {
    setIsSubmitted(true);
    updateNote({ ...values, id }).then(() => {
      toast("Your notes have been uploaded!", {
        description: `${format(new Date().getTime(), "dd/MM/yyyy")}`
      })
    }).catch(e => {
      console.error(e.message);
    })
  }

  //TODO : BUG data form values not taking values from database. Instead just taking the defaultValues defined above.
  return(<>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-4", className)}>
      <div className="space-y-4">
        <h1 className="text-5xl font-bold">Upload Notes</h1>
        <p className="text-muted-foreground">Let&rsquo;s fill up some information about your notes.</p>
      </div>
        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Document title here ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={(field) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagSelector value={field.field.value} onChange={field.field.onChange} />
              </FormControl>
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
                  className="resize-none h-[150px]" 
                  placeholder="Give a short description of your notes here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="default" type="submit" disabled={isSubmitted}>Upload</Button>
      </form>
    </Form>
  </>)
}