import { ComponentDefinition } from "../types";
import { componentRegistry, blockRegistry, sectionRegistry } from "./componentRegistry";

// Đăng ký các component cơ bản
export function registerBasicComponents() {
  // Text Component
  const textComponent: ComponentDefinition = {
    type: "text",
    name: "Text",
    category: "Basic",
    tag: "div",
    html: "Double click to edit text",
    properties: [
      {
        key: "content",
        name: "Text Content",
        type: "text",
        htmlAttr: "innerHTML",
      },
      {
        key: "color",
        name: "Text Color",
        type: "color",
        cssProperty: "color",
        section: "style",
      },
      {
        key: "fontSize",
        name: "Font Size",
        type: "range",
        cssProperty: "font-size",
        section: "style",
        min: 8,
        max: 72,
        step: 1,
      },
    ],
    initialize: (element) => {
      return {
        ...element,
        style: {
          ...element.style,
          color: "#000000",
          fontSize: 16,
        },
      };
    },
  };

  // Button Component
  const buttonComponent: ComponentDefinition = {
    type: "button",
    name: "Button",
    category: "Basic",
    tag: "button",
    html: "Click me",
    properties: [
      {
        key: "content",
        name: "Button Text",
        type: "text",
        htmlAttr: "innerHTML",
      },
      {
        key: "color",
        name: "Text Color",
        type: "color",
        cssProperty: "color",
        section: "style",
      },
      {
        key: "backgroundColor",
        name: "Background Color",
        type: "color",
        cssProperty: "background-color",
        section: "style",
      },
      {
        key: "fontSize",
        name: "Font Size",
        type: "range",
        cssProperty: "font-size",
        section: "style",
        min: 8,
        max: 72,
        step: 1,
      },
      {
        key: "type",
        name: "Button Type",
        type: "select",
        htmlAttr: "type",
        section: "attributes",
        options: [
          { value: "button", text: "Button" },
          { value: "submit", text: "Submit" },
          { value: "reset", text: "Reset" },
        ],
      },
    ],
    initialize: (element) => {
      return {
        ...element,
        style: {
          ...element.style,
          color: "#ffffff",
          backgroundColor: "#3b82f6",
          fontSize: 16,
        },
        attributes: {
          ...element.attributes,
          type: "button",
        },
      };
    },
  };

  // Image Component
  const imageComponent: ComponentDefinition = {
    type: "image",
    name: "Image",
    category: "Basic",
    tag: "img",
    html: "https://via.placeholder.com/150",
    properties: [
      {
        key: "content",
        name: "Image URL",
        type: "text",
        htmlAttr: "src",
      },
      {
        key: "alt",
        name: "Alt Text",
        type: "text",
        htmlAttr: "alt",
        section: "attributes",
      },
      {
        key: "objectFit",
        name: "Object Fit",
        type: "select",
        cssProperty: "object-fit",
        section: "style",
        options: [
          { value: "cover", text: "Cover" },
          { value: "contain", text: "Contain" },
          { value: "fill", text: "Fill" },
          { value: "none", text: "None" },
          { value: "scale-down", text: "Scale Down" },
        ],
      },
    ],
    initialize: (element) => {
      return {
        ...element,
        style: {
          ...element.style,
          objectFit: "cover",
        },
        attributes: {
          ...element.attributes,
          alt: "Image",
        },
      };
    },
  };

  // Container Component
  const containerComponent: ComponentDefinition = {
    type: "container",
    name: "Container",
    category: "Basic",
    tag: "div",
    html: "",
    properties: [
      {
        key: "backgroundColor",
        name: "Background Color",
        type: "color",
        cssProperty: "background-color",
        section: "style",
      },
      {
        key: "border",
        name: "Border",
        type: "text",
        cssProperty: "border",
        section: "style",
      },
      {
        key: "borderRadius",
        name: "Border Radius",
        type: "text",
        cssProperty: "border-radius",
        section: "style",
      },
      {
        key: "padding",
        name: "Padding",
        type: "text",
        cssProperty: "padding",
        section: "style",
      },
    ],
    initialize: (element) => {
      return {
        ...element,
        style: {
          ...element.style,
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "4px",
          padding: "16px",
        },
        children: [],
      };
    },
  };

  // Đăng ký các component vào registry
  componentRegistry.register(textComponent);
  componentRegistry.register(buttonComponent);
  componentRegistry.register(imageComponent);
  componentRegistry.register(containerComponent);

  // Đăng ký một số block mẫu
  const heroBlock: ComponentDefinition = {
    type: "hero-block",
    name: "Hero Section",
    category: "Marketing",
    tag: "div",
    html: `<div class="text-center py-12">
      <h1 class="text-4xl font-bold mb-4">Welcome to our website</h1>
      <p class="text-lg mb-8">This is a hero section with a call-to-action button</p>
      <button class="bg-blue-500 text-white px-6 py-2 rounded-md">Get Started</button>
    </div>`,
    properties: [
      {
        key: "backgroundColor",
        name: "Background Color",
        type: "color",
        cssProperty: "background-color",
        section: "style",
      },
    ],
    initialize: (element) => {
      return {
        ...element,
        style: {
          ...element.style,
          width: 600,
          height: 300,
          backgroundColor: "#f9fafb",
        },
      };
    },
  };

  const featuresBlock: ComponentDefinition = {
    type: "features-block",
    name: "Features Section",
    category: "Marketing",
    tag: "div",
    html: `<div class="grid grid-cols-3 gap-6 py-12">
      <div class="text-center">
        <div class="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
          <span class="text-blue-500 text-2xl">1</span>
        </div>
        <h3 class="text-xl font-semibold mb-2">Feature One</h3>
        <p>Description of the first feature goes here.</p>
      </div>
      <div class="text-center">
        <div class="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
          <span class="text-green-500 text-2xl">2</span>
        </div>
        <h3 class="text-xl font-semibold mb-2">Feature Two</h3>
        <p>Description of the second feature goes here.</p>
      </div>
      <div class="text-center">
        <div class="bg-purple-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
          <span class="text-purple-500 text-2xl">3</span>
        </div>
        <h3 class="text-xl font-semibold mb-2">Feature Three</h3>
        <p>Description of the third feature goes here.</p>
      </div>
    </div>`,
    properties: [],
    initialize: (element) => {
      return {
        ...element,
        style: {
          ...element.style,
          width: 800,
          height: 300,
        },
      };
    },
  };

  // Đăng ký các block vào registry
  blockRegistry.register(heroBlock);
  blockRegistry.register(featuresBlock);

  // Đăng ký một số section mẫu
  const headerSection: ComponentDefinition = {
    type: "header-section",
    name: "Header",
    category: "Layout",
    tag: "header",
    html: `<header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="font-bold text-xl">Logo</div>
        <nav>
          <ul class="flex space-x-6">
            <li><a href="#" class="text-gray-800 hover:text-blue-500">Home</a></li>
            <li><a href="#" class="text-gray-800 hover:text-blue-500">About</a></li>
            <li><a href="#" class="text-gray-800 hover:text-blue-500">Services</a></li>
            <li><a href="#" class="text-gray-800 hover:text-blue-500">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>`,
    properties: [],
    initialize: (element) => {
      return {
        ...element,
        style: {
          ...element.style,
          width: "100%",
          height: 80,
        },
      };
    },
  };

  const footerSection: ComponentDefinition = {
    type: "footer-section",
    name: "Footer",
    category: "Layout",
    tag: "footer",
    html: `<footer class="bg-gray-800 text-white">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">About Us</h3>
            <p class="text-gray-300">Short description about your company goes here.</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="#" class="text-gray-300 hover:text-white">About</a></li>
              <li><a href="#" class="text-gray-300 hover:text-white">Services</a></li>
              <li><a href="#" class="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact</h3>
            <p class="text-gray-300">Email: info@example.com</p>
            <p class="text-gray-300">Phone: +1 234 567 890</p>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-4 text-center text-gray-300">
          &copy; 2025 Your Company. All rights reserved.
        </div>
      </div>
    </footer>`,
    properties: [],
    initialize: (element) => {
      return {
        ...element,
        style: {
          ...element.style,
          width: "100%",
          height: 300,
        },
      };
    },
  };

  // Đăng ký các section vào registry
  sectionRegistry.register(headerSection);
  sectionRegistry.register(footerSection);
}

