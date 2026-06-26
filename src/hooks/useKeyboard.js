import { useEffect } from 'react';

export default function useKeyboard(handlers) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    function handleKeyDown(e) {
      if (e.repeat) return;
      for (const { key, ctrl, shift, fn } of handlers) {
        if (e.key === key &&
            (!ctrl || e.ctrlKey) &&
            (!shift || e.shiftKey)) {
          if (fn(e) === false) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}

export function useEnter(fn) {
  useKeyboard([{ key: 'Enter', fn }]);
}

export function useEscape(fn) {
  useKeyboard([{ key: 'Escape', fn }]);
}

export function useDigit(fn) {
  useKeyboard(
    ['1','2','3','4','5','6'].map(key => ({ key, fn: () => fn(parseInt(key)) }))
  );
}
