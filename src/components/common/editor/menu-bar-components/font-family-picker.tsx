import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react'; // Importing Editor type
import { ChevronDown } from 'lucide-react';

// Define the available font family options
interface DropdownOption {
  label: string;
  value: string; // Font family value to apply in the editor
  style?: React.CSSProperties; // Optional inline style property
}

// Font family options with optional inline styles
const fontFamilyOptions: DropdownOption[] = [
  { label: 'Inter', value: 'Inter', style: { fontFamily: 'Inter' } },
  { label: 'Roboto', value: 'Roboto', style: { fontFamily: 'Roboto' } },
  { label: 'Arial', value: 'Arial', style: { fontFamily: 'Arial' } },
  { label: 'Georgia', value: 'Georgia', style: { fontFamily: 'Georgia' } },
  { label: 'Times New Roman', value: 'Times New Roman', style: { fontFamily: 'Times New Roman' } },
  { label: 'Courier New', value: 'Courier New', style: { fontFamily: 'Courier New' } },
];

interface FontFamilyPickerProps {
  editor: Editor | null;
}

const FontFamilyPicker: React.FC<FontFamilyPickerProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption>(fontFamilyOptions[0]); // Default to Inter
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

    // Set font family in the TipTap editor
    if (editor) {
      editor.chain().focus().setFontFamily(option.value).run();
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
            {fontFamilyOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  // Add inline styles conditionally for each option
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedOption.value === option.value ? 'bg-gray-200' : ''
                  }`}
                  style={option.style} // This adds the inline style to display the font family
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

export default FontFamilyPicker;
