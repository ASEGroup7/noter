"use client"

import { cn } from "@/lib/utils";
import ExtensionHandler from "./extensions/extension-handler";
import { useEditor, EditorContent, HTMLContent } from "@tiptap/react";

export default function Tiptap({
  initialValue,
  onChange,
  editable = false,
  className,
}: {
  onChange?: (htmlContent : HTMLContent) => void,
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

  return (
    <>
      <EditorContent editor={editor}/>
    </>
  );
}
