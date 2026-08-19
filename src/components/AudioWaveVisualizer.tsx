import React from 'react';

interface AudioWaveVisualizerProps {
  isPlaying: boolean;
  color?: 'blue' | 'rose' | 'green' | 'amber' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  barsCount?: 3 | 5 | 7;
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({
  isPlaying,
  color = 'blue',
  size = 'md',
  className = '',
  barsCount = 5,
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'rose':
        return 'bg-gradient-to-t from-rose-500 to-pink-400 shadow-rose-500/50';
      case 'green':
        return 'bg-gradient-to-t from-emerald-500 to-green-400 shadow-emerald-500/50';
      case 'amber':
        return 'bg-gradient-to-t from-amber-500 to-yellow-300 shadow-amber-500/50';
      case 'white':
        return 'bg-white shadow-white/50';
      case 'blue':
      default:
        return 'bg-gradient-to-t from-blue-600 to-cyan-400 shadow-blue-500/50';
    }
  };

  const getContainerDimensions = () => {
    switch (size) {
      case 'xs':
        return 'h-3.5 gap-[2px]';
      case 'sm':
        return 'h-5 gap-[2.5px]';
      case 'lg':
        return 'h-9 gap-[4px]';
      case 'md':
      default:
        return 'h-7 gap-[3px]';
    }
  };

  const getBarWidth = () => {
    switch (size) {
      case 'xs':
        return 'w-[2px] rounded-full';
      case 'sm':
        return 'w-[2.5px] rounded-full';
      case 'lg':
        return 'w-[4px] rounded-full';
      case 'md':
      default:
        return 'w-[3px] rounded-full';
    }
  };

  const barClasses = ['audio-bar-1', 'audio-bar-2', 'audio-bar-3', 'audio-bar-4', 'audio-bar-5', 'audio-bar-2', 'audio-bar-1'];
  const idleHeights = ['30%', '55%', '80%', '45%', '25%', '60%', '35%'];

  const bars = Array.from({ length: barsCount });

  return (
    <div className={`inline-flex items-center justify-center ${getContainerDimensions()} ${className} select-none pointer-events-none`}>
      {bars.map((_, index) => {
        const animClass = isPlaying ? barClasses[index % barClasses.length] : '';
        const idleHeight = idleHeights[index % idleHeights.length];

        return (
          <div
            key={index}
            style={{
              height: isPlaying ? undefined : idleHeight,
              transformOrigin: 'bottom center',
              transition: isPlaying ? 'none' : 'height 0.3s ease-out, transform 0.3s ease-out',
            }}
            className={`${getBarWidth()} ${getColorClass()} ${animClass} shrink-0 transition-opacity duration-300 ${
              isPlaying ? 'opacity-100 shadow-xs scale-100' : 'opacity-40 scale-95'
            }`}
          />
        );
      })}
    </div>
  );
};
