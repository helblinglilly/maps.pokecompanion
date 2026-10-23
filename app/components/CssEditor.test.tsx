import { act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { CssEditor } from './CssEditor';
import { defaultMapCss } from './MapStyleEditor';

it('hydrates server-rendered CSS with a leading newline without mismatches', async () => {
  const editor = <CssEditor value={defaultMapCss} onChange={() => {}} />;
  const container = document.createElement('div');
  container.innerHTML = renderToString(editor);
  document.body.appendChild(container);
  const onRecoverableError = vi.fn();
  let root: ReturnType<typeof hydrateRoot>;
  try {
    await act(async () => {
      root = hydrateRoot(container, editor, { onRecoverableError });
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(container.querySelector('pre')?.textContent).toBe(`${defaultMapCss}\n`);
  } finally {
    await act(async () => root?.unmount());
    container.remove();
  }
});
