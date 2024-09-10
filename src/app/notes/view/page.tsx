"use client"

import Link from "next/link";

import { useEffect } from "react";
import { api } from "@convex/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const id = searchParams.get("id");
  if(id === null) router.push("/notes");

  const note = useQuery(api.notes.get.id, { id });
  
  useEffect(() => console.log(id), [id])
  

  return <></>
}