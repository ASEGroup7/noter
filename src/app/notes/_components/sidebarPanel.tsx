import { useQuery } from "convex/react";
import { api } from "@convex/api";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import Link from 'next/link'; // Import the Link component from Next.js

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
      <h2 className="text-sm font-medium mx-3 my-2 ">Topic of the Day:</h2>
      {notesForTag.length > 0 ? (
        <>
          <h3 className="text-base font-semibold ml-6 border-b border-gray-500 text-center">{selectedTag}</h3>
          {renderPosts(notesForTag)} {/* Render the posts */}
        </>
      ) : (
        <p className="text-gray-500 text-sm font-light ml-6">Loading notes for this topic...</p>
      )}
    </div>
  );
};

// Function to render posts
const renderPosts = (posts: any[]) => {
  return posts.map((post, index) => (
    <div key={index} className="border-b pb-1">
      <Link href={`/notes/view?id=${post._id}`} className="block hover:bg-gray-100 p-2 rounded">
        <h3 className="text-sm font-medium mx-4">{post.title}</h3>
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
  <h2 className="text-sm font-medium mx-3 my-2">Topics:</h2>
  <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto hide-scrollbar"> {/* Custom class to hide scrollbar */}
    {allTags.length !== 0 ? (
      shuffledTags.map((tag) => (
        <div
          key={tag._id}
          className="bg-gray-300 text-xs font-semibold ml-4 px-2 py-1 rounded-full cursor-pointer"
          onClick={() => handleTagClick(tag.tag)}
        >
          {tag.tag}
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
