"use client"

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { mockTags } from "@/data/mockTags";
import { useState, useEffect, Children } from "react"

export default function Page() {
   const [ tagsFilter, setTagsFilter ] = useState("");
   const [ selectedTagsFilter, setSelectedTagsFilter ] = useState<string[]>([])

   useEffect(() => {
      console.log(tagsFilter)
   }, [tagsFilter])

   useEffect(() => {
      console.log(selectedTagsFilter);
   }, [selectedTagsFilter])

   return(
      <div className="min-h-[calc(100vh-61px)] px-[5%] grid grid-cols-12">

         {/* Tags Section */}
         <section className="col-span-4 border-r border-gray-100 pt-6 px-4">
            <div className="flex gap-2">
               <Input className="bg-white" placeholder="Filter tags" value={tagsFilter} onChange={(e) => setTagsFilter(e.target.value)} />
               <Button variant="destructive" onClick={() => setSelectedTagsFilter([])}>
                  {/* <ArrowPathIcon className="size-4" /> */}
                  Reset
               </Button>  
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
               {
                  mockTags.map(item => {
                     if(!item.toLowerCase().includes(tagsFilter.toLowerCase())) return null;
                     return <BadgeButton key={item} title={item} isToggled={selectedTagsFilter.includes(item)} onClick={() => {
                        if (selectedTagsFilter.includes(item)) {
                           setSelectedTagsFilter(selectedTagsFilter.filter(tag => tag !== item));
                        } else {
                           setSelectedTagsFilter([...selectedTagsFilter, item]);
                        }
                     }} />
                  })
               }
            </div>
         </section>

         {/* Notes Section */}
         <section className="col-span-8 pt-6 px-4">
            <div className="flex items-center text-lg gap-2">
               <h1>Notes</h1>
               <h2 className="text-slate-400">197</h2>
               <Input placeholder="Filter by name" />
            </div>
         </section>
      </div>
   )
}

function BadgeButton({ title, isToggled, onClick } : { 
   title: string;
   isToggled : boolean;
   onClick: () => void;
}) {
   return(
      <Badge onClick={onClick} variant="outline" className={`hover:cursor-pointer hover:bg-slate-100 transition ${isToggled ? "bg-slate-100" : "bg-white"}`}>{ title }</Badge>
   )
}