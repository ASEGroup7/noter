"use client"

import Link from "next/link";
import Image from "next/link";
import { Input } from "@/components/ui/input";
import PageContainer from "@/components/layout/pagecontainer";
import { Button, buttonVariants } from "@/components/ui/button";

import { api } from "@convex/api"
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";

export default function Page() {

  const auth = useAuth();
  const router = useRouter();
  const id = useSearchParams().get("id");

  if(id === null || auth.isSignedIn === false) router.push("/notes");

  const note = useQuery(api.notes.get.id, { id : id as string })

  return(
    <PageContainer>
      
    </PageContainer>
  )
}