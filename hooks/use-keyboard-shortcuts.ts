import { useEffect } from 'react';

interface KeyboardHandlers {
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
  onMute?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardHandlers) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlers.onPlayPause?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handlers.onNext?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlers.onPrevious?.();
          break;
        case 'KeyM':
          e.preventDefault();
          handlers.onMute?.();
          break;
        case 'Equal':
        case 'Plus':
          e.preventDefault();
          handlers.onVolumeUp?.();
          break;
        case 'Minus':
          e.preventDefault();
          handlers.onVolumeDown?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlers]);
}
