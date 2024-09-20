"use client"

import Link from "next/link";
import Image from "next/link";
import { Input } from "@/components/ui/input";
import PageContainer from "@/components/layout/pagecontainer";
import { Button, buttonVariants } from "@/components/ui/button";
import Tiptap from "@/components/common/editor/tiptap";
import ReactTiptapEdior from "@/components/common/editor/react-tiptap-editor"; //This component is for when we want to start doing form validation before submitting.

import { z } from "zod";
import { api } from "@convex/api"
import { useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";

const formSchema = z.object({
  html: z.string(),
})

export default function Page() {
  const router = useRouter();

  return(
    <PageContainer>
      <Tiptap initialValue="test" onChange={() => console.log("Changed")} editable={true}/>
    </PageContainer>
  )
}