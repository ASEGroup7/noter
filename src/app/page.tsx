"use client"

import { Button } from "@/components/ui/button";

import { useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
export default function Home() {  
  const { isSignedIn } = useUser();
  const router = useRouter();
  const book = useRef();

  if(isSignedIn) router.push("/notes");

  return (
    // 122px because navbar and footer are 60px tall each and with a border of 1.
    <div className="min-h-[calc(100vh-122px)] relative mx-[5%] flex flex-col items-left justify-center">
      <h1 className="text-7xl font-bold">Open sourced</h1>
      <h1 className="text-7xl font-bold">Colaborative</h1>
      <h1 className="text-7xl font-bold">Notes</h1>
      <Button className="mt-8 w-fit">Start reading</Button>
    </div>
  );
}
