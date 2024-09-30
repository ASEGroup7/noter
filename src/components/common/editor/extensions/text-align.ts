import TextAlign from "@tiptap/extension-text-align";

export default TextAlign.configure({
  types: ["heading", "paragraph"],
  alignments: ["left", "center", "right", "justify"],
})