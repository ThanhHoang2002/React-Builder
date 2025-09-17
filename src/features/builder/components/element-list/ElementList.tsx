import { useEffect, useState } from "react";
import { useBuilderStore } from "@/features/builder/stores/builderStore";
import { componentRegistry } from "@/features/builder/registry/componentRegistry";
import ElementProperties from "../canvas-builder/ElementProperties";
import { BuilderElement, ComponentDefinition } from "@/features/builder/types";

const ElementList = () => {
  const { selectedElement, addElement } = useBuilderStore();
  const [groups, setGroups] = useState<Record<string, ComponentDefinition[]>>({});
  const [activeTab, setActiveTab] = useState<'components' | 'properties'>('components');

  useEffect(() => {
    // Nếu có phần tử được chọn, chuyển sang tab properties
    if (selectedElement) {
      setActiveTab('properties');
    }
  }, [selectedElement]);

  useEffect(() => {
    // Lấy tất cả các nhóm component từ registry
    const componentGroups = componentRegistry.getGroups();
    const groupedComponents: Record<string, ComponentDefinition[]> = {};
    
    // Lấy tất cả các component trong từng nhóm
    for (const group in componentGroups) {
      groupedComponents[group] = componentRegistry.getByGroup(group);
    }
    
    setGroups(groupedComponents);
  }, []);

  const handleAddElement = (component: ComponentDefinition) => {
    // Tạo element mới từ component definition
    const newElement: Omit<BuilderElement, 'id'> = {
      type: component.type,
      tag: component.tag,
      content: component.html || '',
      attributes: {},
      style: {
        width: 200,
        height: 100,
        top: Math.random() * 300 + 50,
        left: Math.random() * 300 + 50,
        rotate: 0,
        zIndex: 1,
      },
      componentInfo: {
        name: component.name,
        category: component.category,
        icon: component.icon,
        image: component.image,
        description: '',
      },
    };
    
    // Nếu component có hàm khởi tạo, sử dụng nó
    if (component.initialize) {
      const initializedElement = component.initialize({
        ...newElement,
        id: 'temp-id', // ID tạm thời, sẽ được thay thế khi thêm vào store
      });
      
      // Loại bỏ ID tạm thời
      const { id, ...elementWithoutId } = initializedElement;
      addElement(elementWithoutId);
    } else {
      addElement(newElement);
    }
  };

  // Các element mẫu cơ bản
  const basicElements = [
    {
      type: 'text',
      name: 'Text',
      tag: 'div',
      html: 'Double click to edit text',
      category: 'Basic',
      properties: [],
    },
    {
      type: 'button',
      name: 'Button',
      tag: 'button',
      html: 'Click me',
      category: 'Basic',
      properties: [],
    },
    {
      type: 'image',
      name: 'Image',
      tag: 'img',
      html: 'https://via.placeholder.com/150',
      category: 'Basic',
      properties: [],
    },
    {
      type: 'container',
      name: 'Container',
      tag: 'div',
      html: '',
      category: 'Basic',
      properties: [],
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 px-4 text-center ${activeTab === 'components' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('components')}
        >
          Elements
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center ${activeTab === 'properties' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('properties')}
          disabled={!selectedElement}
        >
          Properties
        </button>
      </div>
      
      {/* Components Tab */}
      {activeTab === 'components' && (
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Basic Elements */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">Basic Elements</h3>
            <div className="grid grid-cols-2 gap-2">
              {basicElements.map((element, index) => (
                <div
                  key={index}
                  className="p-3 bg-white rounded-md shadow-sm hover:bg-gray-50 cursor-pointer transition-colors flex flex-col items-center"
                  onClick={() => handleAddElement(element)}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                    {element.type === 'text' && <span className="text-lg">T</span>}
                    {element.type === 'button' && <span className="text-lg">B</span>}
                    {element.type === 'image' && <span className="text-lg">I</span>}
                    {element.type === 'container' && <span className="text-lg">C</span>}
                  </div>
                  <p className="text-xs">{element.name}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Registered Components */}
          {Object.entries(groups).map(([group, components]) => (
            <div key={group} className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-gray-700">{group}</h3>
              <div className="grid grid-cols-2 gap-2">
                {components.map((component, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white rounded-md shadow-sm hover:bg-gray-50 cursor-pointer transition-colors flex flex-col items-center"
                    onClick={() => handleAddElement(component)}
                  >
                    {component.image ? (
                      <img 
                        src={component.image} 
                        alt={component.name} 
                        className="w-10 h-10 object-contain mb-1" 
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                        <span className="text-lg">{component.name.charAt(0)}</span>
                      </div>
                    )}
                    <p className="text-xs">{component.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Properties Tab */}
      {activeTab === 'properties' && selectedElement && (
        <ElementProperties selectedElement={selectedElement} />
      )}
    </div>
  );
};

export default ElementList;