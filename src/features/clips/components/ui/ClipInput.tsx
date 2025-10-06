import React from 'react';
import { ClipInputProps } from '@/types/types';
import { toast } from 'react-toastify';

export const ClipInput: React.FC<ClipInputProps> = ({ clipUrl, onInputChange }) => {

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => { // Checks if clip url is empty, if not then if the user attempts to change the value they will recieve a warning prompt.
    const newValue = event.target.value;
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
  }

return (
  <div className="flex justify-center w-full z-20">
    <input
      type="text"
      value={clipUrl}
      placeholder="Enter clip URL..."
      onChange={handleInputChange}
      className="p-2 border-[1px] opacity-50 border-white/10 outline-1 focus:outline-violet-500 focus:opacity-100 text-sm lg:text-base bg-foreground/5 text-text rounded-full w-2/3 lg:w-1/3 transition-all duration-300"
    />
  </div>
);
}