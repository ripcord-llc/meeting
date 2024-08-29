import { useRef, useState } from 'react';

export default function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  async function copyToClipboard(text: string) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!navigator.clipboard) {
      console.warn('Clipboard API not available');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 5000);

      return true;
    } catch (e) {
      console.warn('Copy failed', e);
      return false;
    }
  }

  return { copied, copyToClipboard };
}
