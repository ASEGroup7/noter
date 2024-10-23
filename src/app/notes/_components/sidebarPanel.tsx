import { useQuery } from "convex/react";
import { api } from "@convex/api";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import Link from 'next/link'; // Import the Link component from Next.js
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toPascalCase } from "@/lib/utils";
import { User } from "@clerk/clerk-sdk-node";
import axios from "axios";

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
  const [creatorData, setCreatorData] = useState<{ [key: string]: User | null }>({});

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
        .map((note) => note.tags)
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

  // Fetch creator data for each post
  useEffect(() => {
    async function getCreatorData(post: any) {
      try {
        const res = await axios.get("/api/user", { params: { id: post.userId } });
        setCreatorData((prev) => ({
          ...prev,
          [post._id]: res.data.user, // Store user data associated with each post's ID
        }));
      } catch (e) {
        console.log("Error fetching creator data", e);
      }
    }

    notesForTag.forEach((post) => getCreatorData(post));
  }, [notesForTag]);

  return (
    <div className="mb-1">
      <h2 className="text-md font-semibold ml-1 mb-1">Featuring:</h2>
      
      {notesForTag.length > 0 ? (
        <>
          {renderPosts(notesForTag, creatorData, selectedTag)} {/* Render the posts */}
        </>
      ) : (
        <p className="text-gray-500 text-sm font-light ml-6 mb-4">
          Loading notes for this topic...
        </p>
      )}
    </div>
  );
};

// Function to render posts
const renderPosts = (posts: any[], creatorData: { [key: string]: User | null }, selectedTag: string | null) => {
  return posts.map((post, index) => (
    <div key={index} className="">
      <Link href={`/notes/view?id=${post._id}`} className="block p-2">
        <div className="flex items-center text-sm">
          <Avatar className="size-6">
            <AvatarImage src={creatorData[post._id]?.imageUrl} />
            <AvatarFallback>{creatorData[post._id]?.username?.[0]}</AvatarFallback>
          </Avatar>
          <Link href={`/profile/${creatorData[post._id]?.id}`} className="hover:underline pl-1">
            {creatorData[post._id]?.username || creatorData[post._id]?.fullName || "Username"}
          </Link>
          <span className="text-sm text-muted-foreground ml-1">In {selectedTag}</span>
        </div>
        <h3 className="text-md font-bold ml-1 mt-2">{post.title}</h3>
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
  <h2 className="text-md font-semibold mx-1 my-3">Topics:</h2>
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
