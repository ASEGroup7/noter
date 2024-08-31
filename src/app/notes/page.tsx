// import TagSearch from "./_components/tagsearch";
import Notes from "./_components/notes"
import FullTextSearchBar from "./_components/fulltextsearchbar"

export default function Page() {
  return(<div className="mt-4">
    {/* <TagSearch /> */}
    <FullTextSearchBar />
    <Notes className="mt-4"/>
  </div>)
}