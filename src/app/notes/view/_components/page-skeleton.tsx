import { StarIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartBarIcon, ChatBubbleOvalLeftIcon, LinkIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

export default function PageSkeleton() {
  return(
    <div className="flex-1 w-[min(680px,90%)] m-auto">
      <Skeleton className="h-11 w-full mt-12" />
      <Skeleton className="h-7 w-3/5 my-5" />
      <div className="flex px-1 py-4 border-y justify-between mb-4">
        <div className="flex gap-4 items-center">
          <div className="flex gap-1">
            <StarIcon className="size-4" />
            <Skeleton className="w-5 h-4" />
          </div>
          <div className="flex gap-1">
            <ChartBarIcon className="size-4" />
            <Skeleton className="w-5 h-4" />
          </div>
          <div className="flex gap-1">
            <ChatBubbleOvalLeftIcon className="size-4" />
            <Skeleton className="w-5 h-4" />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <LinkIcon className="size-5" />
          <EllipsisHorizontalIcon className="size-6"/>
        </div>
      </div>
      <div className="flex flex-cols gap-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/5" />
      </div>
    </div>
  )
}