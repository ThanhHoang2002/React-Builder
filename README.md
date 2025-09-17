# React Builder

React Builder là một công cụ xây dựng giao diện web trực quan dựa trên React, được tích hợp từ VvvebJs và tùy chỉnh để hoạt động với React.

## Tính năng

- Kéo thả các phần tử vào canvas
- Di chuyển, thay đổi kích thước và xoay phần tử
- Chỉnh sửa thuộc tính của phần tử
- Undo/Redo các thay đổi
- Xuất/Nhập dự án (HTML, JSON)
- Hệ thống quản lý component, block và section

## Cài đặt

```bash
# Cài đặt các dependencies
pnpm install

# Chạy ứng dụng
pnpm dev
```

## Cấu trúc dự án

```
src/
  ├── app/
  │   └── pages/
  │       └── builder/
  │           └── BuilderPage.tsx   # Trang chính của builder
  └── features/
      └── builder/
          ├── adapters/             # Các adapter để tích hợp với thư viện khác
          │   └── vvveb-adapter.ts  # Adapter cho VvvebJs
          ├── components/
          │   ├── builder-elements/ # Các component hiển thị phần tử
          │   ├── canvas-builder/   # Canvas để kéo thả
          │   └── element-list/     # Danh sách các phần tử có thể thêm
          ├── registry/             # Hệ thống đăng ký component
          │   ├── componentRegistry.ts
          │   └── component-definitions.ts
          ├── services/             # Các service
          │   ├── export-service.ts # Xuất/Nhập dự án
          │   ├── history-service.ts # Quản lý lịch sử
          │   └── html-service.ts   # Xử lý HTML
          ├── stores/               # State management
          │   └── builderStore.ts   # Store chính
          └── types/                # Các type definition
              └── index.ts
```

## Hướng dẫn sử dụng

### 1. Thêm phần tử vào canvas

- Chọn một phần tử từ danh sách bên trái
- Kéo thả hoặc click để thêm vào canvas

### 2. Chỉnh sửa phần tử

- Click vào phần tử để chọn
- Sử dụng các điểm điều khiển để di chuyển, thay đổi kích thước hoặc xoay
- Double-click vào text hoặc button để chỉnh sửa nội dung
- Sử dụng panel bên phải để chỉnh sửa các thuộc tính

### 3. Quản lý phần tử

- Sử dụng các nút trên thanh công cụ của phần tử để xóa, sao chép, đưa lên trước hoặc đưa ra sau
- Sử dụng Ctrl+Z để hoàn tác và Ctrl+Y để làm lại

### 4. Xuất/Nhập dự án

- Click vào nút "Export / Import" trên thanh công cụ
- Chọn "Export as HTML" để xuất sang HTML
- Chọn "Export as JSON" để xuất sang JSON
- Chọn "Import from file" để nhập từ file HTML hoặc JSON

## Tích hợp VvvebJs

React Builder tích hợp các tính năng từ VvvebJs:

1. **Hệ thống Component**: Sử dụng cùng cấu trúc component với VvvebJs nhưng được chuyển đổi sang React
2. **Quản lý thuộc tính**: Hỗ trợ các loại input như text, number, select, color, checkbox, range
3. **Block và Section**: Hỗ trợ các block và section từ VvvebJs

## Mở rộng

### Thêm component mới

Để thêm một component mới, bạn cần:

1. Tạo một định nghĩa component trong `src/features/builder/registry/component-definitions.ts`:

```typescript
const myComponent: ComponentDefinition = {
  type: "my-component",
  name: "My Component",
  category: "Custom",
  tag: "div",
  html: "<div>My Component</div>",
  properties: [
    {
      key: "content",
      name: "Content",
      type: "text",
      htmlAttr: "innerHTML",
    },
    // Thêm các thuộc tính khác
  ],
  initialize: (element) => {
    return {
      ...element,
      style: {
        ...element.style,
        // Các style mặc định
      },
    };
  },
};

// Đăng ký component
componentRegistry.register(myComponent);
```

2. Nếu cần renderer tùy chỉnh, tạo một component trong `src/features/builder/components/builder-elements/` và cập nhật `BuilderElementRenderer.tsx`

### Tích hợp thêm từ VvvebJs

Để tích hợp thêm các tính năng từ VvvebJs:

1. Phân tích tính năng trong VvvebJs
2. Tạo adapter hoặc service tương ứng trong React Builder
3. Tích hợp vào hệ thống hiện tại

## Giấy phép

Dự án này được phát hành theo giấy phép MIT.