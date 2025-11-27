import React from 'react';
import { ClipInputProps } from '@/types/types';
import { toast } from 'react-toastify';

export const ClipInput: React.FC<ClipInputProps> = ({ clipUrl, onInputChange }) => {

  const handlePaste = async (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text');

    if (clipUrl !== '') {
      toast.warning(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>
            <p>Changing the video URL without saving will result in the loss of current timestamps.</p><br />
            <p>Please clear timestamps or save your clip before changing the URL.</p>
          </div>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                toast.dismiss();
                onInputChange(pastedText);
              }}
              style={{ padding: '4px 12px', background: '#fbbf24', border: 'none', borderRadius: '4px', color: '#222' }}
            >
              Continue
            </button>
            <button
              onClick={() => toast.dismiss()}
              style={{ padding: '4px 12px', background: '#64748b', border: 'none', borderRadius: '4px', color: '#fff' }}
            >
              Cancel
            </button>
          </div>
        </div>
      );
      return;
    }
    onInputChange(pastedText);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const navigationKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace', 'Delete', 'Tab', 'Home', 'End'];

    const isCtrlKey = event.ctrlKey || event.metaKey; // metaKey for Mac command key
    const allowedCtrlKeys = ['a', 'c', 'v', 'x', 'z', 'y'];

    const shouldAllow = navigationKeys.includes(event.key) ||
      (isCtrlKey && allowedCtrlKeys.includes(event.key.toLowerCase()));

    if (!shouldAllow && event.key.length === 1) {
      event.preventDefault();
    }
  }

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;

    // Allow deletion but prevent new typing
    if (newValue.length <= clipUrl.length) {
      if (clipUrl !== '') {
      toast.warning(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>
            <p>Changing the video URL without saving will result in the loss of current timestamps.</p><br />
            <p>Please clear timestamps or save your clip before changing the URL.</p>
          </div>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                toast.dismiss();
                onInputChange(newValue);
              }}
              style={{ padding: '4px 12px', background: '#fbbf24', border: 'none', borderRadius: '4px', color: '#222' }}
            >
              Continue
            </button>
            <button
              onClick={() => toast.dismiss()}
              style={{ padding: '4px 12px', background: '#64748b', border: 'none', borderRadius: '4px', color: '#fff' }}
            >
              Cancel
            </button>
          </div>
        </div>
      );
      return;
    }
      onInputChange(newValue);
    } else {
      // Reset to previous value if they tried to type
      target.value = clipUrl;
    }
  };

  return (
    <div className="flex justify-center w-full z-20">
      <input
        type="text"
        value={clipUrl}
        placeholder="Enter clip URL..."
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="p-2 border-[1px] opacity-50 border-white/10 outline-1 focus:outline-violet-500 focus:opacity-100 text-sm lg:text-base bg-foreground/5 text-text rounded-full w-2/3 lg:w-1/3 transition-all duration-300"
      />
    </div>
  );
}