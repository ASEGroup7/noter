"use client"

import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import axios from "axios";
import { z } from "zod";
import { api } from "@convex/api";
import { Doc } from "@convex/dataModel";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { User } from "@clerk/nextjs/server";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";

interface CommentsProps {
  fileId : string;
  open ?: boolean;
  onOpenChange?: (state: boolean) => void;
}

const formSchema = z.object({
  comment: z.string().max(200, { message: "Maximum of 200 characters allowed. "})
})

export default function Comments({ fileId, open, onOpenChange} : CommentsProps) {
  const user = useUser();
  const commentsRef = useRef<HTMLDivElement | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({ 
    resolver: zodResolver(formSchema), 
    mode: "onChange", 
    defaultValues: {
      comment: "",
    }
  });

  const newComment = useMutation(api.comments.put.create)
  const allComments = useQuery(api.comments.get.list, { fileId: fileId })

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if(event.key !== "Enter") return;
    form.handleSubmit(handleSubmit)();
    event.preventDefault();
  }

  function handleSubmit(values: z.infer<typeof formSchema>) {
    if(!user.isLoaded || !user.isSignedIn) return;
    
    newComment({
      fileId: fileId,
      userId: user.user.id,
      content: values.comment,
    }).then(() => form.reset())
  } 

	useEffect(() => {
		if (commentsRef.current) {
			commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
		}
	}, [allComments])

  return(<Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent className="flex flex-col gap-1 p-4">
      <SheetHeader>
        <SheetTitle className="text-left">Comments</SheetTitle>
      </SheetHeader>

      <div className="flex-grow overflow-auto no-scrollbar space-y-3" ref={commentsRef}>
        {allComments?.map((comment) => <CommentBubble key={comment._id} comment={comment} />)}
      </div>

      <Form {...form}>
        <form className="my-2 border rounded-md">
          <FormField
            control={form.control}
            name="comment"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-2 pr-2 items-center">
                    <Textarea
                      placeholder="What are your thoughts?"
                      className="max-h-[100px] resize-none border-none outline-none shadow-none no-scrollbar"
                      onKeyDown={handleKeyDown}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </SheetContent>
  </Sheet>)
}



function CommentBubble({ comment } : { comment : Doc<"comments">}) {

  const [user, setUser] = useState<User>();
  
  useEffect(() => {
    async function GetUserInformation() {
      const { data } = await axios.get("/api/user", {
        params: { id: comment.userId }
      })

      setUser(data.user)
    }
    GetUserInformation();
  }, [comment])
  
  return(<div className="flex items-start space-x-3 py-2 px-3">
    <Avatar className="size-10 mt-1">
      <AvatarImage src={user?.imageUrl} />
      <AvatarFallback>{user?.username?.slice(0,2).toUpperCase()}</AvatarFallback>
    </Avatar>
    <div className="flex-grow min-w-0">
      <div className="flex items-center space-x-2">
        <h3 className="text-sm font-medium text-foreground truncate">{user?.username || user?.firstName || user?.lastName}</h3>
        <span className="text-xs text-muted-foreground">•</span>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDistanceToNow(new Date(comment._creationTime), { addSuffix: true })}</span>
      </div>
      <p className="mt-0.5 text-sm text-foreground break-words">{comment.content}</p>
    </div>
  </div>)
}