// Định nghĩa các kiểu dữ liệu cho Builder

export interface BuilderElement {
  id: string;
  type: string; // Loại component
  content: string; // Nội dung text hoặc URL
  tag: string; // Thẻ HTML (div, span, h1, etc.)
  children?: BuilderElement[]; // Hỗ trợ cấu trúc phân cấp
  attributes: {
    [key: string]: string; // Các thuộc tính HTML (id, class, src, etc.)
  };
  style: {
    width: number | string;
    height: number | string;
    top: number;
    left: number;
    rotate: number;
    zIndex: number;
    [key: string]: any; // Các thuộc tính CSS khác
  };
  // Thông tin về component
  componentInfo?: {
    name: string;
    category: string;
    icon?: string;
    image?: string;
    description?: string;
  };
}

// Định nghĩa component cho hệ thống
export interface ComponentDefinition {
  type: string; // Loại component
  name: string; // Tên hiển thị
  category: string; // Nhóm component
  icon?: string; // Icon hiển thị
  image?: string; // Hình ảnh xem trước
  html: string; // HTML mẫu
  tag: string; // Thẻ HTML mặc định
  properties: ComponentProperty[]; // Các thuộc tính có thể chỉnh sửa
  initialize?: (element: BuilderElement) => BuilderElement; // Hàm khởi tạo
}

// Định nghĩa thuộc tính của component
export interface ComponentProperty {
  key: string; // Khóa thuộc tính
  name: string; // Tên hiển thị
  type: 'text' | 'number' | 'select' | 'color' | 'checkbox' | 'range' | 'section'; // Loại input
  defaultValue?: any; // Giá trị mặc định
  htmlAttr?: string; // Thuộc tính HTML tương ứng
  cssProperty?: string; // Thuộc tính CSS tương ứng
  section?: string; // Phân loại thuộc tính
  options?: {value: string, text: string}[]; // Tùy chọn cho select
  min?: number; // Giá trị tối thiểu cho range
  max?: number; // Giá trị tối đa cho range
  step?: number; // Bước nhảy cho range
}

// Định nghĩa lịch sử thay đổi
export interface BuilderHistory {
  past: BuilderElement[][];
  future: BuilderElement[][];
}

// Định nghĩa mutation cho undo/redo
export interface BuilderMutation {
  type: 'attributes' | 'style' | 'content' | 'add' | 'remove' | 'move' | 'resize' | 'rotate';
  target: string; // ID của element
  attributeName?: string;
  oldValue?: any;
  newValue?: any;
}
