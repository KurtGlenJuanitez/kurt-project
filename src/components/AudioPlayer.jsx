import { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const NORMAL_VOLUME = 1;
const DUCKED_VOLUME = 0.15;
const FADE_STEP = 0.05;
const FADE_INTERVAL_MS = 30;

const AudioPlayer = () => {
  const { isMusicPlaying, hasMusicInteraction, isVideoPlaying } = useApp();
  const audioRef = useRef(null);
  const fadeRef = useRef(null);

  useEffect(() => {
    // Only attempt to play after any landing-page interaction (browser autoplay policy).
    if (hasMusicInteraction && isMusicPlaying && audioRef.current) {
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {})
          .catch(error => {
            console.log("Audio play failed:", error);
          });
      }
    } else if (!isMusicPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isMusicPlaying, hasMusicInteraction]);

  // Smoothly fade volume when a video plays/pauses
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const target = isVideoPlaying ? DUCKED_VOLUME : NORMAL_VOLUME;

    if (fadeRef.current) clearInterval(fadeRef.current);

    fadeRef.current = setInterval(() => {
      const diff = target - audio.volume;
      if (Math.abs(diff) < FADE_STEP) {
        audio.volume = target;
        clearInterval(fadeRef.current);
        fadeRef.current = null;
      } else {
        audio.volume += diff > 0 ? FADE_STEP : -FADE_STEP;
      }
    }, FADE_INTERVAL_MS);

    return () => {
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, [isVideoPlaying]);

  // Reset when experience is reset
  useEffect(() => {
    if (!hasMusicInteraction) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [hasMusicInteraction]);

  return (
    <audio
      ref={audioRef}
      src={`${import.meta.env.BASE_URL}music.mp3`}
      loop
      preload="auto"
    />
  );
};

export default AudioPlayer;
