"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetFooter, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { z } from "zod";
import axios from "axios";
import { list } from "postcss";
import { api } from "@convex/api";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { User } from "@clerk/clerk-sdk-node";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, usePaginatedQuery, useMutation } from "convex/react"


interface CommentsProps {
  fileId: string; 
  open: boolean;
  onOpenChange: (state: boolean) => void;
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

  const newComment = useMutation(api.comments.puts.create);

  const { 
    results : comments,
    status,
    loadMore
  } = usePaginatedQuery(
    api.comments.get.list, 
    { fileId: fileId as string }, 
    { initialNumItems: 10 }
  );

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    newComment({
      fileId: fileId || "",
      userId: user?.user?.id || "",
      content: values.comment
    }).then(router.refresh())
  }

  return(
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>

        <div className="space-y-2">
          {comments.map(async (comment) => {
            const userInformation  = await axios.get("/api/user", {
              params: { id: comment.userId }
            })

            const userData : User = userInformation.data.user;

            return <div>
              <Avatar>
                <AvatarImage src={userData.imageUrl} className="w-20" />
                <AvatarFallback />
                <span>{userData.username}</span>  
              </Avatar>
             {comment.content}
            </div>;
          })}
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