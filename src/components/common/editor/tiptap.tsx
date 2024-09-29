"use client";

import { cn } from "@/lib/utils";
import ExtensionHandler from "./extensions/extension-handler";
import { useEditor, EditorContent, HTMLContent } from "@tiptap/react";
import { ToggleGroupDemo } from "./menu-bar";

export default function Tiptap({
  initialValue,
  onChange,
  editable = false,
  className,
}: {
  onChange?: (htmlContent: HTMLContent) => void;
  initialValue?: string;
  editable?: boolean;
  className?: string;
}) {
  // Initialize the editor
  const editor = useEditor({
    extensions: ExtensionHandler,
    content: initialValue,
    editable: editable,
    autofocus: true,
    onUpdate: ({ editor }) => {
      // Log the current content in HTML format
      console.log(editor.getHTML());

      // Trigger the onChange callback if it exists
      onChange && onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          className,
          "min-h-full min-w-full prose prose-sm sm:prose-base"
        ),
      },
    },
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Check if the user is inside a CodeBlock
    if (editor?.isActive('codeBlock')) {
      if (event.key === 'Tab') {
        event.preventDefault() // Prevent default tab behavior
        editor?.commands.insertContent('  ') // Indent with spaces inside code block
      }
      return // Exit early since we handled the Tab key for CodeBlock
    }

    // Handle Tab key for sinking the list item
    if (event.key === 'Tab' && !event.shiftKey && editor?.isActive('listItem')) {
      event.preventDefault()
      editor?.chain().focus().sinkListItem('listItem').run()
    }

    // Handle Shift+Tab for lifting the list item
    if (event.key === 'Tab' && event.shiftKey && editor?.isActive('listItem')) {
      event.preventDefault()
      editor?.chain().focus().liftListItem('listItem').run()
    }
  }

  return (
    <>
      {/* Pass the editor instance to MenuBar */}
      <ToggleGroupDemo editor={editor} />
      <EditorContent editor={editor} onKeyDown={handleKeyDown} />
    </>
  );
}
