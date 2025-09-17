import { useState } from "react";
import { BuilderElement } from "@/features/builder/types";
import { useBuilderStore } from "@/features/builder/stores/builderStore";

interface ImageElementProps {
  element: BuilderElement;
}

const ImageElement = ({ element }: ImageElementProps) => {
  const { content, style } = element;
  const { updateElement } = useBuilderStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUrl, setEditedUrl] = useState(content);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    updateElement(element.id, { content: editedUrl });
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
      <div className="w-full h-full flex flex-col">
        <input
          value={editedUrl}
          onChange={(e) => setEditedUrl(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full p-2 outline-none border-none bg-white/80 absolute top-0 left-0 z-10"
          placeholder="Enter image URL"
        />
        <img 
          src={content} 
          alt="Preview" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>
    );
  }
  
  return (
    <img 
      src={content} 
      alt="Builder element" 
      className="w-full h-full object-cover"
      draggable={false}
      onDoubleClick={handleDoubleClick}
      onError={(e) => {
        // Fallback for broken images
        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+not+found';
      }}
    />
  );
};

export default ImageElement;