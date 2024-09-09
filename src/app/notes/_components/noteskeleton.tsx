import { Skeleton } from "@/components/ui/skeleton";

export default function NoteSkeleton() {
  return(
    <div className="flex py-8 border-b gap-4">
      <div className="flex flex-col w-[80%]">
        <Skeleton className="mb-3 h-5 w-[20%]"/>
        <Skeleton className="mb-1 h-5 w-full"/>
        <Skeleton className="mb-3 h-5 w-[80%]"/>
        <Skeleton className="mb-4 h-5 w-[40%]"/>
      </div>
      <Skeleton className="flex-1" />
    </div>
  )
}