"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetFooter, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";

interface CommentsProps {
  id?: string | null;
  trigger?: React.ReactNode;
}

const formSchema = z.object({
  comment: z.string().max(200, { message : "Maximum of 200 characters allowed."})
})

export default function Comments(props : CommentsProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return(
    <Sheet>
      {
        props.trigger ? <SheetTrigger>
          { props.trigger }
        </SheetTrigger> : null
      }

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>
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
  )
}