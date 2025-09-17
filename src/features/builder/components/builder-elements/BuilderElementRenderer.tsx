import { BuilderElement } from "@/features/builder/types";
import { componentRegistry } from "@/features/builder/registry/componentRegistry";
import TextElement from "./TextElement";
import ButtonElement from "./ButtonElement";
import ImageElement from "./ImageElement";
import ContainerElement from "./ContainerElement";

interface BuilderElementRendererProps {
  element: BuilderElement;
}

const BuilderElementRenderer = ({ element }: BuilderElementRendererProps) => {
  // Render các element dựa trên type
  switch (element.type) {
    case 'text':
      return <TextElement element={element} />;
    case 'button':
      return <ButtonElement element={element} />;
    case 'image':
      return <ImageElement element={element} />;
    case 'container':
      return <ContainerElement element={element} />;
    default:
      // Tìm component tương ứng trong registry
      const componentDef = componentRegistry.get(element.type);
      
      if (componentDef) {
        // Nếu có custom renderer, sử dụng nó
        if (componentDef.initialize) {
          return <div dangerouslySetInnerHTML={{ __html: element.content }} />;
        }
      }
      
      // Fallback: render element dựa trên tag HTML
      return (
        <div className="w-full h-full flex items-center justify-center border border-dashed border-gray-300">
          Unknown element: {element.type}
        </div>
      );
  }
};

export default BuilderElementRenderer;