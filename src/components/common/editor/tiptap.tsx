"use client"

import { cn } from "@/lib/utils";
import ExtensionHandler from "./extensions/extension-handler";
import { useEditor, EditorContent, HTMLContent } from "@tiptap/react";

export default function Tiptap({
  initialValue,
  onContentChange,
  onTitleChange,
  editable = false,
  className,
}: {
  onTitleChange?: (htmlContent: HTMLContent) => void,
  onContentChange?: (htmlContent : HTMLContent) => void,
  initialValue?: string,
  editable?: boolean,
  className?: string,
}) {
  
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    autofocus: true,
    extensions: ExtensionHandler,
    content: initialValue,
    editable: editable,
    onUpdate: ({ editor }) => {
      onTitleChange && onTitleChange(editor?.view.state.doc.firstChild?.textContent.trim() || "");
      onContentChange && onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          className,
          "min-h-[500px] prose prose-sm sm:prose-base m-5 pb-5"
          // "min-h-[500px] border-none prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none"
        ),
      },
    },
  });

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
}
