'use client';

interface WaveformVisualizationProps {
  progress: number; // 0 to 1
  isPlaying: boolean;
}

export function WaveformVisualization({ progress, isPlaying }: WaveformVisualizationProps) {
  const barCount = 40;
  const bars = Array.from({ length: barCount }, (_, i) => i);

  const getBarHeight = (index: number) => {
    if (!isPlaying) return 20;

    const distanceFromProgress = Math.abs((index / barCount) - progress);
    const maxDistance = 0.3;
    const normalizedDistance = Math.min(distanceFromProgress, maxDistance) / maxDistance;
    const height = 20 + (50 * (1 - normalizedDistance));

    return Math.max(20, height);
  };

  return (
    <div className="flex items-center justify-center gap-1 h-20 mb-8">
      {bars.map((i) => (
        <div
          key={i}
          className="flex-1 bg-gradient-to-t from-[var(--player-accent)] to-[var(--player-accent-2)]
            rounded-full transition-all duration-75 ease-out opacity-80 hover:opacity-100"
          style={{
            height: `${getBarHeight(i)}%`,
            minWidth: '2px',
          }}
        />
      ))}
    </div>
  );
}
