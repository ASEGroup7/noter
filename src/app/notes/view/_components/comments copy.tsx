"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetFooter, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import axios from "axios";
import { z } from "zod";
import { api } from "@convex/api";
import { Doc } from "@convex/dataModel";
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })


  const newComment = useMutation(api.comments.put.create);
  const allComments = useQuery(api.comments.get.list, { fileId: fileId });

  // const [localComments, setLocalComments] = useState(allComments);
  const [localCommentElements, setLocalCommentsElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    async function generateCommentElements() {
      if(!allComments) return;


      setLocalCommentsElements([])

      allComments.map(async (comment : Doc<"comments">) => {
        const { data }  = await axios.get("/api/user", {
          params: { id: comment.userId }
        })
        const user = data.user

        setLocalCommentsElements((prevElements) => {
          const newElement = <div key={comment._id}>
            <Avatar>
              <AvatarImage src={user.imageUrl} className="size-4" />
              <AvatarFallback />
            </Avatar>
            <div>{comment.content}</div>
          </div>;

          return prevElements ? [...prevElements, newElement] : [newElement];
        });
      })
    }
    generateCommentElements();
  }, [allComments])

  // useEffect(() => {
  //   setLocalComments(allComments)
  // }, [allComments])

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    if(!user.isLoaded || !user.isSignedIn) return; //Ensure that we have a valid user first before we upload.

    const newCommentId = await newComment({
      fileId: fileId,
      userId: user.user.id,
      content: values.comment,
    })  


    setLocalCommentsElements((prevElements) => {
      const newElement = <div key={newCommentId}>
        <Avatar>
          <AvatarImage src={user.user.imageUrl} className="size-4" />
          <AvatarFallback />
        </Avatar>
        <div>{values.comment}</div>
      </div>;

      return prevElements ? [...prevElements, newElement] : [newElement];
    });
  }

  return(
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>
        {
          localCommentElements
        }

        {/* <div className="space-y-2">
          {localComments?.map((comment) => {
            return <div key={comment._id}>
              {CommentBubble({userId: comment.userId, content: comment.content})}
              </div>
          })}
        </div> */}

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