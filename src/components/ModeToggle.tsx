import type { ResizeMode } from '../types';

interface ModeToggleProps {
  mode: ResizeMode;
  onChange: (mode: ResizeMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return <div className="mode-toggle" role="radiogroup" aria-label="Resize mode">
    <button type="button" role="radio" aria-checked={mode === 'outer'} className={mode === 'outer' ? 'selected' : ''} onClick={() => onChange('outer')}>Outer Window</button>
    <button type="button" role="radio" aria-checked={mode === 'viewport'} className={mode === 'viewport' ? 'selected' : ''} onClick={() => onChange('viewport')}>Viewport / Client Area</button>
  </div>;
}
