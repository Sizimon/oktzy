export interface Timestamp { // Represents a single timestamp entry
  title: string;
  note: string;
  time: number;
  timeStringConverted: string;
}

export interface Clip {
    id: string;
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
  modalOpen: boolean;
  retainedVolume: number;
  setRetainedVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  ref: React.RefObject<any>;
}

export interface ClipSidebarProps { // Represents the props for the note display component
    timestamps: Timestamp[];
    handleToTimestamp: (time: number) => void;
    clipUrl: string;
    clearTimestamps: () => void;
    handleTimestampModal: () => void;
    handleSaveModal: () => void;
}

export interface TimestampModalProps { // Represents the props for the timestamp modal component
  isOpen: boolean;
  currentTime: number;
  onSave: (title: string, note: string) => void;
  onClose: () => void;
}

export interface SaveModalProps { // Represents the props for the save modal component
  isOpen: boolean;
  onSave: (title:string, data: CuratorData) => void;
  onClose: () => void;
  curatorData: CuratorData | null;
  isSaving: boolean;
}

export interface SignInModalProps { // Represents the props for the sign-in modal component
  isOpen: boolean;
  onClose: () => void;
}