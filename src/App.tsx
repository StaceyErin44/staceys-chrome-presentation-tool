import { useEffect, useState } from 'react';
import { CameraIcon, LockIcon } from './components/Icons';
import { ModeToggle } from './components/ModeToggle';
import { PresetList } from './components/PresetList';
import { getChromeErrorMessage } from './lib/chrome';
import { getLastDimensions, saveLastDimensions } from './lib/settings';
import { ResizeTool } from './tools/ResizeTool';
import { ScreenshotTool } from './tools/ScreenshotTool';
import type { Dimensions, ResizeMode } from './types';

const presets: Dimensions[] = [
  { width: 800, height: 600 },
  { width: 1076, height: 768 },
  { width: 1366, height: 768 },
  { width: 1600, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
];

const defaultSize = presets[2];

function validDimension(value: number) {
  return Number.isInteger(value) && value >= 320 && value <= 7680;
}

export default function App() {
  const [mode, setMode] = useState<ResizeMode>('outer');
  const [selected, setSelected] = useState<Dimensions>(defaultSize);
  const [width, setWidth] = useState(String(defaultSize.width));
  const [height, setHeight] = useState(String(defaultSize.height));
  const [center, setCenter] = useState(true);
  const [status, setStatus] = useState('Ready to resize Chrome.');
  const [busy, setBusy] = useState<'resize' | 'capture' | null>(null);

  useEffect(() => {
    void getLastDimensions().then((lastDimensions) => {
      if (!lastDimensions) return;
      setSelected(lastDimensions);
      setWidth(String(lastDimensions.width));
      setHeight(String(lastDimensions.height));
    });
  }, []);

  const setPreset = (preset: Dimensions) => {
    setSelected(preset);
    setWidth(String(preset.width));
    setHeight(String(preset.height));
    void saveLastDimensions(preset);
  };

  const setCustomDimension = (axis: keyof Dimensions, value: string) => {
    const dimensions = {
      width: axis === 'width' ? Number(value) : Number(width),
      height: axis === 'height' ? Number(value) : Number(height),
    };
    if (axis === 'width') setWidth(value);
    else setHeight(value);
    if (validDimension(dimensions.width) && validDimension(dimensions.height)) {
      setSelected(dimensions);
      void saveLastDimensions(dimensions);
    }
  };

  const resize = async () => {
    const dimensions = { width: Number(width), height: Number(height) };
    if (!validDimension(dimensions.width) || !validDimension(dimensions.height)) {
      setStatus('Enter whole-number dimensions from 320 to 7680.');
      return;
    }
    void saveLastDimensions(dimensions);
    setBusy('resize');
    try {
      const result = await new ResizeTool().run({ dimensions, mode, center });
      setStatus(result.message);
    } catch (error) {
      setStatus(getChromeErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  const capture = async () => {
    setBusy('capture');
    try {
      const result = await new ScreenshotTool().run();
      setStatus(result.message);
    } catch (error) {
      setStatus(getChromeErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  return <main className="popup-shell">
    <header className="brand"><img className="brand-mark" src="/icons/icon-48.png" alt="" /><h1>Stacey's Chrome Presentation Tool</h1></header>

    <section aria-labelledby="resize-mode-title"><h2 id="resize-mode-title">Resize mode</h2><ModeToggle mode={mode} onChange={setMode} /></section>
    <section aria-labelledby="presets-title"><h2 id="presets-title">Presets</h2><PresetList presets={presets} selected={selected} onSelect={setPreset} /></section>
    <section aria-labelledby="custom-title"><h2 id="custom-title">Custom</h2><div className="custom-row"><label>Width<input aria-label="Custom width" type="number" inputMode="numeric" min="320" max="7680" value={width} onChange={(event) => setCustomDimension('width', event.target.value)} /></label><label>Height<input aria-label="Custom height" type="number" inputMode="numeric" min="320" max="7680" value={height} onChange={(event) => setCustomDimension('height', event.target.value)} /></label><button className="secondary-button" type="button" onClick={resize} disabled={busy !== null}>{busy === 'resize' ? 'Resizing…' : 'Resize'}</button></div><label className="check-row"><input type="checkbox" checked={center} onChange={(event) => setCenter(event.target.checked)} /><span>Center window</span></label></section>
    <div className="rule" />
    <button className="capture-button" type="button" onClick={capture} disabled={busy !== null}><CameraIcon />{busy === 'capture' ? 'Capturing…' : 'Capture Visible Tab'}</button>
    <p className="status" role="status" aria-live="polite">{status}</p>
    <footer><LockIcon /> <span>No telemetry. Local only.</span></footer>
  </main>;
}
