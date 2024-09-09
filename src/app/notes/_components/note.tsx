import Link from "next/link";
import { StarIcon, DocumentTextIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";
import { Id } from "@convex/dataModel";
import { formatDistance } from "date-fns";

export default function Note({
  _id,
  title,
  description,
  downloads,
  stars,
  _creationTime,
  className,
} : {
  _id: Id<"notes">
  title: string,
  description: string,
  downloads: number | string,
  stars: number | string,
  _creationTime: number | string,
  className ?: string,
}) {
  
  const descriptionElements = [
    [
      <DocumentTextIcon key="pdf-icon" className="size-3" />,
      <span key="pdf-text">PDF</span>
    ],
    [
      <span key="creation-time">{formatDistance(new Date(_creationTime), new Date(), { addSuffix: true })}</span>
    ],
    [
      <ArrowDownTrayIcon key="download-icon" className="size-3" />,
      <span key="download-count">{downloads}</span>
    ],
    [
      <StarIcon key="star-icon" className="size-3 fill-yellow-400" />,
      <span key="star-count">{stars}</span>
    ]
  ]

  return(
    <Link href={`/notes/view?id=${_id}`} className={cn(
      className,
      "h-[60px] rounded-lg bg-slate-50 shadow-sm p-2 hover:bg-slate-100"
    )}>
      <div className="text-lg font-bold">{title}</div>
      <div className="flex flex-row gap-1 text-muted-foreground text-sm">
        {
          descriptionElements.map((section, index) => {
            return <>
            {index === 0 ? null : <span>•</span>}
            <div className="flex flex-row gap-1 items-center">
              { ...section }
            </div>
            </>
          })
        }
      </div>
    </Link>
  )
}