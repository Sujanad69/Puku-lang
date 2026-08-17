import React from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

interface ConfettiEffectProps {
  active: boolean;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ active }) => {
  const { width, height } = useWindowSize();
  
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={300}
        gravity={0.15}
        initialVelocityY={20}
        colors={['#2563eb', '#FBBF24', '#EF4444', '#10B981', '#8B5CF6']}
      />
    </div>
  );
};
