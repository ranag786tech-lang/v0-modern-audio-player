'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat2, Shuffle } from 'lucide-react';
import { WaveformVisualization } from './waveform-visualization';
import { TrackList, Track } from './track-list';
import { ThemeToggle } from './theme-toggle';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

const mockTracks: Track[] = [
  {
    id: 1,
    title: 'Midnight Echoes',
    artist: 'Luna Dreams',
    duration: 243,
    cover: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 2,
    title: 'Neon Nights',
    artist: 'Cyber Waves',
    duration: 198,
    cover: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 3,
    title: 'Ocean Waves',
    artist: 'Coastal Vibes',
    duration: 267,
    cover: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    id: 4,
    title: 'Sunset Paradise',
    artist: 'Golden Hour',
    duration: 212,
    cover: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    id: 5,
    title: 'Electric Dreams',
    artist: 'Synth Masters',
    duration: 220,
    cover: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  },
  {
    id: 6,
    title: 'Starlight Symphony',
    artist: 'Cosmic Sound',
    duration: 289,
    cover: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
];

type RepeatMode = 'off' | 'all' | 'one';

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(mockTracks[0].duration);
  const [volume, setVolume] = useState(100);
  const [speed, setSpeed] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = mockTracks[currentTrackIndex];

  // Check dark mode on mount and when it changes
  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof document !== 'undefined') {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
      }
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Update track duration when current track changes
  useEffect(() => {
    setTrackDuration(currentTrack.duration);
    setCurrentTime(0);
  }, [currentTrackIndex, currentTrack]);

  const progress = trackDuration > 0 ? currentTime / trackDuration : 0;

  // Handler functions
  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleNext = useCallback(() => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * mockTracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % mockTracks.length);
    }
    setCurrentTime(0);
  }, [shuffle]);

  const handlePrevious = useCallback(() => {
    if (currentTime > 3) {
      setCurrentTime(0);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + mockTracks.length) % mockTracks.length);
      setCurrentTime(0);
    }
  }, [currentTime]);

  const handleShuffle = useCallback(() => {
    setShuffle(!shuffle);
  }, [shuffle]);

  const handleRepeat = useCallback(() => {
    setRepeat((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const handleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  }, []);

  const handleVolumeUp = useCallback(() => {
    setVolume((prev) => Math.min(prev + 5, 100));
    setIsMuted(false);
  }, []);

  const handleVolumeDown = useCallback(() => {
    setVolume((prev) => Math.max(prev - 5, 0));
  }, []);

  const handleTrackSelect = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
  }, []);

  // Update progress bar color
  const progressPercent = progress * 100;
  const progressBg = isDarkMode ? '#2a2a2a' : '#e5e7eb';

  // Register keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: handlePlayPause,
    onNext: handleNext,
    onPrevious: handlePrevious,
    onVolumeUp: handleVolumeUp,
    onVolumeDown: handleVolumeDown,
    onMute: handleMute,
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-[#0a0a0a] theme-transition">
      <audio ref={audioRef} />

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-2xl">
        {/* Album Art */}
        <div className="w-full aspect-square rounded-2xl mb-8 shadow-2xl overflow-hidden">
          <div
            style={{ backgroundImage: currentTrack.cover }}
            className="w-full h-full flex items-center justify-center text-white text-4xl font-bold"
          >
            {currentTrack.title}
          </div>
        </div>

        {/* Waveform */}
        <WaveformVisualization progress={progress} isPlaying={isPlaying} />

        {/* Track Info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-balance">
            {currentTrack.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">{currentTrack.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={trackDuration}
            value={currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-gradient"
            style={{
              background: `linear-gradient(to right, var(--player-accent) 0%, var(--player-accent) ${progressPercent}%, ${progressBg} ${progressPercent}%, ${progressBg} 100%)`,
            }}
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(trackDuration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={handlePrevious}
            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            aria-label="Previous track"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={handlePlayPause}
            className="p-4 rounded-full bg-gradient-to-r from-[var(--player-accent)] to-[var(--player-accent-2)] text-white hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>

          <button
            onClick={handleNext}
            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            aria-label="Next track"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={handleShuffle}
              className={`p-2 rounded-lg transition-all duration-200 ${
                shuffle
                  ? 'bg-gradient-to-r from-[var(--player-accent)] to-[var(--player-accent-2)] text-white'
                  : 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              aria-label="Toggle shuffle"
              title="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={handleRepeat}
              className={`p-2 rounded-lg transition-all duration-200 relative ${
                repeat !== 'off'
                  ? 'bg-gradient-to-r from-[var(--player-accent)] to-[var(--player-accent-2)] text-white'
                  : 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              aria-label="Toggle repeat"
              title="Repeat"
            >
              <Repeat2 className="w-5 h-5" />
              {repeat !== 'off' && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {repeat === 'one' ? '1' : 'A'}
                </span>
              )}
            </button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-[#2a2a2a] rounded-lg px-4 py-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-fit">Speed:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="bg-transparent text-gray-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
              aria-label="Playback speed"
            >
              {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((s) => (
                <option key={s} value={s}>
                  {s}x
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-4 mb-8 bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-lg">
          <button
            onClick={handleMute}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2a2a2a] transition-colors text-gray-700 dark:text-gray-300 flex-shrink-0"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 dark:bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--player-accent) 0%, var(--player-accent) ${isMuted ? 0 : volume}%, ${progressBg} ${isMuted ? 0 : volume}%, ${progressBg} 100%)`,
            }}
            aria-label="Volume"
          />

          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-fit">
            {isMuted ? '0' : volume}%
          </span>
        </div>

        {/* Playlist */}
        <TrackList
          tracks={mockTracks}
          currentTrackIndex={currentTrackIndex}
          onSelectTrack={handleTrackSelect}
        />

        {/* Keyboard Shortcuts Help */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
          <p className="mb-2">Keyboard Shortcuts:</p>
          <p>Space = Play/Pause | ← → = Previous/Next | M = Mute | +/- = Volume</p>
        </div>
      </div>
    </div>
  );
}
