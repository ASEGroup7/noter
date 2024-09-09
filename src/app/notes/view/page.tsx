"use client"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TagSelector } from "@/components/common/tagselector";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { api } from "@convex/api";
import { useState, useEffect } from "react";
import { truncateString } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  // We need to redirect them before creating the query object or else convex will throw an error.
  //There is most probably a better way to do this.
  if(id === "") {
    router.push("/notes");
    router.refresh();
  }

  const note = useQuery(api.notes.get.id, { id : id as string })

  return(
    <div className="min-h-[calc(100vh-62px)] px-[5%] py-3 flex flex-col">
      <div>
        {/* <h1 className="text-3xl font-bold mb-4 text-left">Placeholder Document Title</h1> */}

      </div>
      <div className="grid grid-cols-[1fr_100px] gap-4 flex-1">
        <div className="size-full border rounded-md"></div>
      </div>
    </div>
  )
}