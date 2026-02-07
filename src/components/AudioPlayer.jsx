import { useRef, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const AudioPlayer = () => {
  const { isMusicPlaying, hasAcceptedDate } = useApp();
  const audioRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Only attempt to play after user has clicked "Yes" (user interaction)
    if (hasAcceptedDate && isMusicPlaying && audioRef.current) {
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setHasStarted(true);
          })
          .catch(error => {
            console.log("Audio play failed:", error);
          });
      }
    } else if (!isMusicPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isMusicPlaying, hasAcceptedDate]);

  // Reset when experience is reset
  useEffect(() => {
    if (!hasAcceptedDate) {
      setHasStarted(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [hasAcceptedDate]);

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
