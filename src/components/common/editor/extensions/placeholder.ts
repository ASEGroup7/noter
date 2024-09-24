import Placeholder from "@tiptap/extension-placeholder";

export default  Placeholder.configure({
  showOnlyCurrent:false,
  placeholder: ({ node }) => {
    if(node.type.name === "title") return "Title ..."
    return "Your notes ..."
  }
})