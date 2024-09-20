import { useEditor, EditorContent } from "@tiptap/react";
import ExtensionHandler from "./extensions/extension-handler";

export default function Tiptap({
  initialValue,
  onChange,
  editable,
  className,
} : {
  initialValue: string,
  onChange: (str: string) => void,
  editable: boolean,
  className?: string,
}) {
  const editor = useEditor({
    extensions: ExtensionHandler,
    content: initialValue,
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  })

  return <EditorContent editor={editor} className={className} />
}