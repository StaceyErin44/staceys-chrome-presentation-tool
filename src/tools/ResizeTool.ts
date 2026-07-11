import type { Dimensions, ResizeMode, ToolResult } from '../types';
import { isExtensionEnvironment } from '../lib/chrome';

interface ResizeOptions {
  dimensions: Dimensions;
  mode: ResizeMode;
  center: boolean;
}

const requireExtension = () => {
  if (!isExtensionEnvironment()) {
    throw new Error('Load this build as an unpacked extension to resize Chrome.');
  }
};

export class ResizeTool {
  readonly id = 'resize';
  readonly name = 'Resize Chrome';

  async run({ dimensions, mode, center }: ResizeOptions): Promise<ToolResult> {
    requireExtension();

    const currentWindow = await chrome.windows.getCurrent();
    let width = dimensions.width;
    let height = dimensions.height;

    if (mode === 'viewport') {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!activeTab || !currentWindow.width || !currentWindow.height || !activeTab.width || !activeTab.height) {
        throw new Error('Chrome could not read the current viewport size. Try Outer Window mode.');
      }

      width += currentWindow.width - activeTab.width;
      height += currentWindow.height - activeTab.height;
    }

    const update: chrome.windows.UpdateInfo = { width, height };
    if (center) {
      const multiScreen = screen as Screen & { availLeft?: number; availTop?: number };
      update.left = Math.round((multiScreen.availLeft ?? 0) + (screen.availWidth - width) / 2);
      update.top = Math.round((multiScreen.availTop ?? 0) + (screen.availHeight - height) / 2);
    }

    await chrome.windows.update(currentWindow.id!, update);
    const label = mode === 'viewport' ? 'viewport' : 'window';
    return { message: `${dimensions.width} × ${dimensions.height} ${label} ready.` };
  }
}
