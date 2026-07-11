import type { Dimensions } from '../types';

const storageKey = 'lastDimensions';

const isValidDimensions = (value: unknown): value is Dimensions => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<Dimensions>;
  return typeof candidate.width === 'number' && typeof candidate.height === 'number'
    && Number.isInteger(candidate.width) && Number.isInteger(candidate.height)
    && candidate.width >= 320 && candidate.width <= 7680
    && candidate.height >= 320 && candidate.height <= 7680;
};

export async function getLastDimensions(): Promise<Dimensions | undefined> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    const stored = await chrome.storage.local.get(storageKey);
    return isValidDimensions(stored[storageKey]) ? stored[storageKey] : undefined;
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return undefined;
    const parsed = JSON.parse(stored);
    return isValidDimensions(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export async function saveLastDimensions(dimensions: Dimensions): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    await chrome.storage.local.set({ [storageKey]: dimensions });
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(dimensions));
}
