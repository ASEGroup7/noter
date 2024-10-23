import { useQuery } from "convex/react";
import { api } from "@convex/api";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import Link from 'next/link'; // Import the Link component from Next.js
import { Badge } from "@/components/ui/badge";

const Sidebar = () => {
  const router = useRouter(); 

  // Fetch the first 20 posts for Section 1
  const randomTagNotesQuery = useQuery(
    api.notes.get.list,
    { paginationOpts: { numItems: 20, cursor: null } }
  );
  
  // Fetch all tags for Section 2
  const allTagsQuery = useQuery(api.tags.get.list, {}); 

  const randomTagNotes = randomTagNotesQuery?.page ?? [];
  const allTags = allTagsQuery ?? [];

  return (
    <div className="sticky top-20">
      {/* Section 1: Topic of the Day */}
      <TopicOfTheDay randomTagNotes={randomTagNotes} />
      <div className="border-b border-gray-800"> </div>
      {/* Section 2: Recommended Topics */}
      {renderRecommendedTopics(allTags, router)}
    </div>

  )
};

// Function to render Section 1: Topic of the Day
const TopicOfTheDay = ({ randomTagNotes }: { randomTagNotes: any[] }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Fetch notes for the selected tag
  const notesForTagQuery = useQuery(
    api.notes.get.list,
    selectedTag
      ? { fulltext: selectedTag, paginationOpts: { numItems: 3, cursor: null } }
      : "skip" // Only run the query if a tag is selected
  );

  const notesForTag = notesForTagQuery?.page ?? [];

  // Effect to select a random tag from the retrieved posts
  useEffect(() => {
    if (randomTagNotes.length > 0) {
      // Collect all unique tags from the notes
      const allTags = randomTagNotes
        .map(note => note.tags)
        .flat() // Flatten the array of arrays
        .filter((tag, index, self) => self.indexOf(tag) === index); // Remove duplicates

      if (allTags.length > 0) {
        // Randomly select a tag from the list of tags
        const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
        setSelectedTag(randomTag);
        console.log(`Selected tag: ${randomTag}`);
      }
    }
  }, [randomTagNotes]);

  return (
    <div>
      <div className="flex items-center mt-8 mb-1">
        <h2 className="text-sm font-semibold ml-1">Featuring:</h2>
        <h3 className="text-md font-bold underline ml-1">{selectedTag}</h3>
      </div>
      
      {notesForTag.length > 0 ? (
        <>
          {renderPosts(notesForTag)} {/* Render the posts */}
        </>
      ) : (
        <p className="text-gray-500 text-sm font-light ml-6 mb-4">Loading notes for this topic...</p>
      )}
    </div>
  );
};

// Function to render posts
const renderPosts = (posts: any[]) => {
  return posts.map((post, index) => (
    <div key={index} className="pb-1">
      <Link href={`/notes/view?id=${post._id}`} className="block hover:bg-gray-100 p-2 rounded">
        <h3 className="text-lg font-bold mx-4">{post.title}</h3>
        <p className="text-gray-500 text-sm font-light mx-4">{post.description}</p>
      </Link>
    </div>
  ));
};

const renderRecommendedTopics = (allTags: any[] = [], router: any) => {
  
  const handleTagClick = (tag: string) => {
    router.push(`/tags/${encodeURIComponent(tag)}`);
  };

  // Shuffle the allTags array
  const shuffledTags = [...allTags].sort(() => 0.5 - Math.random());

  return (
    <div>
  <h2 className="text-sm font-semibold mx-1 my-3">Topics:</h2>
  <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto hide-scrollbar"> {/* Custom class to hide scrollbar */}
    {allTags.length !== 0 ? (
      shuffledTags.map((tag) => (
        <div
          key={tag._id}
          className="cursor-pointer mx-2"
          onClick={() => handleTagClick(tag.tag)}
        >
          <Badge className="bg-destructive text-primary bg-gray-200" key={tag}>
                  {tag.tag}
          </Badge>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-sm font-light ml-6">Loading topics...</p>
    )}
  </div>
</div>
  );
};


export default Sidebar;
