import { BuilderElement } from "../types";
import { useBuilderStore } from "../stores/builderStore";
import { HtmlService } from "./html-service";

/**
 * Service để xuất/nhập dự án
 */
export class ExportService {
  /**
   * Xuất dự án hiện tại sang HTML
   * @param title Tiêu đề trang
   * @returns Chuỗi HTML
   */
  static exportToHtml(title = 'Built with React Builder'): string {
    const { elements } = useBuilderStore.getState();
    return HtmlService.createHtmlPage(elements, title);
  }
  
  /**
   * Xuất dự án hiện tại sang JSON
   * @returns Chuỗi JSON
   */
  static exportToJson(): string {
    const { elements } = useBuilderStore.getState();
    return JSON.stringify(elements, null, 2);
  }
  
  /**
   * Nhập dự án từ JSON
   * @param json Chuỗi JSON
   * @returns true nếu thành công, false nếu thất bại
   */
  static importFromJson(json: string): boolean {
    try {
      const elements = JSON.parse(json) as BuilderElement[];
      
      if (!Array.isArray(elements)) {
        console.error('Invalid JSON format: Expected an array');
        return false;
      }
      
      // Kiểm tra cấu trúc của các element
      for (const element of elements) {
        if (!element.id || !element.type || !element.style) {
          console.error('Invalid element structure:', element);
          return false;
        }
      }
      
      // Cập nhật store
      useBuilderStore.setState({
        elements,
        selectedElement: null,
        history: {
          past: [],
          future: [],
        },
      });
      
      return true;
    } catch (error) {
      console.error('Error importing from JSON:', error);
      return false;
    }
  }
  
  /**
   * Nhập dự án từ HTML
   * @param html Chuỗi HTML
   * @returns true nếu thành công, false nếu thất bại
   */
  static importFromHtml(html: string): boolean {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const elements: BuilderElement[] = [];
      
      // Lấy tất cả các phần tử con trực tiếp của body
      for (const child of Array.from(doc.body.children)) {
        const element = HtmlService.parseHtml(child.outerHTML);
        if (element) {
          elements.push(element);
        }
      }
      
      if (elements.length === 0) {
        console.error('No valid elements found in HTML');
        return false;
      }
      
      // Cập nhật store
      useBuilderStore.setState({
        elements,
        selectedElement: null,
        history: {
          past: [],
          future: [],
        },
      });
      
      return true;
    } catch (error) {
      console.error('Error importing from HTML:', error);
      return false;
    }
  }
  
  /**
   * Tải xuống một file
   * @param content Nội dung file
   * @param fileName Tên file
   * @param contentType Loại nội dung
   */
  static downloadFile(content: string, fileName: string, contentType: string): void {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    
    URL.revokeObjectURL(a.href);
  }
  
  /**
   * Xuất và tải xuống dự án hiện tại sang HTML
   * @param fileName Tên file
   * @param title Tiêu đề trang
   */
  static downloadHtml(fileName = 'builder-export.html', title = 'Built with React Builder'): void {
    const html = this.exportToHtml(title);
    this.downloadFile(html, fileName, 'text/html');
  }
  
  /**
   * Xuất và tải xuống dự án hiện tại sang JSON
   * @param fileName Tên file
   */
  static downloadJson(fileName = 'builder-export.json'): void {
    const json = this.exportToJson();
    this.downloadFile(json, fileName, 'application/json');
  }
}
