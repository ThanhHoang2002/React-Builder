import { create } from 'zustand';
import { BuilderElement, ComponentDefinition, BuilderHistory, BuilderMutation } from '../types';

interface BuilderStore {
  // Các phần tử trên canvas
  elements: BuilderElement[];
  // Phần tử đang được chọn
  selectedElement: BuilderElement | null;
  // Lịch sử thay đổi
  history: BuilderHistory;
  // Các component có sẵn
  availableComponents: ComponentDefinition[];
  // Các block có sẵn
  availableBlocks: ComponentDefinition[];
  // Các section có sẵn
  availableSections: ComponentDefinition[];
  
  // Các action
  addElement: (element: Omit<BuilderElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  moveElement: (id: string, x: number, y: number) => void;
  resizeElement: (id: string, width: number | string, height: number | string) => void;
  rotateElement: (id: string, angle: number) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  addMutation: (mutation: BuilderMutation) => void;
  
  // Quản lý component
  registerComponent: (component: ComponentDefinition) => void;
  registerBlock: (block: ComponentDefinition) => void;
  registerSection: (section: ComponentDefinition) => void;
  
  // Export/Import
  exportToHtml: () => string;
  importFromHtml: (html: string) => void;
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  elements: [],
  selectedElement: null,
  history: {
    past: [],
    future: []
  },
  availableComponents: [],
  availableBlocks: [],
  availableSections: [],
  
  addElement: (element) => {
    const newElement: BuilderElement = {
      ...element,
      id: crypto.randomUUID(),
      attributes: element.attributes || {},
      tag: element.tag || 'div',
    };
    
    set((state) => {
      // Lưu trạng thái hiện tại vào history
      const newPast = [...state.history.past, state.elements];
      
      return {
        elements: [...state.elements, newElement],
        selectedElement: newElement,
        history: {
          past: newPast,
          future: []
        }
      };
    });
  },
  
  updateElement: (id, updates) => {
    set((state) => {
      // Lưu trạng thái hiện tại vào history
      const newPast = [...state.history.past, state.elements];
      
      const updatedElements = state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      );
      
      return {
        elements: updatedElements,
        selectedElement: state.selectedElement?.id === id
          ? { ...state.selectedElement, ...updates }
          : state.selectedElement,
        history: {
          past: newPast,
          future: []
        }
      };
    });
  },
  
  removeElement: (id) => {
    set((state) => {
      // Lưu trạng thái hiện tại vào history
      const newPast = [...state.history.past, state.elements];
      
      return {
        elements: state.elements.filter((el) => el.id !== id),
        selectedElement: state.selectedElement?.id === id
          ? null
          : state.selectedElement,
        history: {
          past: newPast,
          future: []
        }
      };
    });
  },
  
  selectElement: (id) => {
    set((state) => ({
      selectedElement: id
        ? state.elements.find((el) => el.id === id) || null
        : null,
    }));
  },
  
  moveElement: (id, x, y) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;
      
      // Lưu trạng thái hiện tại vào history
      const newPast = [...state.history.past, state.elements];
      
      const updatedElements = state.elements.map((el) =>
        el.id === id
          ? {
              ...el,
              style: {
                ...el.style,
                top: y,
                left: x,
              },
            }
          : el
      );
      
      return {
        elements: updatedElements,
        selectedElement: state.selectedElement?.id === id
          ? {
              ...state.selectedElement,
              style: {
                ...state.selectedElement.style,
                top: y,
                left: x,
              },
            }
          : state.selectedElement,
        history: {
          past: newPast,
          future: []
        }
      };
    });
  },
  
  resizeElement: (id, width, height) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;
      
      // Lưu trạng thái hiện tại vào history
      const newPast = [...state.history.past, state.elements];
      
      const updatedElements = state.elements.map((el) =>
        el.id === id
          ? {
              ...el,
              style: {
                ...el.style,
                width,
                height,
              },
            }
          : el
      );
      
      return {
        elements: updatedElements,
        selectedElement: state.selectedElement?.id === id
          ? {
              ...state.selectedElement,
              style: {
                ...state.selectedElement.style,
                width,
                height,
              },
            }
          : state.selectedElement,
        history: {
          past: newPast,
          future: []
        }
      };
    });
  },
  
  rotateElement: (id, angle) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;
      
      // Lưu trạng thái hiện tại vào history
      const newPast = [...state.history.past, state.elements];
      
      const updatedElements = state.elements.map((el) =>
        el.id === id
          ? {
              ...el,
              style: {
                ...el.style,
                rotate: angle,
              },
            }
          : el
      );
      
      return {
        elements: updatedElements,
        selectedElement: state.selectedElement?.id === id
          ? {
              ...state.selectedElement,
              style: {
                ...state.selectedElement.style,
                rotate: angle,
              },
            }
          : state.selectedElement,
        history: {
          past: newPast,
          future: []
        }
      };
    });
  },
  
  undo: () => {
    set((state) => {
      if (state.history.past.length === 0) return state;
      
      const newPast = state.history.past.slice(0, -1);
      const previousElements = state.history.past[state.history.past.length - 1];
      
      return {
        elements: previousElements,
        selectedElement: state.selectedElement
          ? previousElements.find((el) => el.id === state.selectedElement?.id) || null
          : null,
        history: {
          past: newPast,
          future: [state.elements, ...state.history.future]
        }
      };
    });
  },
  
  redo: () => {
    set((state) => {
      if (state.history.future.length === 0) return state;
      
      const [nextElements, ...newFuture] = state.history.future;
      
      return {
        elements: nextElements,
        selectedElement: state.selectedElement
          ? nextElements.find((el) => el.id === state.selectedElement?.id) || null
          : null,
        history: {
          past: [...state.history.past, state.elements],
          future: newFuture
        }
      };
    });
  },
  
  addMutation: (mutation) => {
    // Implement mutation tracking for more granular undo/redo
    console.log('Mutation added:', mutation);
  },
  
  registerComponent: (component) => {
    set((state) => ({
      availableComponents: [...state.availableComponents, component]
    }));
  },
  
  registerBlock: (block) => {
    set((state) => ({
      availableBlocks: [...state.availableBlocks, block]
    }));
  },
  
  registerSection: (section) => {
    set((state) => ({
      availableSections: [...state.availableSections, section]
    }));
  },
  
  exportToHtml: () => {
    // Implement HTML export
    return '<div>Export not implemented yet</div>';
  },
  
  importFromHtml: (html) => {
    // Implement HTML import
    console.log('Import HTML:', html);
  }
}));