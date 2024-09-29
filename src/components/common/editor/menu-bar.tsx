import React from "react";
import { Editor } from "@tiptap/react"; // Importing Editor type
import {
  Bold,
  Italic,
  Underline,
  ReceiptText,
  WrapText,
  List,
  ListOrdered,
  ListChecks,
  Strikethrough 
} from "lucide-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import Heading from "./menu-bar-components/heading"; 
 
export function ToggleGroupDemo({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null; // Ensure editor is initialized before rendering the component
  }

  return (
    <>
      <ToggleGroup type="multiple">
        {/* Include Heading Dropdown as the first item */}
        <div className="mr-4">
          <Heading editor={editor} />
        </div>
        
        <ToggleGroupItem
          value="bold"
          aria-label="Toggle bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          aria-label="Toggle italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          aria-label="Toggle underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "is-active" : ""}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="strike"
          aria-label="Toggle strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
          title="Strike"
        >
          <Strikethrough className="h-4 w-4" />
        </ToggleGroupItem>
        <button 
          className="p-2 rounded hover:bg-gray-200 hover transition-colors"
          onClick={() => handleDetailClick(editor)}
          title="Add Details"
        >
          <ReceiptText className="h-4 w-4" />
        </button>
        <button 
          className="p-2 rounded hover:bg-gray-200 hover transition-colors"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Hard Break"
        >
          <WrapText className="h-4 w-4" />
        </button>
        <button 
          className="p-2 rounded hover:bg-gray-200 hover transition-colors"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button 
          className="p-2 rounded hover:bg-gray-200 hover transition-colors"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button 
          className="p-2 rounded hover:bg-gray-200 hover transition-colors"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          title="CheckList"
        >
          <ListChecks className="h-4 w-4" />
        </button>
      </ToggleGroup>
    </>
  );
}

// The handler function is moved outside of the component
const handleDetailClick = (editor: Editor) => {
  editor.chain().focus().command(({ tr, state }) => {
    const { selection } = state;
    const { from } = selection;

    // Get the node at the current cursor position
    const nodeAtCursor = tr.doc.nodeAt(from);

    // Check if it's a details node, and if it is, toggle the 'open' attribute
    if (nodeAtCursor && nodeAtCursor.type.name === 'details') {
      const isOpen = nodeAtCursor.attrs.open;
      tr.setNodeMarkup(from, state.schema.nodes.details, {
        ...nodeAtCursor.attrs,
        open: !isOpen,  // Toggle the 'open' attribute
      });
    } else {
      // If it's not a details node, insert a new details node with 'open: true'
      tr.insert(from, state.schema.nodes.details.create({ open: true }, [
        state.schema.nodes.detailsSummary.create(null, state.schema.text('Summary')),
        state.schema.nodes.detailsContent.create(null, state.schema.nodes.paragraph.create()),
      ]));
    }

    return true;
  }).run();
};
