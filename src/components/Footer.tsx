import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const navigate = useNavigate();
  const [clickTimestamps, setClickTimestamps] = useState<number[]>([]);

  const handleSecretClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const newTimestamps = [...clickTimestamps, now].filter(timestamp => now - timestamp < 1000); // Keep only clicks within 1 second

    setClickTimestamps(newTimestamps);

    if (newTimestamps.length >= 3) {
      navigate('/login');
      setClickTimestamps([]); // Reset after successful navigation
    }
  };

  return (
    <footer className="fixed bottom-4 left-6 z-50">
      <p
        className="text-white/30 text-xs select-none cursor-default"
        onClick={handleSecretClick}
      >
        © 2026 Már megint App
      </p>
    </footer>
  );
};