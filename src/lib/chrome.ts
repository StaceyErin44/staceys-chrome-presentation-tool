export const isExtensionEnvironment = () =>
  typeof chrome !== 'undefined' && Boolean(chrome.windows?.getCurrent);

export const getChromeErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Chrome could not complete that action.';
