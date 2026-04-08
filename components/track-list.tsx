'use client';

import { Music } from 'lucide-react';

export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  cover: string;
}

interface TrackListProps {
  tracks: Track[];
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
}

export function TrackList({ tracks, currentTrackIndex, onSelectTrack }: TrackListProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full bg-white dark:bg-[#1a1a1a] rounded-lg p-4 mt-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Playlist</h2>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {tracks.map((track, index) => (
          <button
            key={track.id}
            onClick={() => onSelectTrack(index)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
              ${
                index === currentTrackIndex
                  ? 'bg-gradient-to-r from-[var(--player-accent)] to-[var(--player-accent-2)] text-white'
                  : 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-[#3a3a3a]'
              }`}
          >
            <div className="flex-shrink-0">
              {index === currentTrackIndex ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <Music className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center text-gray-400 dark:text-gray-600">
                  {index + 1}
                </div>
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium truncate">{track.title}</div>
              <div className="text-sm opacity-75 truncate">{track.artist}</div>
            </div>
            <div className="text-sm flex-shrink-0 opacity-75">{formatDuration(track.duration)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
