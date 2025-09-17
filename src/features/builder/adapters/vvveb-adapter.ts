import { ComponentDefinition, ComponentProperty } from "../types";
import { componentRegistry } from "../registry/componentRegistry";

/**
 * Adapter để chuyển đổi định nghĩa component từ VvvebJs sang định dạng của React Builder
 */
export class VvvebAdapter {
  /**
   * Chuyển đổi một component từ VvvebJs sang định dạng của React Builder
   * @param vvvebComponent Component từ VvvebJs
   * @returns Component định dạng của React Builder
   */
  static convertComponent(vvvebComponent: any): ComponentDefinition {
    // Xác định loại component
    const type = vvvebComponent.type || 'unknown';
    
    // Xác định tên component
    const name = vvvebComponent.name || 'Unknown Component';
    
    // Xác định category
    const category = vvvebComponent.category || 'Other';
    
    // Xác định tag HTML
    const tag = vvvebComponent.nodes?.[0] || 'div';
    
    // Xác định HTML mẫu
    const html = vvvebComponent.html || '';
    
    // Chuyển đổi các thuộc tính
    const properties: ComponentProperty[] = [];
    
    if (vvvebComponent.properties) {
      for (const prop of vvvebComponent.properties) {
        // Bỏ qua các section input
        if (prop.inputtype === 'SectionInput') continue;
        
        // Chuyển đổi kiểu input
        let propType: 'text' | 'number' | 'select' | 'color' | 'checkbox' | 'range' | 'section' = 'text';
        
        if (prop.inputtype === 'TextInput') propType = 'text';
        else if (prop.inputtype === 'NumberInput') propType = 'number';
        else if (prop.inputtype === 'SelectInput') propType = 'select';
        else if (prop.inputtype === 'ColorInput') propType = 'color';
        else if (prop.inputtype === 'CheckboxInput') propType = 'checkbox';
        else if (prop.inputtype === 'RangeInput') propType = 'range';
        
        // Tạo thuộc tính mới
        const newProp: ComponentProperty = {
          key: prop.key,
          name: prop.name || prop.key,
          type: propType,
          section: prop.section || 'content',
        };
        
        // Thêm thuộc tính HTML nếu có
        if (prop.htmlAttr) {
          newProp.htmlAttr = prop.htmlAttr;
        }
        
        // Thêm thuộc tính CSS nếu có
        if (prop.cssProperty) {
          newProp.cssProperty = prop.cssProperty;
        }
        
        // Thêm các tùy chọn nếu là select
        if (propType === 'select' && prop.data && prop.data.options) {
          newProp.options = prop.data.options.map((opt: any) => ({
            value: opt.value,
            text: opt.text,
          }));
        }
        
        // Thêm các thuộc tính cho range
        if (propType === 'range') {
          newProp.min = prop.data?.min || 0;
          newProp.max = prop.data?.max || 100;
          newProp.step = prop.data?.step || 1;
        }
        
        // Thêm giá trị mặc định nếu có
        if (prop.defaultValue !== undefined) {
          newProp.defaultValue = prop.defaultValue;
        }
        
        properties.push(newProp);
      }
    }
    
    // Tạo component mới
    const component: ComponentDefinition = {
      type,
      name,
      category,
      tag,
      html,
      properties,
      image: vvvebComponent.image,
      initialize: (element) => {
        // Khởi tạo các giá trị mặc định
        const style = { ...element.style };
        const attributes: Record<string, string> = { ...element.attributes };
        
        // Áp dụng các giá trị mặc định từ thuộc tính
        for (const prop of properties) {
          if (prop.defaultValue !== undefined) {
            if (prop.cssProperty) {
              style[prop.key] = prop.defaultValue;
            } else if (prop.htmlAttr) {
              attributes[prop.htmlAttr] = prop.defaultValue;
            }
          }
        }
        
        return {
          ...element,
          style,
          attributes,
        };
      },
    };
    
    return component;
  }
  
  /**
   * Đăng ký tất cả các component từ VvvebJs
   * @param vvvebComponents Đối tượng chứa tất cả các component từ VvvebJs
   */
  static registerAllComponents(vvvebComponents: Record<string, any>) {
    for (const type in vvvebComponents._components) {
      const vvvebComponent = vvvebComponents._components[type];
      
      // Bỏ qua component _base
      if (type === '_base') continue;
      
      // Chuyển đổi và đăng ký component
      const component = this.convertComponent({
        ...vvvebComponent,
        type,
      });
      
      componentRegistry.register(component);
    }
  }
}
