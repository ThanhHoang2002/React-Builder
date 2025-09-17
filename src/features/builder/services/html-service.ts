import { BuilderElement } from "../types";

/**
 * Service để quản lý HTML và CSS
 */
export class HtmlService {
  /**
   * Chuyển đổi một BuilderElement thành HTML
   * @param element Element cần chuyển đổi
   * @returns Chuỗi HTML
   */
  static elementToHtml(element: BuilderElement): string {
    // Xác định tag
    const tag = element.tag || 'div';
    
    // Xây dựng các thuộc tính
    let attributesStr = '';
    for (const [key, value] of Object.entries(element.attributes)) {
      attributesStr += ` ${key}="${value}"`;
    }
    
    // Xây dựng inline style
    let styleStr = '';
    for (const [key, value] of Object.entries(element.style)) {
      if (key === 'top' || key === 'left' || key === 'rotate' || key === 'zIndex') {
        // Bỏ qua các thuộc tính vị trí và xoay
        continue;
      }
      
      // Chuyển đổi camelCase sang kebab-case
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      
      // Thêm đơn vị cho các giá trị số nếu cần
      let cssValue = value;
      if (typeof value === 'number' && ['width', 'height', 'fontSize', 'borderRadius', 'padding', 'margin'].includes(key)) {
        cssValue = `${value}px`;
      }
      
      styleStr += `${cssKey}:${cssValue};`;
    }
    
    if (styleStr) {
      attributesStr += ` style="${styleStr}"`;
    }
    
    // Xử lý nội dung
    let content = '';
    
    // Nếu là thẻ img, không cần nội dung
    if (tag === 'img') {
      attributesStr += ` src="${element.content}"`;
      return `<${tag}${attributesStr} />`;
    }
    
    // Nếu có phần tử con
    if (element.children && element.children.length > 0) {
      for (const child of element.children) {
        content += this.elementToHtml(child);
      }
    } else {
      content = element.content || '';
    }
    
    // Trả về HTML hoàn chỉnh
    return `<${tag}${attributesStr}>${content}</${tag}>`;
  }
  
  /**
   * Chuyển đổi danh sách các BuilderElement thành HTML
   * @param elements Danh sách các element
   * @returns Chuỗi HTML
   */
  static elementsToHtml(elements: BuilderElement[]): string {
    let html = '';
    
    for (const element of elements) {
      html += this.elementToHtml(element);
    }
    
    return html;
  }
  
  /**
   * Tạo một trang HTML hoàn chỉnh từ danh sách các BuilderElement
   * @param elements Danh sách các element
   * @param title Tiêu đề trang
   * @returns Chuỗi HTML hoàn chỉnh
   */
  static createHtmlPage(elements: BuilderElement[], title = 'Built with React Builder'): string {
    const bodyContent = this.elementsToHtml(elements);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    
    .builder-element {
      position: relative;
    }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>`;
  }
  
  /**
   * Phân tích HTML và chuyển đổi thành BuilderElement
   * @param html Chuỗi HTML
   * @returns BuilderElement hoặc null nếu không thể phân tích
   */
  static parseHtml(html: string): BuilderElement | null {
    try {
      // Tạo một DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Lấy phần tử đầu tiên
      const element = doc.body.firstElementChild;
      
      if (!element) return null;
      
      return this.domToElement(element);
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return null;
    }
  }
  
  /**
   * Chuyển đổi một DOM element thành BuilderElement
   * @param domElement DOM element
   * @returns BuilderElement
   */
  private static domToElement(domElement: Element): BuilderElement {
    // Lấy tag
    const tag = domElement.tagName.toLowerCase();
    
    // Lấy các thuộc tính
    const attributes: Record<string, string> = {};
    for (const attr of Array.from(domElement.attributes)) {
      if (attr.name !== 'style') {
        attributes[attr.name] = attr.value;
      }
    }
    
    // Lấy style
    const style: Record<string, any> = {
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      rotate: 0,
      zIndex: 1,
    };
    
    const domStyle = domElement.getAttribute('style');
    if (domStyle) {
      const styleEntries = domStyle.split(';').filter(Boolean);
      
      for (const entry of styleEntries) {
        const [key, value] = entry.split(':').map(s => s.trim());
        
        // Chuyển đổi kebab-case sang camelCase
        const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        
        // Chuyển đổi giá trị sang số nếu có thể
        let parsedValue: string | number = value;
        if (value.endsWith('px')) {
          parsedValue = parseFloat(value);
        }
        
        style[camelKey] = parsedValue;
      }
    }
    
    // Xác định nội dung
    let content = '';
    if (tag === 'img') {
      content = domElement.getAttribute('src') || '';
    } else {
      content = domElement.innerHTML;
    }
    
    // Xác định loại element
    let type = 'container';
    if (tag === 'img') type = 'image';
    else if (tag === 'button') type = 'button';
    else if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'].includes(tag)) type = 'text';
    
    // Xác định các phần tử con
    const children: BuilderElement[] = [];
    
    if (domElement.children.length > 0 && tag !== 'img' && tag !== 'button') {
      for (const child of Array.from(domElement.children)) {
        children.push(this.domToElement(child));
      }
      
      // Nếu có phần tử con, xóa nội dung
      content = '';
    }
    
    // Tạo BuilderElement
    return {
      id: crypto.randomUUID(),
      type,
      tag,
      content,
      attributes,
      style,
      children: children.length > 0 ? children : undefined,
    };
  }
}
