import { useEffect, useRef, useState } from "react";
import CanvasBuilder from "@/features/builder/components/canvas-builder/CanvasBuilder";
import ElementList from "@/features/builder/components/element-list/ElementList";
import { registerBasicComponents, registerVvvebComponents } from "@/features/builder/registry/component-definitions";
import { useBuilderStore } from "@/features/builder/stores/builderStore";
import { ExportService } from "@/features/builder/services/export-service";
import { HistoryService } from "@/features/builder/services/history-service";

const BuilderPage = () => {
  const { undo, redo } = useBuilderStore();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Khởi tạo registry khi component mount
  useEffect(() => {
    // Đăng ký các component cơ bản
    registerBasicComponents();
    
    // Đăng ký các component từ VvvebJs
    registerVvvebComponents();
  }, []);

  // Xử lý phím tắt
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      
      // Redo: Ctrl+Y hoặc Ctrl+Shift+Z
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
      }
      
      // Save: Ctrl+S
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleExportJson();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);

  // Xử lý xuất HTML
  const handleExportHtml = () => {
    ExportService.downloadHtml();
    setShowExportMenu(false);
  };

  // Xử lý xuất JSON
  const handleExportJson = () => {
    ExportService.downloadJson();
    setShowExportMenu(false);
  };

  // Xử lý nhập file
  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Xử lý khi file được chọn
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      
      if (file.name.endsWith('.json')) {
        const success = ExportService.importFromJson(content);
        if (!success) {
          alert('Failed to import JSON file. Invalid format.');
        }
      } else if (file.name.endsWith('.html')) {
        const success = ExportService.importFromHtml(content);
        if (!success) {
          alert('Failed to import HTML file. Invalid format.');
        }
      } else {
        alert('Unsupported file format. Please use .json or .html files.');
      }
      
      // Reset input để có thể chọn lại cùng một file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  // Xử lý xóa tất cả
  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all elements? This action cannot be undone.')) {
      useBuilderStore.setState({
        elements: [],
        selectedElement: null,
        history: {
          past: [],
          future: [],
        },
      });
    }
  };

  return (
    <div className="flex flex-row w-full min-h-screen">
      <div className="w-1/5 border-r bg-white shadow-md">
        <ElementList />
      </div>
      <div className="flex-1">
        <div className="h-12 bg-white border-b flex items-center px-4 justify-between">
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              onClick={undo}
              title="Undo (Ctrl+Z)"
            >
              Undo
            </button>
            <button 
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              onClick={redo}
              title="Redo (Ctrl+Y)"
            >
              Redo
            </button>
          </div>
          
          <div className="flex space-x-2 relative">
            <button 
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              Export / Import
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                <ul className="py-2">
                  <li>
                    <button 
                      className="px-4 py-2 hover:bg-gray-100 w-full text-left"
                      onClick={handleExportHtml}
                    >
                      Export as HTML
                    </button>
                  </li>
                  <li>
                    <button 
                      className="px-4 py-2 hover:bg-gray-100 w-full text-left"
                      onClick={handleExportJson}
                    >
                      Export as JSON
                    </button>
                  </li>
                  <li>
                    <button 
                      className="px-4 py-2 hover:bg-gray-100 w-full text-left"
                      onClick={handleImport}
                    >
                      Import from file
                    </button>
                  </li>
                  <li className="border-t border-gray-200">
                    <button 
                      className="px-4 py-2 hover:bg-gray-100 w-full text-left text-red-500"
                      onClick={handleClearAll}
                    >
                      Clear all
                    </button>
                  </li>
                </ul>
              </div>
            )}
            
            {/* Hidden file input for import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,.html"
              className="hidden"
            />
          </div>
        </div>
        <CanvasBuilder />
      </div>
    </div>
  );
};

export default BuilderPage;