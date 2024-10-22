"use client";

import { cn } from "@/lib/utils";
import ExtensionHandler from "./extensions/extension-handler";
import { useEditor, EditorContent, HTMLContent } from "@tiptap/react";
import { MenuBar } from "./menu-bar";
import TableContextMenu from "./menu-bar-components/table-context-menu"; // Import the TableContextMenu component

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
      // Fix tables after any update
      editor.chain().focus().fixTables().run();
      // Log the current content in HTML format
      console.log(editor.getHTML());

      // Trigger the onChange callback if it exists
      onChange && onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          className,
          "prose prose-sm sm:prose-base w-full max-w-none"
        ),
      },
    },
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Check if the user is inside a CodeBlock
    if (editor?.isActive('codeBlock')) {
      if (event.key === 'Tab') {
        event.preventDefault(); // Prevent default tab behavior
        editor?.commands.insertContent('  '); // Indent with spaces inside code block
      }
      return; // Exit early since we handled the Tab key for CodeBlock
    }

    // Handle Tab key for sinking the list item
    if (event.key === 'Tab' && !event.shiftKey && editor?.isActive('listItem')) {
      event.preventDefault();
      editor?.chain().focus().sinkListItem('listItem').run();
    }

    // Handle Shift+Tab for lifting the list item
    if (event.key === 'Tab' && event.shiftKey && editor?.isActive('listItem')) {
      event.preventDefault();
      editor?.chain().focus().liftListItem('listItem').run();
    }
  };

  return (
    <>
      <div className="mx-3">
        {/* Pass the editor instance to MenuBar */}
        { editable ? <MenuBar editor={editor} /> : null }
        <EditorContent editor={editor} onKeyDown={handleKeyDown} />
      </div>
      {/* Render the TableContextMenu component and pass the editor instance */}
      {editor && <TableContextMenu editor={editor} />}
    </>
  );
}
