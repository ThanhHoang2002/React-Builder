import { useState } from "react";
import { BuilderElement } from "@/features/builder/types";
import { useBuilderStore } from "@/features/builder/stores/builderStore";

interface TextElementProps {
  element: BuilderElement;
}

const TextElement = ({ element }: TextElementProps) => {
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  if (isEditing) {
    return (
      <textarea
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full h-full p-2 resize-none outline-none border-none"
        style={{
          color: style.color || 'black',
          fontSize: style.fontSize ? `${style.fontSize}px` : '16px',
          fontFamily: 'inherit',
          backgroundColor: 'transparent',
        }}
      />
    );
  }
  
  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{
        color: style.color || 'black',
        fontSize: style.fontSize ? `${style.fontSize}px` : '16px',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {content}
    </div>
  );
};

export default TextElement;