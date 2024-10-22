import { useState } from "react";
import Fuse from 'fuse.js'; // Importing Fuse.js for fuzzy search
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you're using a UI library for checkbox
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const availableTags = ["Technology", "Science", "Education", "Health", "Finance", "Travel", "Lifestyle"]; // Example tag list

export default function CreateNotePage() {
  const [checkedTags, setCheckedTags] = useState<string[]>([]); // State to store checked tags

  // Function to handle the checking/unchecking of tags
  const handleTagChange = (tag: string) => {
    setCheckedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  return (
    <div className="relative flex-1 h-full">
      {/* Toggle Button for Sidebar */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <Sidebar checkedTags={checkedTags} onTagChange={handleTagChange} />
      </ResizablePanelGroup>
    </div>
  );
}

const Sidebar = ({ checkedTags, onTagChange }: { checkedTags: string[]; onTagChange: (tag: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // State to track the search term
  const [filteredTags, setFilteredTags] = useState<string[]>(availableTags); // State to store filtered tags
  
  // Fuse.js setup for fuzzy search
  const fuse = new Fuse(availableTags, {
    keys: ['name'], // We're searching on the tag names
    threshold: 0.3, // Adjust for how fuzzy the matching should be
  });

  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      // If the search term is empty, show all tags
      setFilteredTags(availableTags);
    } else {
      // Use Fuse.js to get fuzzy search results
      const result = fuse.search(term).map((res) => res.item);
      setFilteredTags(result);
    }
  };

  return (
    <ResizablePanel
      defaultSize={30}
      maxSize={30}
      minSize={10}
      className="p-4 h-full transition-transform transform"
    >
      <h1 className="text-2xl font-bold mb-4">Tags</h1>
      
      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search tags..."
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      <div className="space-y-2">
        {filteredTags.length > 0 ? (
          filteredTags.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox
                checked={checkedTags.includes(tag)} // Check if the tag is in the list
                onCheckedChange={() => onTagChange(tag)} // Update the state when the user clicks
                id={tag}
              />
              <label htmlFor={tag} className="cursor-pointer">{tag}</label>
            </div>
          ))
        ) : (
          <p>No tags found.</p>
        )}
      </div>
    </ResizablePanel>
  );
};
