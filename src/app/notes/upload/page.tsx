"use client";

import Tiptap from "@/components/common/editor/tiptap";
import PageContainer from "@/components/layout/page-container";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { z } from "zod";
import { api } from "@convex/api";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  noteContent: z.string(),
})

export default function Page() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <PageContainer className="flex-1 flex w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="noteContent"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Tiptap onChange={field.onChange} editable />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </PageContainer>
  );
}
