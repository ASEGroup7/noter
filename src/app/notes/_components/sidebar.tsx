import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import axios from "axios";
import { cn } from "@/lib/utils";
import { api } from "@convex/api";
import { Doc } from "@convex/dataModel";
import { useEffect, useState } from "react";
import { truncateString } from "@/lib/utils";
import { User } from "@clerk/clerk-sdk-node";
import { useQuery, usePaginatedQuery } from "convex/react";

export default function Sidebar(props: { className?: string }) {
  const tags = useQuery(api.tags.get.list, {});
  const { results: notes } = usePaginatedQuery(api.notes.get.list, { fulltext: "Web" }, { initialNumItems: 3 })

  return <div className={cn(
    props.className,
    "sticky overflow-x-hidden overflow-y-scroll border-l p-5",
  )}>
    
    <h2 className="text-md font-bold pb-2">Featuring: </h2>
    <div className="flex flex-col gap-4">
      {notes.map((note) => <MiniNote key={note._id} note={note} />)}
    </div>

    <h2 className="text-md font-bold mb-2 mt-5">Topics: </h2>
    <div className="flex flex-wrap gap-2">
      {tags?.slice(0, 20).map((tag) => (
        <Link href={`/tags/${tag.tag}`} key={tag._id} >
          <Badge 
            className="bg-destructive text-primary bg-gray-200">
            {tag.tag}
          </Badge>
        </Link>
      ))}
    </div>
  </div>
}


function MiniNote(props : { note: Doc<"notes">}) {

  const [creatorData, setCreatorData] = useState<User | null>(null);

  useEffect(() => console.log(props.note.tags), [props])

  useEffect(() => {
    async function getCreatorData() {
      axios
      .get("/api/user", { params: { id: props.note.userId }})
      .then((res) => setCreatorData(res.data.user))
      .catch((e) => console.log("Error fetching creator data", e))
    }

    getCreatorData();
  }, [props])

  return (
    <Link href={`/notes/view?id=${props.note._id}`}>
      <div className="flex">
        <Avatar className="size-6 mr-2">
          <AvatarImage src={creatorData?.imageUrl} />
          <AvatarFallback>{creatorData?.username?.[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">In {truncateString(props.note.tags[0], 18)}</span>
      </div>
      <p className="text-sm font-bold ml-1 mt-2">{props.note.title}</p>
    </Link>
  )
}