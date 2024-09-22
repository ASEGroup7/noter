"use client"

import Link from "next/link";
import Image from "next/link";
import { Input } from "@/components/ui/input";
import Tiptap from "@/components/common/editor/tiptap";
import PageContainer from "@/components/layout/page-container";
import { Button, buttonVariants } from "@/components/ui/button";

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

  return(
    <PageContainer>
      <Tiptap initialValue="test" onChange={() => console.log("Changed")} editable={true}/>
    </PageContainer>
  )
}