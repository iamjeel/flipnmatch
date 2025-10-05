import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Music, ChevronDown, ChevronUp } from 'lucide-react';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // widget open/close
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const chordProgressions = [
    [261.63, 329.63, 392.0], // C major
    [293.66, 369.99, 440.0], // D minor
    [246.94, 311.13, 369.99], // G major
    [220.0, 277.18, 329.63], // A minor
  ];

  useEffect(() => {
    const savedVolume = localStorage.getItem('musicVolume');
    const savedMuted = localStorage.getItem('musicMuted');

    if (savedVolume) setVolume(parseInt(savedVolume));
    if (savedMuted) setIsMuted(savedMuted === 'true');

    return () => stopAudio();
  }, []);

  useEffect(
    () => localStorage.setItem('musicVolume', volume.toString()),
    [volume]
  );
  useEffect(
    () => localStorage.setItem('musicMuted', isMuted.toString()),
    [isMuted]
  );

  const createAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      updateVolume();
    }
  };

  const playChord = (frequencies: number[], duration: number = 2) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch {}
    });
    oscillatorsRef.current = [];

    frequencies.forEach((freq) => {
      const oscillator = ctx.createOscillator();
      const oscGain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now);
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.1 / frequencies.length, now + 0.5);
      oscGain.gain.setValueAtTime(
        0.1 / frequencies.length,
        now + duration - 0.5
      );
      oscGain.gain.linearRampToValueAtTime(0, now + duration);

      oscillator.connect(oscGain);
      oscGain.connect(gainNodeRef.current!);

      oscillator.start(now);
      oscillator.stop(now + duration);

      oscillatorsRef.current.push(oscillator);
    });
  };

  const startAudio = () => {
    createAudioContext();
    let chordIndex = 0;

    const playNextChord = () => {
      playChord(chordProgressions[chordIndex]);
      chordIndex = (chordIndex + 1) % chordProgressions.length;
    };

    playNextChord();
    intervalRef.current = setInterval(playNextChord, 3000);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;

    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch {}
    });
    oscillatorsRef.current = [];

    setIsPlaying(false);
  };

  const togglePlay = () => (isPlaying ? stopAudio() : startAudio());
  const updateVolume = () => {
    if (gainNodeRef.current) {
      const actualVolume = isMuted ? 0 : volume / 100;
      gainNodeRef.current.gain.setValueAtTime(
        actualVolume,
        audioContextRef.current!.currentTime
      );
    }
  };
  useEffect(() => updateVolume(), [volume, isMuted]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {/* Widget Button */}
      <div
        className="flex items-center justify-center w-14 h-14 rounded-full bg-card/90 backdrop-blur-sm border-2 border-primary/20 shadow-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Music className="w-6 h-6 text-primary" />
      </div>

      {/* Expanded Player */}
      <div
        className={`mt-2 w-56 bg-card/95 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-primary/20 overflow-hidden transform transition-all duration-300 origin-top-right ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" /> Ambient Music
            </span>
            {isPlaying && (
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={togglePlay}
              size="sm"
              variant={isPlaying ? 'default' : 'outline'}
              className="flex-1"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              onClick={() => setIsMuted(!isMuted)}
              size="sm"
              variant="ghost"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <VolumeX className="w-3 h-3 text-muted-foreground" />
            <Slider
              value={[volume]}
              onValueChange={(values) => setVolume(values[0])}
              max={100}
              step={1}
              className="flex-1"
              disabled={isMuted}
            />
            <Volume2 className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
