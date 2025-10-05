import React from 'react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  image: {
    id: number;
    src: string;
  };
  isFlipped: boolean;
  isMatched: boolean;
  isShaking?: boolean;
  onClick: () => void;
}

const GameCard = React.memo(({ image, isFlipped, isMatched, isShaking, onClick }: GameCardProps) => {
  return (
    <div
      className={cn(
        "card-flip cursor-pointer aspect-square",
        isFlipped && "card-flipped",
        isMatched && "card-matched",
        isShaking && "card-shake"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label="Memory card"
    >
      <div className="card-inner">
        {/* Card Back */}
        <div className="card-face card-back bg-card-back flex items-center justify-center shadow-lg">
          <div className="text-7xl font-bold text-white">?</div>
        </div>
        
        {/* Card Front */}
        <div className="card-face card-front bg-card overflow-hidden shadow-xl border-4 border-border">
          <img 
            src={image.src} 
            alt="Memory card" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
});

GameCard.displayName = 'GameCard';

export default GameCard;
