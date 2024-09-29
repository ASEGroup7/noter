import Placeholder from '@tiptap/extension-placeholder';

export default Placeholder.configure({
  includeChildren: true,
  emptyNodeClass: 'is-empty',  // Adds class for empty nodes
  showOnlyCurrent: false,
  placeholder: ({ node }) => {
    if (node.type.name === 'heading') {
      return 'Enter your heading...';
    }
    else if (node.type.name === 'paragraph') return 'Type your content here...';
    return ' '
  },
});

