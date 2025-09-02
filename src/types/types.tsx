export interface Timestamp { // Represents a single timestamp entry
  title: string;
  note: string;
  time: number;
  timeStringConverted: string;
}

export interface CuratorData { // Represents the data structure for a curator
  clipUrl: string;
  timestamps: Timestamp[];
  [key: string]: any; // Allows for additional properties
}

export interface VideoInputProps {
  clipUrl: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface VideoDisplayProps { // Represents the props for the video display component
  clipUrl: string;
  modalOpen: boolean;
  retainedVolume: number;
  setRetainedVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  ref: React.RefObject<any>;
}

export interface NoteDisplayProps {
    timestamps: Timestamp[];
    handleToTimestamp: (time: number) => void;
    clipUrl: string;
    clearTimestamps: () => void;
}

export interface TimestampModalProps { // Represents the props for the timestamp modal component
  isOpen: boolean;
  currentTime: number;
  onSave: (title: string, note: string) => void;
  onClose: () => void;
}

export interface SaveModalProps {
  isOpen: boolean;
  onSave: (title:string, data: CuratorData) => void;
  onClose: () => void;
  curatorData: CuratorData | null;
  isSaving: boolean;
}