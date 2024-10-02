import React from "react";
import { Editor } from "@tiptap/react";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Heading from "./menu-bar-components/heading"; 
import ColorPicker from "./menu-bar-components/color-picker";
import HighlightPicker from "./menu-bar-components/highlight-picker";
import FontFamilyPicker from "./menu-bar-components/font-family-picker";
import TextAlignPicker from "./menu-bar-components/text-align-picker";
import TableGridSelector from "./menu-bar-components/table-grid-selector";

export function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null; // Ensure editor is initialized before rendering the component
  }

  return (
    <>
      <ToggleGroup type="multiple" className="flex flex-wrap space-x-4">
        {/* Heading and Font Family */}
        <div className="mr-4">
          <Heading editor={editor} />
        </div>

        <div className="mr-4">
          <FontFamilyPicker editor={editor} />
        </div>

        {/* Bold, Italic, Underline, and Strikethrough */}
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

        {/* Color Picker and Highlight Picker */}
        <ColorPicker editor={editor} />
        <HighlightPicker editor={editor} />

        {/* Bullet List, Ordered List, Checklist */}
        <ToggleGroupItem
          value="bullet-list"
          aria-label="Toggle bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bullet-list") ? "is-active" : ""}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="ordered-list"
          aria-label="Toggle ordered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("ordered-list") ? "is-active" : ""}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="check-list"
          aria-label="Toggle check list"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={editor.isActive("check-list") ? "is-active" : ""}
          title="CheckList"
        >
          <ListChecks className="h-4 w-4" />
        </ToggleGroupItem>

        {/* Additional Block Elements */}
        <button 
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          onClick={() => handleDetailClick(editor)}
          title="Add Details"
        >
          <ReceiptText className="h-4 w-4" />
        </button>
        <button 
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Hard Break"
        >
          <WrapText className="h-4 w-4" />
        </button>

        {/* Text Alignment and Table Grid Selector */}
        <TextAlignPicker editor={editor} />
        <TableGridSelector editor={editor} />
        
      </ToggleGroup>
    </>
  );
}

// Handler function for Add Details
const handleDetailClick = (editor: Editor) => {
  editor.chain().focus().command(({ tr, state }) => {
    const { selection } = state;
    const { from } = selection;

    const nodeAtCursor = tr.doc.nodeAt(from);

    // Check if it's a details node, and if it is, toggle the 'open' attribute
    if (nodeAtCursor && nodeAtCursor.type.name === 'details') {
      const isOpen = nodeAtCursor.attrs.open;
      tr.setNodeMarkup(from, state.schema.nodes.details, {
        ...nodeAtCursor.attrs,
        open: !isOpen,  // Toggle the 'open' attribute
      });
    } else {
      // Insert new details node if not already a details node
      tr.insert(from, state.schema.nodes.details.create({ open: true }, [
        state.schema.nodes.detailsSummary.create(null, state.schema.text('Summary')),
        state.schema.nodes.detailsContent.create(null, state.schema.nodes.paragraph.create()),
      ]));
    }

    return true;
  }).run();
};
