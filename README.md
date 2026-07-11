# Stacey's Chrome Presentation Tool

A lightweight, local-only Chrome extension for repeatable presentation window sizes and timestamped visible-tab screenshots.

## What it does

- Resizes the current Chrome window to presentation presets or a custom size.
- Supports outer-window sizing and viewport sizing.
- Captures the active visible tab as a timestamped PNG.
- Saves only the most recently used dimensions locally on the device.

The extension has no analytics, telemetry, host permissions, or network requests.

## Build and load locally

```powershell
npm install
npm run build
```

In Chrome, open `chrome://extensions`, enable **Developer mode**, select **Load unpacked**, then choose the generated `dist` directory.

## Publish to the Chrome Web Store

Build the extension, then zip the *contents* of `dist` (not the `dist` folder itself) and upload that ZIP in the Chrome Web Store Developer Dashboard. The generated package must include `manifest.json` at its root.

## v0.1 behavior

- Resizes the current browser window to six presentation presets or a custom size.
- Supports exact outer-window sizing, or viewport/client-area sizing calculated from Chrome's current tab dimensions.
- Centers the resized window when enabled.
- Captures the active visible tab as a PNG using a title-based timestamped filename.
- Remembers the latest valid dimensions selected, locally on the device.
- Uses only `windows`, `activeTab`, and `storage` permissions. Screenshot downloads are started from the extension popup, so the `downloads` permission is not needed.

No analytics, telemetry, host permissions, or network requests are included.
