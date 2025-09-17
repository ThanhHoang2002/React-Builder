import { useState } from "react";
import { BuilderElement } from "@/features/builder/types";
import { useBuilderStore } from "@/features/builder/stores/builderStore";
import { componentRegistry } from "@/features/builder/registry/componentRegistry";

interface ElementPropertiesProps {
  selectedElement: BuilderElement;
}

const ElementProperties = ({ selectedElement }: ElementPropertiesProps) => {
  const { updateElement } = useBuilderStore();
  const [activeSection, setActiveSection] = useState<string>("style");

  // Lấy component definition từ registry nếu có
  const componentDef = componentRegistry.get(selectedElement.type);

  const handleStyleChange = (property: string, value: string | number) => {
    updateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        [property]: value,
      },
    });
  };

  const handleAttributeChange = (attribute: string, value: string) => {
    updateElement(selectedElement.id, {
      attributes: {
        ...selectedElement.attributes,
        [attribute]: value,
      },
    });
  };

  const handleContentChange = (value: string) => {
    updateElement(selectedElement.id, {
      content: value,
    });
  };

  // Các section mặc định
  const sections = [
    { id: "style", name: "Style" },
    { id: "attributes", name: "Attributes" },
    { id: "content", name: "Content" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Tabs */}
      <div className="flex border-b sticky top-0 bg-white z-10">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`py-2 px-4 text-sm ${
              activeSection === section.id
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.name}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Style Section */}
        {activeSection === "style" && (
          <div className="space-y-4">
            <h3 className="font-medium mb-3">Element Style</h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm mb-1">Width</label>
                <input
                  type="text"
                  value={selectedElement.style.width}
                  onChange={(e) => handleStyleChange("width", e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Height</label>
                <input
                  type="text"
                  value={selectedElement.style.height}
                  onChange={(e) => handleStyleChange("height", e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm mb-1">X Position</label>
                <input
                  type="number"
                  value={selectedElement.style.left}
                  onChange={(e) => handleStyleChange("left", Number(e.target.value))}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Y Position</label>
                <input
                  type="number"
                  value={selectedElement.style.top}
                  onChange={(e) => handleStyleChange("top", Number(e.target.value))}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Rotation</label>
              <input
                type="number"
                value={selectedElement.style.rotate}
                onChange={(e) => handleStyleChange("rotate", Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Z-Index</label>
              <input
                type="number"
                min="1"
                value={selectedElement.style.zIndex}
                onChange={(e) => handleStyleChange("zIndex", Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            {/* Thêm các thuộc tính style khác dựa trên loại element */}
            {(selectedElement.type === "text" || selectedElement.type === "button") && (
              <>
                <div>
                  <label className="block text-sm mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.style.color || "#000000"}
                      onChange={(e) => handleStyleChange("color", e.target.value)}
                      className="w-8 h-8 p-0 border-0"
                    />
                    <span className="text-sm font-mono">
                      {selectedElement.style.color || "#000000"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">Font Size</label>
                  <input
                    type="range"
                    min="8"
                    max="72"
                    value={selectedElement.style.fontSize || 16}
                    onChange={(e) =>
                      handleStyleChange("fontSize", Number(e.target.value))
                    }
                    className="w-full"
                  />
                  <div className="text-sm font-mono">
                    {selectedElement.style.fontSize || 16}px
                  </div>
                </div>
              </>
            )}

            {selectedElement.type === "button" && (
              <div>
                <label className="block text-sm mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedElement.style.backgroundColor || "#3b82f6"}
                    onChange={(e) =>
                      handleStyleChange("backgroundColor", e.target.value)
                    }
                    className="w-8 h-8 p-0 border-0"
                  />
                  <span className="text-sm font-mono">
                    {selectedElement.style.backgroundColor || "#3b82f6"}
                  </span>
                </div>
              </div>
            )}

            {selectedElement.type === "container" && (
              <>
                <div>
                  <label className="block text-sm mb-1">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.style.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        handleStyleChange("backgroundColor", e.target.value)
                      }
                      className="w-8 h-8 p-0 border-0"
                    />
                    <span className="text-sm font-mono">
                      {selectedElement.style.backgroundColor || "#ffffff"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">Border</label>
                  <input
                    type="text"
                    value={selectedElement.style.border || "none"}
                    onChange={(e) => handleStyleChange("border", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm"
                    placeholder="1px solid #000"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Border Radius</label>
                  <input
                    type="text"
                    value={selectedElement.style.borderRadius || "0"}
                    onChange={(e) =>
                      handleStyleChange("borderRadius", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded text-sm"
                    placeholder="4px"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Padding</label>
                  <input
                    type="text"
                    value={selectedElement.style.padding || "0"}
                    onChange={(e) => handleStyleChange("padding", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm"
                    placeholder="10px"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Attributes Section */}
        {activeSection === "attributes" && (
          <div className="space-y-4">
            <h3 className="font-medium mb-3">Element Attributes</h3>

            <div>
              <label className="block text-sm mb-1">ID</label>
              <input
                type="text"
                value={selectedElement.attributes.id || ""}
                onChange={(e) => handleAttributeChange("id", e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Class</label>
              <input
                type="text"
                value={selectedElement.attributes.class || ""}
                onChange={(e) => handleAttributeChange("class", e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            {selectedElement.type === "image" && (
              <div>
                <label className="block text-sm mb-1">Alt Text</label>
                <input
                  type="text"
                  value={selectedElement.attributes.alt || ""}
                  onChange={(e) => handleAttributeChange("alt", e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            )}

            {selectedElement.type === "button" && (
              <div>
                <label className="block text-sm mb-1">Type</label>
                <select
                  value={selectedElement.attributes.type || "button"}
                  onChange={(e) => handleAttributeChange("type", e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="button">button</option>
                  <option value="submit">submit</option>
                  <option value="reset">reset</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        {activeSection === "content" && (
          <div className="space-y-4">
            <h3 className="font-medium mb-3">Element Content</h3>

            {selectedElement.type === "text" || selectedElement.type === "button" ? (
              <div>
                <label className="block text-sm mb-1">Text</label>
                <textarea
                  value={selectedElement.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm h-24"
                />
              </div>
            ) : selectedElement.type === "image" ? (
              <div>
                <label className="block text-sm mb-1">Image URL</label>
                <input
                  type="text"
                  value={selectedElement.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
                <div className="mt-2">
                  <img
                    src={selectedElement.content}
                    alt="Preview"
                    className="max-h-32 object-contain border mt-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/150?text=Image+not+found";
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                This element type doesn't have editable content.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementProperties;