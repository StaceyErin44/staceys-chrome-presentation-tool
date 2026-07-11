import type { Dimensions } from '../types';

interface PresetListProps {
  presets: Dimensions[];
  selected: Dimensions;
  onSelect: (dimensions: Dimensions) => void;
}

const isSelected = (a: Dimensions, b: Dimensions) => a.width === b.width && a.height === b.height;

export function PresetList({ presets, selected, onSelect }: PresetListProps) {
  return <div className="preset-list" role="radiogroup" aria-label="Presentation dimensions">
    {presets.map((preset) => {
      const checked = isSelected(preset, selected);
      return <button className={`preset ${checked ? 'selected' : ''}`} type="button" role="radio" aria-checked={checked} onClick={() => onSelect(preset)} key={`${preset.width}-${preset.height}`}><span className="radio-dot" aria-hidden="true" /> <span>{preset.width} × {preset.height}</span></button>;
    })}
  </div>;
}
