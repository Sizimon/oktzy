'use client';
import React, { useState, useEffect } from 'react';
import { TimestampModalProps } from '@/types/types';
import { BtnPrimary, BtnSecondary } from '@/components/ui/buttonVariants';

export const ClipNoteModal: React.FC<TimestampModalProps> = ({
  isOpen,
  onSave,
  onUpdate,
  onClose,
  editIndex,
  editData
}) => {
  // Use local state in the modal instead of the hook
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    setTitle(editData ? editData.title : '');
    setNote(editData ? editData.note : '');
  }, [editData, isOpen]);

  const handleSave = () => {
    onSave(title, note); // Pass the local values to parent
    setTitle(''); // Clear local state
    setNote('');
  };

  const handleUpdate = () => {
    onUpdate(editIndex, title, note); // Create this handler in parent
    setTitle('');
    setNote('');
  };

  const handleClose = () => {
    setTitle(''); // Clear local state
    setNote('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70">
      <div className="flex flex-col justify-center items-center text-text bg-foreground/60 border-[1px] border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg w-11/12 lg:w-5/12 xl:w-3/12">
        <input
          type="text"
          placeholder="Title"
          value={title}
          maxLength={24}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 p-2 text-center border-b-[1px] border-white/10 outline-none focus:border-violet-500 transition-colors duration-300"
        />
        <textarea
          placeholder="Your note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mb-4 p-2 border-[1px] border-white/10 bg-slate-900/40 rounded-2xl outline-1 focus:outline-violet-500 w-full min-h-[120px] no-scrollbar"
        />
        <div className="flex flex-row justify-center w-full space-x-4">
          {editIndex !== null ? (
            <BtnPrimary onClick={handleUpdate}>Update Timestamp</BtnPrimary>
          ) : (
            <BtnPrimary onClick={handleSave}>Save Timestamp</BtnPrimary>
          )}
          <BtnSecondary onClick={handleClose}>Cancel</BtnSecondary>
        </div>
      </div>
    </div>
  );
};