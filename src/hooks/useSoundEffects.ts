import { useRef, useCallback } from 'react';

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playFlip = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }, [getAudioContext]);

  const playMatch = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(freq, now + i * 0.1);
      gainNode.gain.setValueAtTime(0.15, now + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
      
      oscillator.start(now + i * 0.1);
      oscillator.stop(now + i * 0.1 + 0.3);
    });
  }, [getAudioContext]);

  const playWrong = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  }, [getAudioContext]);

  const playCelebration = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const frequencies = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(freq, now + i * 0.08);
      gainNode.gain.setValueAtTime(0.12, now + i * 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.4);
      
      oscillator.start(now + i * 0.08);
      oscillator.stop(now + i * 0.08 + 0.4);
    });
  }, [getAudioContext]);

  return {
    playFlip,
    playMatch,
    playWrong,
    playCelebration,
  };
};
