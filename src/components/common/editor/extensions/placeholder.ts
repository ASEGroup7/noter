import Placeholder from '@tiptap/extension-placeholder';

export default Placeholder.configure({
  includeChildren: true,
  emptyNodeClass: 'is-empty',  // Adds class for empty nodes
  showOnlyCurrent: true,
  placeholder: ({ node }) => {
    if (node.type.name === 'heading') {
      return 'Enter your heading...';
    } 
    else if (node.type.name === 'paragraph' && node.content.size === 0) {
      return 'Type your content here...';
    }
    return ' ';
  },
});
