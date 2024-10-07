import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown } from 'lucide-react';

interface TextAlignPickerProps {
  editor: Editor | null;
}

const textAlignOptions = [
  { label: 'Align Left', value: 'left', icon: AlignLeft },
  { label: 'Align Center', value: 'center', icon: AlignCenter },
  { label: 'Align Right', value: 'right', icon: AlignRight },
  { label: 'Justify', value: 'justify', icon: AlignJustify },
];

const TextAlignPicker: React.FC<TextAlignPickerProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAlign, setSelectedAlign] = useState<string>('left'); // Default to left alignment
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to close dropdown if clicked outside
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectAlign = (value: string) => {
    setSelectedAlign(value);
    setIsOpen(false);

    // Apply the selected text alignment
    if (editor) {
      editor.chain().focus().setTextAlign(value).run();
    }
  };

  const getIconComponent = (value: string) => {
    const selectedOption = textAlignOptions.find(option => option.value === value);
    return selectedOption ? selectedOption.icon : AlignLeft;
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Dropdown button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded hover:bg-gray-200 hover transition-colors flex items-center justify-between"
      >
        {/* Display the current selected icon */}
        {React.createElement(getIconComponent(selectedAlign), { className: 'h-4 w-4' })}
        <ChevronDown className="h-3 w-3 ml-1" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 z-10 mt-2 w-48 origin-top-left bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-1">
            {textAlignOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelectAlign(option.value)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                    selectedAlign === option.value ? 'bg-gray-200' : ''
                  }`}
                >
                  {React.createElement(option.icon, { className: 'h-3 w-3 mr-2' })}
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TextAlignPicker;
