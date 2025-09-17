import { ComponentDefinition } from '../types';

// Singleton pattern để quản lý component registry
class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: Record<string, ComponentDefinition> = {};
  private componentGroups: Record<string, string[]> = {};

  private constructor() {
    // Private constructor để đảm bảo singleton
  }

  public static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  // Đăng ký một component mới
  public register(component: ComponentDefinition): void {
    if (this.components[component.type]) {
      console.warn(`Component type "${component.type}" already registered. Overwriting.`);
    }
    
    this.components[component.type] = component;
    
    // Thêm vào nhóm
    if (!this.componentGroups[component.category]) {
      this.componentGroups[component.category] = [];
    }
    
    if (!this.componentGroups[component.category].includes(component.type)) {
      this.componentGroups[component.category].push(component.type);
    }
  }

  // Lấy một component theo type
  public get(type: string): ComponentDefinition | undefined {
    return this.components[type];
  }

  // Lấy tất cả các component
  public getAll(): ComponentDefinition[] {
    return Object.values(this.components);
  }

  // Lấy tất cả các nhóm component
  public getGroups(): Record<string, string[]> {
    return this.componentGroups;
  }

  // Lấy tất cả các component trong một nhóm
  public getByGroup(group: string): ComponentDefinition[] {
    const types = this.componentGroups[group] || [];
    return types.map(type => this.components[type]).filter(Boolean);
  }

  // Mở rộng một component từ một component khác
  public extend(baseType: string, newType: string, overrides: Partial<ComponentDefinition>): void {
    const baseComponent = this.components[baseType];
    
    if (!baseComponent) {
      console.error(`Cannot extend from "${baseType}". Component not found.`);
      return;
    }
    
    const newComponent: ComponentDefinition = {
      ...baseComponent,
      ...overrides,
      type: newType,
      properties: [
        ...(baseComponent.properties || []),
        ...(overrides.properties || []),
      ],
    };
    
    this.register(newComponent);
  }
}

// Singleton instance
export const componentRegistry = ComponentRegistry.getInstance();

// Block registry (sử dụng cùng cấu trúc với component)
class BlockRegistry {
  private static instance: BlockRegistry;
  private blocks: Record<string, ComponentDefinition> = {};
  private blockGroups: Record<string, string[]> = {};

  private constructor() {
    // Private constructor để đảm bảo singleton
  }

  public static getInstance(): BlockRegistry {
    if (!BlockRegistry.instance) {
      BlockRegistry.instance = new BlockRegistry();
    }
    return BlockRegistry.instance;
  }

  // Đăng ký một block mới
  public register(block: ComponentDefinition): void {
    if (this.blocks[block.type]) {
      console.warn(`Block type "${block.type}" already registered. Overwriting.`);
    }
    
    this.blocks[block.type] = block;
    
    // Thêm vào nhóm
    if (!this.blockGroups[block.category]) {
      this.blockGroups[block.category] = [];
    }
    
    if (!this.blockGroups[block.category].includes(block.type)) {
      this.blockGroups[block.category].push(block.type);
    }
  }

  // Lấy một block theo type
  public get(type: string): ComponentDefinition | undefined {
    return this.blocks[type];
  }

  // Lấy tất cả các block
  public getAll(): ComponentDefinition[] {
    return Object.values(this.blocks);
  }

  // Lấy tất cả các nhóm block
  public getGroups(): Record<string, string[]> {
    return this.blockGroups;
  }

  // Lấy tất cả các block trong một nhóm
  public getByGroup(group: string): ComponentDefinition[] {
    const types = this.blockGroups[group] || [];
    return types.map(type => this.blocks[type]).filter(Boolean);
  }
}

// Singleton instance
export const blockRegistry = BlockRegistry.getInstance();

// Section registry (sử dụng cùng cấu trúc với component)
class SectionRegistry {
  private static instance: SectionRegistry;
  private sections: Record<string, ComponentDefinition> = {};
  private sectionGroups: Record<string, string[]> = {};

  private constructor() {
    // Private constructor để đảm bảo singleton
  }

  public static getInstance(): SectionRegistry {
    if (!SectionRegistry.instance) {
      SectionRegistry.instance = new SectionRegistry();
    }
    return SectionRegistry.instance;
  }

  // Đăng ký một section mới
  public register(section: ComponentDefinition): void {
    if (this.sections[section.type]) {
      console.warn(`Section type "${section.type}" already registered. Overwriting.`);
    }
    
    this.sections[section.type] = section;
    
    // Thêm vào nhóm
    if (!this.sectionGroups[section.category]) {
      this.sectionGroups[section.category] = [];
    }
    
    if (!this.sectionGroups[section.category].includes(section.type)) {
      this.sectionGroups[section.category].push(section.type);
    }
  }

  // Lấy một section theo type
  public get(type: string): ComponentDefinition | undefined {
    return this.sections[type];
  }

  // Lấy tất cả các section
  public getAll(): ComponentDefinition[] {
    return Object.values(this.sections);
  }

  // Lấy tất cả các nhóm section
  public getGroups(): Record<string, string[]> {
    return this.sectionGroups;
  }

  // Lấy tất cả các section trong một nhóm
  public getByGroup(group: string): ComponentDefinition[] {
    const types = this.sectionGroups[group] || [];
    return types.map(type => this.sections[type]).filter(Boolean);
  }
}

// Singleton instance
export const sectionRegistry = SectionRegistry.getInstance();
