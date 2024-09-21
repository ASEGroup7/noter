import { Editor } from "@tiptap/core";
import Emoji, { emojis } from "@tiptap-pro/extension-emoji";

export default Emoji.configure({
  enableEmoticons: true,
  emojis: emojis,
  suggestion: {
    allowSpaces: false,
    items: ({ editor, query } : { editor: Editor, query: string }) =>
      editor.storage.emoji.emojis
        .filter(
          ({ shortcodes, tags } : { shortcodes: string[], tags: string[] }) =>
            shortcodes.find(shortcode => shortcode.startsWith(query.toLowerCase()) || tags.find(tag => tag.startsWith(query.toLowerCase())))
        ),
  }
})

