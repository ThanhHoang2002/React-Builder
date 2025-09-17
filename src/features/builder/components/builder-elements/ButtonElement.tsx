import { useState } from "react";
import { BuilderElement } from "@/features/builder/types";
import { useBuilderStore } from "@/features/builder/stores/builderStore";

interface ButtonElementProps {
  element: BuilderElement;
}

const ButtonElement = ({ element }: ButtonElementProps) => {
  const { content, style } = element;
  const { updateElement } = useBuilderStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(content);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    updateElement(element.id, { content: editedText });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    }
  };

  if (isEditing) {
    return (
      <input
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full h-full p-2 text-center outline-none border-none"
        style={{
          color: style.color || 'white',
          fontSize: style.fontSize ? `${style.fontSize}px` : '16px',
          backgroundColor: style.backgroundColor || '#3b82f6',
          borderRadius: '0.375rem',
        }}
      />
    );
  }
  
  return (
    <button
      className="w-full h-full rounded-md flex items-center justify-center"
      style={{
        backgroundColor: style.backgroundColor || '#3b82f6',
        color: style.color || 'white',
        fontSize: style.fontSize ? `${style.fontSize}px` : '16px',
        cursor: 'default',
        userSelect: 'none',
      }}
      onClick={(e) => e.preventDefault()}
      onDoubleClick={handleDoubleClick}
    >
      {content}
    </button>
  );
};

export default ButtonElement;