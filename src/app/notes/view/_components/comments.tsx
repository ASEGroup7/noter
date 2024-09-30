"use client"

import CommentBubble from "./comment-bubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetFooter, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { boolean, z } from "zod";
import { api } from "@convex/api";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react"
import { zodResolver } from "@hookform/resolvers/zod";


interface CommentsProps {
  fileId: string;
  open?: boolean;
  onOpenChange?: (state: boolean) => void;
}

const formSchema = z.object({
  comment: z.string().max(200, { message : "Maximum of 200 characters allowed."})
})

export default function Comments({ fileId, open, onOpenChange } : CommentsProps) {

  const user = useUser();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })


  const newComment = useMutation(api.comments.put.create);
  const allComments = useQuery(api.comments.get.list, { fileId: fileId });

  const [localComments, setLocalComments] = useState(allComments);
  const [localCommentElements, setLocalCommentElements] = useState<React.ReactNode[]>([]);

  //TODO : Fetch comments and display them.

  function handleSubmit(values: z.infer<typeof formSchema>) {
    
  }

  return(
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>

        <div className="space-y-2">
          {localCommentElements}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 my-2">
            <FormField
              control={form.control}
              name="comment"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="What are your thoughts?" className="max-h-[200px]" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" variant="default">Comment</Button>
          </form>
        </Form>

        
      </SheetContent>
    </Sheet>
  );
}