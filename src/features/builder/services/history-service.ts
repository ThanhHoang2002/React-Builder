import { BuilderElement, BuilderMutation } from "../types";
import { useBuilderStore } from "../stores/builderStore";

/**
 * Service để quản lý lịch sử thay đổi (undo/redo)
 */
export class HistoryService {
  private static maxHistoryLength = 50;
  
  /**
   * Thêm một mutation vào lịch sử
   * @param mutation Mutation cần thêm
   */
  static addMutation(mutation: BuilderMutation): void {
    const { addMutation } = useBuilderStore.getState();
    addMutation(mutation);
  }
  
  /**
   * Thêm một snapshot vào lịch sử
   * @param elements Danh sách các element
   */
  static addSnapshot(elements: BuilderElement[]): void {
    const state = useBuilderStore.getState();
    const { history } = state;
    
    // Tạo bản sao sâu của elements
    const snapshot = JSON.parse(JSON.stringify(elements));
    
    // Cập nhật history
    const newPast = [...history.past, snapshot];
    
    // Giới hạn kích thước history
    if (newPast.length > this.maxHistoryLength) {
      newPast.shift();
    }
    
    // Cập nhật store
    useBuilderStore.setState({
      history: {
        past: newPast,
        future: [],
      },
    });
  }
  
  /**
   * Undo một thay đổi
   */
  static undo(): void {
    const { undo } = useBuilderStore.getState();
    undo();
  }
  
  /**
   * Redo một thay đổi
   */
  static redo(): void {
    const { redo } = useBuilderStore.getState();
    redo();
  }
  
  /**
   * Xóa toàn bộ lịch sử
   */
  static clearHistory(): void {
    useBuilderStore.setState({
      history: {
        past: [],
        future: [],
      },
    });
  }
}
