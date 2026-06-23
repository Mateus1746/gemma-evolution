import { expect, test, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('window.renderFrame and window.__appReady are correctly exposed', async () => {
  render(<App />);

  // Wait a bit for useEffect to run
  await new Promise(resolve => setTimeout(resolve, 100));

  expect(window.renderFrame).toBeDefined();
  expect(typeof window.renderFrame).toBe('function');
  expect((window as any).__appReady).toBe(true);

  // Test if renderFrame calls seek (indirectly check if it doesn't crash)
  // Since we can't easily spy on the hook's internal state here without more setup,
  // we just ensure the global API is callable.
  await (window as any).renderFrame(1000);
});
