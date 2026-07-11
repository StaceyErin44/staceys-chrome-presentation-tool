export type ResizeMode = 'outer' | 'viewport';

export interface Dimensions {
  width: number;
  height: number;
}

export interface Tool {
  id: string;
  name: string;
  run(): Promise<void>;
}

export interface ToolResult {
  message: string;
}
