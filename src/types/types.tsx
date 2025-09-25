export interface Timestamp { // Represents a single timestamp entry
  title: string;
  note: string;
  time: number;
  timeStringConverted: string;
}

export interface Clip {
    id: number;
    title: string;
    clipUrl: string;
    timestamps: Timestamp[];
    created_at?: string;
    updated_at?: string;
}

export interface CuratorData { // Represents the data structure for a curator
  clipUrl: string;
  timestamps: Timestamp[];
  [key: string]: any; // Allows for additional properties
}

export interface ClipInputProps {
  clipUrl: string;
  onInputChange: (value: string) => void;
}

export interface ClipDisplayProps { // Represents the props for the video display component
  clipUrl: string;
  timestampModalOpen: boolean;
  signInModalOpen: boolean;
  setCurrentTime: (time: number) => void;
  ref: React.RefObject<any>;
}

export interface ClipSidebarProps { // Represents the props for the note display component
    clipTitle?: string;
    handleChangeClipTitle?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    timestamps: Timestamp[];
    handleToTimestamp: (time: number) => void;
    clipUrl: string;
    clearTimestamps: () => void;
    handleTimestampModal: (index?: number) => void;
    handleSave: (title: string) => void;
    handleDeleteTimestamp: (index: number) => void;
}

export interface TimestampModalProps { // Represents the props for the timestamp modal component
  isOpen: boolean;
  currentTime: number;
  onSave: (title: string, note: string) => void;
  onUpdate: (editIndex: number | null, title: string, note: string) => void;
  onClose: () => void;
  editIndex: number | null;
  editData: { title: string; note: string; time: number; timeStringConverted: string } | null;
}

export interface SignInModalProps { // Represents the props for the sign-in modal component
  isOpen: boolean;
  onClose: () => void;
}