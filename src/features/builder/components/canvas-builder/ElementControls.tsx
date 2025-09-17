import { BuilderElement } from "@/features/builder/types";
import { useBuilderStore } from "@/features/builder/stores/builderStore";
import { Trash2, Copy, ArrowUp, ArrowDown } from "lucide-react";

interface ElementControlsProps {
  selectedElement: BuilderElement;
}

const ElementControls = ({ selectedElement }: ElementControlsProps) => {
  const { removeElement, addElement } = useBuilderStore();

  const handleDelete = () => {
    removeElement(selectedElement.id);
  };

  const handleDuplicate = () => {
    // Tạo bản sao của element và thêm vào canvas
    const { id, ...elementWithoutId } = selectedElement;
    
    // Thêm offset để phân biệt với element gốc
    const newElement = {
      ...elementWithoutId,
      style: {
        ...elementWithoutId.style,
        top: elementWithoutId.style.top + 20,
        left: elementWithoutId.style.left + 20,
      }
    };
    
    addElement(newElement);
  };

  const handleMoveForward = () => {
    // Tăng z-index lên 1
    const { id, style } = selectedElement;
    const newZIndex = (typeof style.zIndex === 'number' ? style.zIndex : 0) + 1;
    
    useBuilderStore.getState().updateElement(id, {
      style: { ...style, zIndex: newZIndex }
    });
  };

  const handleMoveBackward = () => {
    // Giảm z-index xuống 1, nhưng không nhỏ hơn 0
    const { id, style } = selectedElement;
    const currentZIndex = typeof style.zIndex === 'number' ? style.zIndex : 0;
    const newZIndex = Math.max(0, currentZIndex - 1);
    
    useBuilderStore.getState().updateElement(id, {
      style: { ...style, zIndex: newZIndex }
    });
  };

  return (
    <div className="absolute flex gap-2 bg-white shadow-md rounded-md p-2 -top-12 left-0 z-50">
      <button
        className="p-1 hover:bg-gray-100 rounded-md text-gray-700"
        onClick={handleDuplicate}
        aria-label="Duplicate element"
        tabIndex={0}
      >
        <Copy size={16} />
      </button>
      
      <button
        className="p-1 hover:bg-gray-100 rounded-md text-gray-700"
        onClick={handleMoveForward}
        aria-label="Move forward"
        tabIndex={0}
      >
        <ArrowUp size={16} />
      </button>
      
      <button
        className="p-1 hover:bg-gray-100 rounded-md text-gray-700"
        onClick={handleMoveBackward}
        aria-label="Move backward"
        tabIndex={0}
      >
        <ArrowDown size={16} />
      </button>
      
      <button
        className="p-1 hover:bg-red-100 rounded-md text-red-500"
        onClick={handleDelete}
        aria-label="Delete element"
        tabIndex={0}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default ElementControls;