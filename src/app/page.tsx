"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  if (isSignedIn) router.push("/notes");

  return (
    // 122px because navbar and footer are 60px tall each and with a border of 1.
    <div className="flex-1 relative mx-[5%] flex flex-col items-left justify-center">
      <h1 className="text-7xl font-bold">Open sourced</h1>
      <h1 className="text-7xl font-bold">Colaborative</h1>
      <h1 className="text-7xl font-bold">Notes</h1>
      <Link href="/notes" className={cn(
        buttonVariants({variant: "outline"}),
        "mt-8 w-fit px-8"
      )}>
        Start reading
      </Link>
    </div>
  );
}
