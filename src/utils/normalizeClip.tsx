import { Clip } from "@/types/types";

export function normalizeClip(clip: any): Clip {
  return {
    id: clip.id,
    title: clip.title,
    clipUrl: clip.clip_url, // <-- map snake_case to camelCase
    timestamps: Array.isArray(clip.timestamps) ? clip.timestamps : [],
    created_at: clip.created_at,
    updated_at: clip.updated_at,
  };
}