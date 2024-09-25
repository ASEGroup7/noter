"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetFooter, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useQuery, useMutation } from "convex/react"
import { api } from "@convex/api";

import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";

interface CommentsProps {
  fileId: string; 
  userId: string; 
  trigger?: React.ReactNode;
}

const formSchema = z.object({
  fileId: z.string(),
  userId: z.string(),
  comment: z.string().max(200, { message : "Maximum of 200 characters allowed."})
})

export default function Comments({ fileId, userId, trigger } : CommentsProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const newComment = useMutation(api.comments.puts.create);

  const paginationOpts = { numItems: 100, cursor: null }; // Customize as needed

  const listOfComments = useQuery(api.comments.get.list, {
    fileId: fileId as string, // Pass the fileId
    paginationOpts: paginationOpts, // Include pagination options
  });
  console.log("list of comments: ", listOfComments?.page)
  async function handleSubmit(values: z.infer<typeof formSchema>) {
    // Here you would send values to your backend
    await newComment({
      fileId: values.fileId,
      userId: values.userId,
      content: values.comment
    });  
    console.log(values); 
  }

  return(
    <Sheet>
      {
        trigger ? <SheetTrigger>
          { trigger }
        </SheetTrigger> : null
      }

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>

        <div className="space-y-2">
        {listOfComments?.page?.map((comment, index) => (
          <div key={index} className="border-b py-2">
            <strong>User ID:</strong> {comment.userId} {/* Display userId */}
            <p>{comment.content}</p> {/* Display the content of the comment */}
          </div>
        ))}
      </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 my-2">
          <input type="hidden" {...form.register("fileId")} value={fileId} />
          <input type="hidden" {...form.register("userId")} value={userId} />
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