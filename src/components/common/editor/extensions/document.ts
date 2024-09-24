import Document from "@tiptap/extension-document";

const DocumentWithTitle = Document.extend({
  content: "title block+",
})

export default DocumentWithTitle;