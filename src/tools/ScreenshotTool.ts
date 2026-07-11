import type { ToolResult } from '../types';
import { isExtensionEnvironment } from '../lib/chrome';

const sanitize = (value: string) =>
  value
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64) || 'Screenshot';

export const createScreenshotFilename = (title: string, date = new Date()) => {
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
  const time = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((value) => String(value).padStart(2, '0'))
    .join('');
  return `${sanitize(title)}_${stamp}_${time}.png`;
};

export class ScreenshotTool {
  readonly id = 'screenshot';
  readonly name = 'Capture Visible Tab';

  async run(): Promise<ToolResult> {
    if (!isExtensionEnvironment()) {
      throw new Error('Load this build as an unpacked extension to capture a tab.');
    }

    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const image = await chrome.tabs.captureVisibleTab({ format: 'png' });
    const filename = createScreenshotFilename(activeTab?.title ?? 'Screenshot');

    const link = document.createElement('a');
    link.href = image;
    link.download = filename;
    link.click();
    link.remove();

    return { message: `Saved ${filename}` };
  }
}
