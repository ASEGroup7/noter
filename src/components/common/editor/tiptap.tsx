import { cn } from "@/lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import ExtensionHandler from "./extensions/extension-handler";

export default function Tiptap({
  initialValue,
  onChange,
  editable = false,
  className,
}: {
  onChange: (str: string) => void;
  initialValue?: string;
  editable?: boolean;
  className?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    autofocus: true,
    extensions: ExtensionHandler,
    content: initialValue,
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          className,
          "min-h-[500px] prose prose-sm sm:prose-base m-5"
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
