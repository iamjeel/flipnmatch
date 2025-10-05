import React, { useState, useEffect, useCallback } from 'react';
import GameCard from '@/components/GameCard';
import AudioPlayer from '@/components/AudioPlayer';
import Confetti from '@/components/Confetti';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Sparkles, RotateCcw, Trophy, Timer, Award } from 'lucide-react';

const LOREM_PICSUM_URL = 'https://picsum.photos/200/300';

interface Card {
  id: number;
  src: string;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_PAIRS = {
  easy: 6,
  medium: 9,
  hard: 12,
};

const Index = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matchedCards, setMatchedCards] = useState<string[]>([]);
  const [shakingCards, setShakingCards] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [level, setLevel] = useState(1);
  const [moves, setMoves] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highScores, setHighScores] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  const { playFlip, playMatch, playWrong, playCelebration } = useSoundEffects();

  // Load high scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem('highScores');
    if (savedScores) setHighScores(JSON.parse(savedScores));
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Fetch placeholder images whenever level or difficulty changes
  useEffect(() => {
    fetchImages();
  }, [level, difficulty]);

const fetchImages = async () => {
  setIsLoading(true);
  setIsTimerRunning(false);
  setTimer(0);

  try {
    const pairCount = DIFFICULTY_PAIRS[difficulty];

    // Generate unique placeholder images
    const images: Card[] = Array.from({ length: pairCount }, (_, i) => ({
      id: i,
      src: `${LOREM_PICSUM_URL}?random=${i + level * 100}`, // unique per pair
    }));

    // Duplicate for pairs
    const shuffledCards: Card[] = [...images, ...images]
      .map((img, index) => ({ id: index, src: img.src })) // duplicate preserves same src
      .sort(() => Math.random() - 0.5); // shuffle the deck

    setCards(shuffledCards);
    setMatchedCards([]);
    setFlippedCards([]);
    setShakingCards([]);
    setMoves(0);
    setIsTimerRunning(true);
  } catch (error) {
    console.error('Error generating images:', error);
    toast({
      title: 'Error Loading Images',
      description: 'Failed to load placeholder images.',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};


  const handleCardClick = useCallback(
    (card: Card) => {
      if (
        flippedCards.length === 2 ||
        matchedCards.includes(card.src) ||
        flippedCards.some((c) => c.id === card.id)
      )
        return;

      playFlip();
      const newFlippedCards = [...flippedCards, card];
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        setMoves((prev) => prev + 1);
        const [firstCard, secondCard] = newFlippedCards;

        if (firstCard.src === secondCard.src) {
          playMatch();
          setMatchedCards((prev) => [...prev, firstCard.src]);
          setFlippedCards([]);

          if (matchedCards.length + 1 === cards.length / 2) {
            setIsTimerRunning(false);
            playCelebration();
            setShowConfetti(true);

            const score = moves + 1 + timer;
            const currentBest = highScores[difficulty];

            if (currentBest === 0 || score < currentBest) {
              const newScores = { ...highScores, [difficulty]: score };
              setHighScores(newScores);
              localStorage.setItem('highScores', JSON.stringify(newScores));
            }

            setTimeout(() => {
              toast({
                title: '🎉 Level Complete!',
                description: `You completed level ${level} in ${
                  moves + 1
                } moves and ${timer}s!`,
              });
              setLevel((prev) => prev + 1);
            }, 500);
          }
        } else {
          playWrong();
          setShakingCards([firstCard.id, secondCard.id]);
          setTimeout(() => {
            setFlippedCards([]);
            setShakingCards([]);
          }, 1000);
        }
      }
    },
    [
      flippedCards,
      matchedCards,
      cards.length,
      level,
      moves,
      timer,
      difficulty,
      highScores,
      playFlip,
      playMatch,
      playWrong,
      playCelebration,
    ]
  );

  const handleRefresh = () => {
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
    setShakingCards([]);
    setMoves(0);
    setTimer(0);
    setIsTimerRunning(false);
    fetchImages();
  };

  const handleRestart = () => {
    setLevel(1);
    setMoves(0);
    setTimer(0);
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
    setShakingCards([]);
    setIsTimerRunning(false);
    fetchImages();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div className="max-w-6xl w-full">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Flip & Match
          </h1>
          <p className="text-muted-foreground text-lg">
            Test your memory skills!
          </p>
        </header>

        {/* Difficulty Selector */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3 bg-card px-4 py-3 rounded-full shadow-md">
            <span className="font-semibold text-sm">Difficulty:</span>
            <Select
              value={difficulty}
              onValueChange={(value: Difficulty) => {
                setDifficulty(value);
                setLevel(1);
              }}
            >
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy (6)</SelectItem>
                <SelectItem value="medium">Medium (8)</SelectItem>
                <SelectItem value="hard">Hard (12)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <AudioPlayer />

        {/* Game Stats */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-md">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="font-semibold">Level {level}</span>
          </div>
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-md">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-semibold">Moves: {moves}</span>
          </div>
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-md">
            <Timer className="w-5 h-5 text-secondary" />
            <span className="font-semibold">{formatTime(timer)}</span>
          </div>
          {highScores[difficulty] > 0 && (
            <div className="flex items-center gap-2 bg-success/20 px-4 py-2 rounded-full shadow-md">
              <Award className="w-5 h-5 text-success" />
              <span className="font-semibold text-sm">
                Best: {highScores[difficulty]}
              </span>
            </div>
          )}
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" /> New Images
          </Button>
          <Button onClick={handleRestart} variant="secondary" size="sm">
            Restart Game
          </Button>
        </div>

        {/* Game Board */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Loading cards...</p>
            </div>
          </div>
        ) : (
          <div
            className={`grid gap-3 sm:gap-4 mb-8 animate-fade-in ${
              difficulty === 'easy'
                ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6'
                : difficulty === 'medium'
                ? 'grid-cols-4 lg:grid-cols-6'
                : 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8'
            } justify-center`}
          >
            {cards.map((card) => (
              <GameCard
                key={card.id}
                image={card}
                isFlipped={
                  flippedCards.some((c) => c.id === card.id) ||
                  matchedCards.includes(card.src)
                }
                isMatched={matchedCards.includes(card.src)}
                isShaking={shakingCards.includes(card.id)}
                onClick={() => handleCardClick(card)}
                className="aspect-square w-full sm:w-auto lg:w-20"
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground mt-8 space-y-2">
          <p>&copy; Jeel Thumar 2024</p>
          <a
            href="https://buymeacoffee.com/iamjeel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:text-primary transition-colors underline"
          >
            Buy us a Coffee if you enjoyed the game! ☕
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Index;
