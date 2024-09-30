import CodeBlockLowLight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

export default CodeBlockLowLight.configure({
  lowlight,
  defaultLanguage: 'javascript',
})