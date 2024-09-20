import { useEditor, EditorContent } from "@tiptap/react";
import ExtensionHandler from "./extensions/extension-handler";

export default function Tiptap({
  initialValue,
  onChange,
  editable = false,
  className,
} : {
  initialValue: string,
  onChange: (str: string) => void,
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
        class: "min-h-[500px] border-none"
      }
    }
  })

  return <EditorContent editor={editor} />
}