import Link from "next/link";
import Image from "next/image";
import { StarIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";
import { Id } from "@convex/dataModel";
import { useMemo } from "react";

export default function Note({
  _id,
  _creationTime,
  title,
  description,
  downloads,
  stars,
  tags,
  className,
}: {
  _id: Id<"notes">;
  _creationTime: number | string;
  title: string;
  description: string;
  downloads: number | string;
  stars: number | string;
  tags: string[];
  className?: string;
}) {

  const creationDate = useMemo(() => new Date(_creationTime), [_creationTime]);
  const descriptionElements = useMemo(
    () => [
      [
        <span key="creation-time">
          {`${creationDate.getDate()} ${creationDate.toLocaleString("default", { month: "short" })}`}
        </span>,
      ],
      [
        <ArrowDownTrayIcon key="download-icon" className="size-3" />,
        <span key="download-count">{downloads}</span>,
      ],
      [
        <StarIcon key="star-icon" className="size-3 fill-yellow-400" />,
        <span key="star-count">{stars}</span>,
      ],
    ],
    [creationDate, downloads, stars]
  );

  return (
    <Link
      href={`/notes/view?id=${_id}`}
      className={cn(className, "flex py-8 border-b gap-4 text-zinc-600")}
    >
      <div className="flex flex-col w-[80%]">
        <small className="mb-3 hover:underline text-black">{`In ${tags[0]}`}</small>
        <h3 className="text-3xl font-bold mb-1 text-black">{title}</h3>
        <h4 className="mb-4 ">{description}</h4>
        <div className="flex items-center gap-4 text-sm">
          {descriptionElements.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              {item}
            </div>
          ))}
        </div>
      </div>
      <Image
        src="/Logo.png"
        className="ml-auto flex-1"
        alt={`Logo for ${title}`}
        height={100}
        width={80}
      />
    </Link>
  );
}
