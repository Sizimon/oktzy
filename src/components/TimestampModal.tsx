'use client';
import React, { useState } from 'react';
import { TimestampModalProps } from '@/types/types';
import { formatCurrentTime } from '@/utils/formatTime';

export const TimestampModal: React.FC<TimestampModalProps> = ({
  isOpen,
  currentTime,
  onSave,
  onClose
}) => {
  // Use local state in the modal instead of the hook
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    onSave(title, note); // Pass the local values to parent
    setTitle(''); // Clear local state
    setNote('');
  };

  const handleClose = () => {
    setTitle(''); // Clear local state
    setNote('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="flex flex-col justify-center items-center text-text bg-background p-6 rounded shadow-lg w-2/6">
        <p>{formatCurrentTime(currentTime)}</p>
        <input
          type="text"
          placeholder="Timestamp title..."
          value={title}
          maxLength={24}
          onChange={(e) => setTitle(e.target.value)}
          className="my-4 p-2 border border-gray-300 bg-foreground rounded"
        />
        <textarea
          placeholder="Timestamp note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mb-4 p-2 border bg-foreground border-gray-300 rounded w-full"
        />
        <div className="flex flex-row justify-center w-full space-x-4">
          <button
            className="ml-2 p-2 bg-green-500 rounded cursor-pointer"
            onClick={handleSave}
          >
            Save Timestamp
          </button>
          <button
            className="p-2 bg-red-500 rounded cursor-pointer"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};