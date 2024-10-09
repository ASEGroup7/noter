import React, { useState, useRef } from "react";
import { Editor } from "@tiptap/react";
import { ALargeSmall } from "lucide-react"; // Importing the icon

interface ColorPickerProps {
  editor: Editor;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ editor }) => {
  const [textColor, setTextColor] = useState(editor.getAttributes("textStyle").color || "#000000"); // Default text color
  const colorInputRef = useRef<HTMLInputElement>(null); // Reference to the hidden color input

  // Handle the change of text color
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = event.target.value;
    setTextColor(selectedColor); // Update local text color
    editor.chain().focus().setColor(selectedColor).run(); // Apply the color in the editor
  };

  // Function to check if text is selected
  const hasSelection = () => {
    const { from, to } = editor.state.selection;
    return to > from; // If the selection is more than 0 characters, text is selected
  };

  // Trigger the hidden color picker if no text is selected or toggle text color
  const handleButtonClick = () => {
    if (hasSelection()) {
      // If text is selected, apply the text color
      editor.chain().focus().setColor(textColor).run();
    } else {
      // If no text is selected, open the color picker to choose a new text color
      if (colorInputRef.current) {
        colorInputRef.current.click(); // Programmatically open the color picker
      }
    }
  };

  return (
    <div className="color-picker-wrapper">
      <button
        className="color-button"
        onClick={handleButtonClick} // Handle button click to either apply color or open color picker
      >
        {/* Text Color Icon */}
        <ALargeSmall className="h-5 w-5" />
        {/* Underline showing the chosen text color */}
        <div className="color-underline" style={{ backgroundColor: textColor }}></div>
        {/* Tooltip for hover */}
        <div className="tooltip">Font Color</div>
      </button>

      {/* Hidden color input to select text color */}
      <input
        ref={colorInputRef}
        type="color"
        value={textColor}
        onChange={handleColorChange}
        style={{ display: "none" }} // Hidden color input
      />
    </div>
  );
};

export default ColorPicker;
