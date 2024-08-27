"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
})

export default function Page({ params } : { params : { id: string } }) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="min-h-[calc(100vh-70px)] px-[5%] grid grid-cols-12 gap-8">
      <DetailsForm form={form} onSubmit={onSubmit} className="col-span-12 lg:col-span-7" params={params}/>
      
      {/* <div className="col-span-5 items-center hidden lg:flex">
      <iframe 
        src={`https://docs.google.com/gview?url=https://utfs.io/f/${params.id}&embedded=true`} 
        className="w-full h-[calc(100vh-130px)]"
      />
      </div> */}
    </div>
  )
}

function DetailsForm({ form, onSubmit, className } : { 
  form: UseFormReturn<{
    title: string;
    description: string;
    tags: string[];
}, any, undefined>,
  onSubmit: (values: z.infer<typeof formSchema>) => void,
  className: string,
 }) {
  const router = useRouter();

  return(
    <div className={`${className} flex flex-col justify-center`}>
      <div className="flex items-center justify-between mb-4 ">
        <h1 className="text-3xl font-bold inline-block">Let's add some details !</h1>
        <Button className="hidden lg:flex" variant="secondary" onClick={() => {
          router.push(`https://utfs.io/f/${params.id}`)
        }}> 
          <span className="mr-2">View PDF</span>
          <DocumentTextIcon className="size-5" />
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input required placeholder="Title" {...field} />
                </FormControl>
              </FormItem>
            )} />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea required placeholder="Description" {...field} className="h-[200px] resize-none" />
              </FormControl>
            </FormItem>
          )} />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

{/* <iframe 
src={`https://docs.google.com/gview?url=https://utfs.io/f/${params.id}&embedded=true`} 
className="w-[600px] h-[calc(100vh-125px)]"
/> */}