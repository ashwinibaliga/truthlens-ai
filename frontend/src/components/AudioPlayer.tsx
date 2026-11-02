import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, RotateCcw } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  file?: File;
  filename: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, file, filename }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [srcUrl, setSrcUrl] = useState<string>('');

  useEffect(() => {
    let url = audioUrl || '';
    if (file) {
      url = URL.createObjectURL(file);
      setSrcUrl(url);
    } else {
      setSrcUrl(url);
    }
    return () => {
      if (file && url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file, audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Generate 48 stylized waveform bars
  const waveHeights = [
    30, 45, 60, 40, 75, 90, 65, 80, 50, 40, 85, 95, 70, 85, 60, 40, 55, 75, 90,
    100, 85, 70, 60, 45, 65, 80, 95, 80, 65, 50, 40, 70, 85, 90, 75, 60, 45, 35,
    55, 75, 90, 85, 70, 50, 35, 45, 60, 30
  ];

  return (
    <div className="editorial-card p-5 rounded-2xl bg-white border border-stone-200">
      <audio
        ref={audioRef}
        src={srcUrl}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-wine" />
          <span className="text-xs font-medium text-charcoal truncate max-w-[240px]">
            {filename}
          </span>
        </div>
        <div className="text-[11px] font-mono text-charcoal-muted">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Dynamic Simulated Waveform */}
      <div className="flex items-end justify-between h-14 gap-1 px-2 py-1 bg-ivory-200/50 rounded-xl mb-4 overflow-hidden border border-stone-200/50">
        {waveHeights.map((h, i) => {
          const progress = duration > 0 ? currentTime / duration : 0;
          const barProgress = i / waveHeights.length;
          const isPassed = barProgress <= progress;

          return (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-150 ${
                isPassed ? 'bg-wine' : 'bg-rose-dusty/40'
              }`}
              style={{
                height: `${isPlaying ? Math.min(100, Math.max(20, h * (0.6 + Math.sin((currentTime * 8) + i) * 0.4))) : h}%`,
              }}
            />
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-wine text-white flex items-center justify-center hover:bg-wine-light transition shadow-md"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <button
          onClick={restart}
          className="w-8 h-8 rounded-full bg-stone-100 text-charcoal flex items-center justify-center hover:bg-stone-200 transition"
          aria-label="Restart audio"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 accent-wine cursor-pointer h-1.5 bg-stone-200 rounded-lg"
        />
      </div>
    </div>
  );
};

