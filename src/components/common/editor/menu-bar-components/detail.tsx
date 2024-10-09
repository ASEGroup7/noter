import { Editor } from "@tiptap/react";


export const handleDetailClick = (editor: Editor) => {
    editor.chain().focus().command(({ tr, state }) => {
      const { selection } = state;
      const { from } = selection;
  
      // Get the node at the current cursor position
      const nodeAtCursor = tr.doc.nodeAt(from);
  
      // Check if it's a details node, and if it is, toggle the 'open' attribute
      if (nodeAtCursor && nodeAtCursor.type.name === 'details') {
        const isOpen = nodeAtCursor.attrs.open;
        tr.setNodeMarkup(from, state.schema.nodes.details, {
          ...nodeAtCursor.attrs,
          open: !isOpen,  // Toggle the 'open' attribute
        });
      } else {
        // If it's not a details node, insert a new details node with 'open: true'
        // Insert new details node if not already a details node
        tr.insert(from, state.schema.nodes.details.create({ open: true }, [
          state.schema.nodes.detailsSummary.create(null, state.schema.text('Summary')),
          state.schema.nodes.detailsContent.create(null, state.schema.nodes.paragraph.create()),
        ]));
      }
  
      return true;
    }).run();
  };