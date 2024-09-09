import TagSearch from "./_components/tagsearch";
import Notes from "./_components/notes"
import FullTextSearchBar from "./_components/fulltextsearchbar"

export default function Page() {
  return(<div className="flex-1 mt-4 grid grid-cols-[1fr_2fr] px-[5%] gap-4">
    <TagSearch/>
    
    <div className="pl-4 border-l">
      <FullTextSearchBar />
      <Notes className="mt-4"/>
    </div>
  </div>)
}