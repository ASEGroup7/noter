import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormLabel, FormMessage, FormItem } from "@/components/ui/form";

import { z } from "zod";
import { useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditFormProps {
  onSubmit?: () => boolean;
}

const formSchema = z.object({
  username: z.optional(
    z.string().min(3, { message: "Username must be at least 3 characters." })
  ),
  email: z.optional(z.string().email("Invalid email address")),
  bio: z.optional(z.string()),
});

export default function EditForm(props: EditFormProps) {
  const user = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  // We got issues here...
  function handleSubmit(values: z.infer<typeof formSchema>) {

    user?.user?.update({
      username: values.username,
      primaryEmailAddressId: values.email,
    }).then(res => console.log(res)).catch((e) => console.error(e))
  }
  
  async function handleImageUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    user.user
    ?.setProfileImage({ file })
    .then((res) => console.log(res))
      .catch((e) => console.log(e.errors));
    }
    
    function handleImageDelete() {
      user.user
      ?.setProfileImage({ file: null })
      .then((res) => console.log(res))
      .catch((e) => console.error(e.errors));
    }
    
    if (!user.isLoaded) return <span>Loading...</span>;
    //TODO : Add bio functionality
    return (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormLabel className="font-bold">Photo</FormLabel>
        <div className="flex flex-row items-center gap-4">
          <Avatar className="w-[80px] h-[80px]">
            <AvatarImage src={user.user?.imageUrl} />
            <AvatarFallback />
          </Avatar>
          <div className="grid-rows-2">
            <div className="row-span-1 space-x-4">
              <span
                className="text-green-700 text-sm hover:underline hover:cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                Update
              </span>
              <span
                className="text-red-500 text-sm hover:underline hover:cursor-pointer"
                onClick={handleImageDelete}
              >
                Remove
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpdate}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
            <span className="text-muted-foreground text-sm">
              Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per
              side.
            </span>
          </div>
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Username</FormLabel>
              <FormControl>
                <Input
                  placeholder={user.user?.username || user.user?.fullName || ""}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder={user.user?.primaryEmailAddress?.emailAddress}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Bio</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none h-[100px]"
                  placeholder="A short description about you"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="default">
          Save
        </Button>
      </form>
    </Form>
  );
}