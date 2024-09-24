//Custom extension to make the first node in  the editor always a h1.

import Heading from "@tiptap/extension-heading";

const Title = Heading.extend({
  name: "title",
  group: "title",
  parseHTML: () => [{ tag: "h1:first-child" }],
}).configure({ levels: [1] });

export default Title;