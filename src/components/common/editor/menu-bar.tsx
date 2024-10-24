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
  Strikethrough,
  CircleHelp
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Heading from "./menu-bar-components/heading";
import ColorPicker from "./menu-bar-components/color-picker";
import HighlightPicker from "./menu-bar-components/highlight-picker";
import FontFamilyPicker from "./menu-bar-components/font-family-picker";
import TextAlignPicker from "./menu-bar-components/text-align-picker";
import TableGridSelector from "./menu-bar-components/table-grid-selector";
import { handleDetailClick } from "./menu-bar-components/detail";
import MarkdownShortcutsDialog from "../editor-shortcuts-dialog";

export function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null; // Ensure editor is initialized before rendering the component
  }

  const iconStyle: string = "h-4 w-4";
  const toggleStyle: string = "p-1 w-7 h-7 flex justify-center items-center";
  const buttonStyle: string = toggleStyle + " rounded hover:bg-gray-200 transition-colors";

  // Configuration array for ToggleGroupItems
  const toggleGroupItems = [
    {
      value: "bold",
      ariaLabel: "Toggle bold",
      icon: <Bold className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      value: "italic",
      ariaLabel: "Toggle italic",
      icon: <Italic className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      value: "underline",
      ariaLabel: "Toggle underline",
      icon: <Underline className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      value: "strike",
      ariaLabel: "Toggle strike",
      icon: <Strikethrough className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
  ];

  // Configuration array for button elements
  const buttonItems = [
    {
      ariaLabel: "Bullet List",
      icon: <List className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      ariaLabel: "Ordered List",
      icon: <ListOrdered className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      ariaLabel: "Checklist",
      icon: <ListChecks className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleTaskList().run(),
    },
    {
      ariaLabel: "Add Details",
      icon: <ReceiptText className={iconStyle} />,
      onClick: () => handleDetailClick(editor),
    },
    {
      ariaLabel: "Hard Break",
      icon: <WrapText className={iconStyle} />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
    },
  ];

  return (
    <>
      <ToggleGroup type="multiple" className="flex flex-wrap gap-1 mt-5 mb-2 ">
        <Heading editor={editor} />
        <FontFamilyPicker editor={editor} />

        {/* Render ToggleGroupItems */}
        {toggleGroupItems.map((item) => (
          <ToggleGroupItem
            key={item.value}
            value={item.value}
            aria-label={item.ariaLabel}
            onClick={item.onClick}
            className={`${toggleStyle} ${item.isActive && item.isActive() ? "is-active" : ""}`}
            title={item.ariaLabel}
          >
            {item.icon}
          </ToggleGroupItem>
        ))}

        {/* Color Picker and Highlight Picker */}
        <ColorPicker editor={editor} />
        <HighlightPicker editor={editor} />
        <TableGridSelector editor={editor} />

        {/* Render regular buttons */}
        {buttonItems.map((item, index) => (
          <button
          key={index}
          aria-label={item.ariaLabel}
          onClick={item.onClick}
            className={buttonStyle}
            title={item.ariaLabel}
            >
            {item.icon}
          </button>
        ))}

        {/* Text Alignment and Table Grid Selector */}
        <TextAlignPicker editor={editor} />
        
        <MarkdownShortcutsDialog />
      </ToggleGroup>
    </>
  );
}