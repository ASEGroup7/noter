import { ChevronUpDownIcon } from "@heroicons/react/24/solid";

import { cn } from "@/lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import ExtensionHandler from "./extensions/extension-handler";

export default function Tiptap({
  initialValue,
  onChange,
  editable = false,
  className,
} : {
  onChange: (str: string) => void,
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
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          className,
          "min-h-[500px] border-none"
        )
      }
    }
  })

  return <>
    <EditorContent editor={editor} />
  </>
}