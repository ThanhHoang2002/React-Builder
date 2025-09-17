import { BuilderElement } from "@/features/builder/types";
import { useBuilderStore } from "@/features/builder/stores/builderStore";
import BuilderElementRenderer from "./BuilderElementRenderer";

interface ContainerElementProps {
  element: BuilderElement;
}

const ContainerElement = ({ element }: ContainerElementProps) => {
  const { style, children = [] } = element;
  const { selectElement } = useBuilderStore();

  const handleChildClick = (e: React.MouseEvent, childId: string) => {
    e.stopPropagation();
    selectElement(childId);
  };

  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor: style.backgroundColor || 'transparent',
        border: style.border || 'none',
        borderRadius: style.borderRadius || '0',
        padding: style.padding || '0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Render các phần tử con */}
      {children.map((child) => (
        <div
          key={child.id}
          data-id={child.id}
          className="absolute"
          style={{
            width: child.style.width,
            height: child.style.height,
            top: child.style.top,
            left: child.style.left,
            transform: `rotate(${child.style.rotate}deg)`,
            zIndex: child.style.zIndex,
          }}
          onClick={(e) => handleChildClick(e, child.id)}
        >
          <BuilderElementRenderer element={child} />
        </div>
      ))}
      
      {/* Hiển thị placeholder nếu không có phần tử con */}
      {children.length === 0 && (
        <div className="w-full h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
          Container (Drag elements here)
        </div>
      )}
    </div>
  );
};

export default ContainerElement;
