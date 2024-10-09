import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Table as TableIcon } from 'lucide-react';

interface TableGridSelectorProps {
  editor: Editor | null;
}

const TableGridSelector: React.FC<TableGridSelectorProps> = ({ editor }) => {
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null); // To detect clicks outside

  const MAX_ROWS = 7;
  const MAX_COLS = 7;

  const handleInsertTable = () => {
    if (editor) {
      editor.chain()
        .focus()
        .insertTable({ rows: rows, cols: cols, withHeaderRow: true })
        .focus() // Make sure the focus stays in the editor
        .run();
    }
    
    setIsOpen(false);
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={gridRef}>
      {/* Table Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded hover:bg-gray-200 transition-colors"
        title="Insert Table"
      >
        <TableIcon className="h-4 w-4" />
      </button>

      {/* Table grid UI */}
      {isOpen && (
        <div
          className="absolute z-50 mt-2 p-3 bg-white border border-gray-300 shadow-lg rounded-lg"
          style={{ minWidth: '200px', minHeight: '200px' }} // Ensure enough space for at least 5x5 grid
        >
          <div className="grid grid-cols-[repeat(7,_minmax(0,_20px))] gap-1 p-2">
            {Array.from({ length: MAX_ROWS }).map((_, rowIndex) =>
              Array.from({ length: MAX_COLS }).map((_, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-5 h-5 border border-gray-300 ${rowIndex < rows && colIndex < cols ? 'bg-blue-200' : 'bg-gray-100 hover:bg-blue-100'}`}
                  onMouseEnter={() => {
                    setRows(rowIndex+1);
                    setCols(colIndex+1);
                  }}
                  onClick={handleInsertTable}
                />
              ))
            )}
          </div>
          <div className="text-center text-sm mt-2">{`${cols} x ${rows}`}</div>
        </div>
      )}
    </div>
  );
};

export default TableGridSelector;
