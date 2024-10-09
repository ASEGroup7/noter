import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Plus, Trash2, Merge, Split } from 'lucide-react';

interface TableContextMenuProps {
  editor: Editor | null;
}

export default function TableContextMenu({ editor }: TableContextMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px', // Smaller font size
    color: '#555', // Lighter font color
    padding: '4px 8px',
    width: '100%',
    justifyContent: 'flex-start',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
  };

  const buttonHoverStyle = {
    backgroundColor: '#f0f0f0', // Light gray background on hover
    color: '#333', // Slightly darker font color on hover
  };

  // Close the context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMenuVisible(false);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Attach the context menu event handler to the editor’s content area
  useEffect(() => {
    const editorDom = editor?.view?.dom;
    
  // Handle the right-click event on the table cell
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();

      // Check if the editor is active and if the user clicked on a table cell
      const target = event.target as HTMLElement;
      const isTableCell = target && (target.closest('td') || target.closest('th'));

      if (editor && isTableCell) {
        setPosition({ x: event.clientX, y: event.clientY });
        setMenuVisible(true);
      } else {
        setMenuVisible(false);
      }
    };

    if (editorDom) {
      editorDom.addEventListener('contextmenu', handleContextMenu);
    }
    return () => {
      if (editorDom) {
        editorDom.removeEventListener('contextmenu', handleContextMenu);
      }
    };
  }, [editor]);

  if (!menuVisible) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
      }}
    >
      {[
        { label: 'Insert row above', action: () => editor?.chain().focus().addRowBefore().run(), icon: <Plus className="h-4 w-4" /> },
        { label: 'Insert row below', action: () => editor?.chain().focus().addRowAfter().run(), icon: <Plus className="h-4 w-4" /> },
        { label: 'Insert column left', action: () => editor?.chain().focus().addColumnBefore().run(), icon: <Plus className="h-4 w-4" /> },
        { label: 'Insert column right', action: () => editor?.chain().focus().addColumnAfter().run(), icon: <Plus className="h-4 w-4" /> },
        { label: 'Delete row', action: () => editor?.chain().focus().deleteRow().run(), icon: <Trash2 className="h-4 w-4" /> },
        { label: 'Delete column', action: () => editor?.chain().focus().deleteColumn().run(), icon: <Trash2 className="h-4 w-4" /> },
        { label: 'Delete table', action: () => editor?.chain().focus().deleteTable().run(), icon: <Trash2 className="h-4 w-4" /> },
        { label: 'Merge cells', action: () => editor?.chain().focus().mergeCells().run(), icon: <Merge className="h-4 w-4" /> },
        { label: 'Split cell', action: () => editor?.chain().focus().splitCell().run(), icon: <Split className="h-4 w-4" /> },
      ].map((item, index) => (
        <React.Fragment key={index}>
          <button
            style={buttonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            onClick={item.action}
          >
            {item.icon} <span style={{ marginLeft: '8px' }}>{item.label}</span>
          </button>
          <hr />
        </React.Fragment>
      ))}
    </div>
  );
}
