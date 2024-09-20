import { useController } from "react-hook-form";
import Tiptap from "./tiptap";

export default function ReactTiptapEdior({
  name,
  required = false,
  editable = false,
  className,
} : {
  name: string,
  required: boolean,
  editable: boolean,
  className?: string,
}) {
  const { field: { onChange, value } } = useController({
    name,
    rules: {
      required
    }
  });

  return(
    <Tiptap
      initialValue={value}
      onChange={onChange}
      editable={editable}
      className={className}
    />
  )
}