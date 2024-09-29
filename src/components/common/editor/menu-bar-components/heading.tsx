import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react'; // Importing Editor type
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  label: string;
  value: 0 | 1 | 2 | 3; // Heading levels or 0 for Normal Text
  fontSize?: string;
  fontWeight?: string;
  style?: React.CSSProperties; // Optional inline style property
}

const textOptions: DropdownOption[] = [
  { label: 'Normal text', value: 0, fontSize: 'text-base', fontWeight: 'font-normal' },
  { label: 'Heading 1', value: 1, fontSize: 'text-2xl', fontWeight: 'font-bold', style: { fontSize: '1.5rem', fontWeight: 700 } },
  { label: 'Heading 2', value: 2, fontSize: 'text-xl', fontWeight: 'font-semibold' },
  { label: 'Heading 3', value: 3, fontSize: 'text-lg', fontWeight: 'font-semibold' },
];

interface HeadingProps {
  editor: Editor | null;
}

const Heading: React.FC<HeadingProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption>(textOptions[0]);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref to capture the dropdown element

  // Function to close dropdown if clicked outside
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    setIsOpen(false);

    // Toggle heading in Tiptap editor
    if (editor) {
      if (option.value === 0) {
        // For "Normal text", remove heading formatting
        editor.chain().focus().setParagraph().run();
      } else {
        // For headings, set the respective heading level
        editor.chain().focus().toggleHeading({ level: option.value }).run();
      }
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        {selectedOption.label}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 z-10 mt-2 w-48 origin-top-left bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-1">
            {textOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  // Add inline styles conditionally for each option
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${option.fontSize} ${option.fontWeight} text-black ${
                    selectedOption.value === option.value ? 'bg-gray-200' : ''
                  }`}
                  style={option.style} // This adds the optional inline style
                >
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

export default Heading;
