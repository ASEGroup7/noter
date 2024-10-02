import React, { useState, useRef } from "react";
import { Editor } from "@tiptap/react";
import { ALargeSmall } from 'lucide-react';

interface ColorPickerProps {
  editor: Editor;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ editor }) => {
  const [color, setColor] = useState(editor.getAttributes("textStyle").color || "#000000");
  const colorInputRef = useRef<HTMLInputElement>(null); // Create a ref for the hidden color input

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = event.target.value;
    setColor(selectedColor); // Update the local state for the color
    editor.chain().focus().setColor(selectedColor).run(); // Update the editor text color
  };

  const triggerColorPicker = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click(); // Programmatically trigger the color input click event
    }
  };

  return (
    <div className="color-picker-wrapper" style={{ position: "relative", display: "inline-block" }}>
      <button className="color-button" onClick={triggerColorPicker}>
        <ALargeSmall className="h-5 w-5" />
        <div className="color-underline" style={{ width: "100%", height: "3px", backgroundColor: color }}></div>
        {/* Tooltip for hover */}
        <div className="tooltip">Font Color</div>
      </button>

      {/* Hidden color input that is programmatically triggered */}
      <input
        ref={colorInputRef}
        type="color"
        value={color}
        onChange={handleColorChange}
        style={{ display: "none" }} // Keep this hidden, and use JavaScript to trigger it
      />
    </div>
  );
};

export default ColorPicker;
