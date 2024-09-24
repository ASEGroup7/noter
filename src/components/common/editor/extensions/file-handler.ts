import FileHandler from "@tiptap-pro/extension-file-handler";


// TODO : We need to check if the file is local. if it is, upload it and store the url, else, ignore.
export default FileHandler.configure({
  allowedMimeTypes: ["images/png", "image,/jpeg", "image/gif", "image/webp"],
  onDrop: (currentEditor, files, pos) => {
    files.forEach(file => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        currentEditor.chain().insertContentAt(pos, {
          type: "image",
          attrs: {
            src: fileReader.result,
          }
        }).focus().run();
      }
    })
  },
  onPaste: (currentEditor, files, htmlContent) => {
    files.forEach(file => {
      if(htmlContent) return false;

      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        currentEditor.chain().insertContentAt(currentEditor.state.selection.anchor, {
          type: "image",
          attrs: {
            src: fileReader.result,
          }
        }).focus().run();
      }
    })
  }
})