import React, { useState, useRef } from "react";
import { Editor } from "@tiptap/react";
import { Highlighter } from "lucide-react"; // Importing the Highlighter icon

interface HighlightPickerProps {
  editor: Editor;
}

const HighlightPicker: React.FC<HighlightPickerProps> = ({ editor }) => {
  const [highlightColor, setHighlightColor] = useState('#ffc078'); // Default highlight color
  const colorInputRef = useRef<HTMLInputElement>(null); // Reference to the hidden color input

  // Handle the change of highlight color
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = event.target.value;
    setHighlightColor(selectedColor); // Update local highlight color
  };

  // Function to check if text is selected
  const hasSelection = () => {
    const { from, to } = editor.state.selection;
    return to > from; // If the selection is more than 0 characters, text is selected
  };

  // Trigger the hidden color picker if no text is selected or toggle highlight
  const handleButtonClick = () => {
    if (hasSelection()) {
      // If text is selected, toggle the highlight with the current color
      if (editor.isActive('highlight', { color: highlightColor })) {
        // If the current selection is already highlighted, this will remove it
        editor.chain().focus().unsetHighlight().run();
      } else {
        // If the selection is not highlighted, apply the highlight with the current color
        editor.chain().focus().toggleHighlight({ color: highlightColor }).run();
      }
    } else {
      // If no text is selected, open the color picker to choose a new highlight color
      if (colorInputRef.current) {
        colorInputRef.current.click(); // Programmatically open the color picker
      }
    }
  };

  return (
    <div className="color-picker-wrapper">
      <button
        className={`color-button ${editor.isActive('highlight', { color: highlightColor }) ? 'is-active' : ''}`}
        onClick={handleButtonClick} // Handle button click to either apply/unapply highlight or open color picker
      >
        {/* Highlighter Icon */}
        <Highlighter className="h-5 w-5"/>
        {/* Underline showing the chosen highlight color */}
        <div className="color-underline" style={{ backgroundColor: highlightColor }}></div>
        {/* Tooltip for hover */}
        <div className="tooltip">Highlight</div>
      </button>

      {/* Hidden color input to select highlight color */}
      <input
        ref={colorInputRef}
        type="color"
        value={highlightColor}
        onChange={handleColorChange}
        style={{ display: "none" }} // Hidden color input
      />
    </div>
  );
};

export default HighlightPicker;