// Hàm để đăng ký các component từ VvvebJs
export function registerVvvebComponents() {
  // Đây là nơi sẽ chuyển đổi các component từ VvvebJs sang định dạng của chúng ta
  // Ví dụ:
  
  // Bootstrap Button
  const bootstrapButton: ComponentDefinition = {
    type: "bootstrap-button",
    name: "Bootstrap Button",
    category: "Bootstrap",
    tag: "button",
    html: `<button type="button" class="btn btn-primary">Button</button>`,
    properties: [
      {
        key: "content",
        name: "Button Text",
        type: "text",
        htmlAttr: "innerHTML",
      },
      {
        key: "buttonType",
        name: "Button Type",
        type: "select",
        htmlAttr: "class",
        section: "style",
        options: [
          { value: "btn btn-primary", text: "Primary" },
          { value: "btn btn-secondary", text: "Secondary" },
          { value: "btn btn-success", text: "Success" },
          { value: "btn btn-danger", text: "Danger" },
          { value: "btn btn-warning", text: "Warning" },
          { value: "btn btn-info", text: "Info" },
          { value: "btn btn-light", text: "Light" },
          { value: "btn btn-dark", text: "Dark" },
        ],
      },
      {
        key: "buttonSize",
        name: "Button Size",
        type: "select",
        htmlAttr: "class",
        section: "style",
        options: [
          { value: "", text: "Default" },
          { value: "btn-lg", text: "Large" },
          { value: "btn-sm", text: "Small" },
        ],
      },
    ],
    initialize: (element) => {
      return {
        ...element,
        style: {
          ...element.style,
          width: 120,
          height: 40,
        },
        attributes: {
          ...element.attributes,
          type: "button",
          class: "btn btn-primary",
        },
      };
    },
  };

  // Đăng ký component
  componentRegistry.register(bootstrapButton);
}
