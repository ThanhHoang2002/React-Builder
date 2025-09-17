import { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";
import { useBuilderStore } from "@/features/builder/stores/builderStore";
import ElementControls from "./ElementControls";
import BuilderElementRenderer from "../builder-elements/BuilderElementRenderer";

const CanvasBuilder = () => {
  const { 
    elements, 
    selectedElement, 
    selectElement, 
    moveElement, 
    resizeElement, 
    rotateElement 
  } = useBuilderStore();
  
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSelectElement = (id: string) => {
    selectElement(id);
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current) {
      selectElement(null);
    }
  };

  return (
    <div className="relative w-full h-full overflow-auto p-4 bg-gray-100">
      <div 
        className="relative bg-white shadow-md mx-auto"
        style={{ width: canvasSize.width, height: canvasSize.height }}
        ref={canvasRef}
        onClick={handleClickOutside}
      >
        {elements.map((element) => (
          <div
            key={element.id}
            data-id={element.id}
            className={`absolute ${selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''}`}
            style={{
              width: element.style.width,
              height: element.style.height,
              top: element.style.top,
              left: element.style.left,
              transform: `rotate(${element.style.rotate}deg)`,
              zIndex: element.style.zIndex,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectElement(element.id);
            }}
          >
            {selectedElement?.id === element.id && <ElementControls selectedElement={element} />}
            <BuilderElementRenderer element={element} />
          </div>
        ))}

        {selectedElement && (      
          <Moveable
            target={document.querySelector(`div[data-id="${selectedElement.id}"]`) as HTMLElement}
            draggable={true}
            throttleDrag={1}
            edgeDraggable={false}
            startDragRotate={0}
            throttleDragRotate={0}
            scalable={true}
            keepRatio={false}
            throttleScale={0}
            renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
            rotatable={true}
            throttleRotate={0}
            rotationPosition={"top"}
            originDraggable={true}
            originRelative={true}
            onDragOrigin={(e) => {
              e.target.style.transformOrigin = e.transformOrigin;
            }}
            onRender={(e) => {
              e.target.style.transform = e.transform;
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CanvasBuilder;