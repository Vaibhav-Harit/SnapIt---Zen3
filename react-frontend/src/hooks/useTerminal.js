import { useState, useEffect } from 'react';

export const useTerminal = (messages) => {
  const [displayText, setDisplayText] = useState('');
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pauseTimer, setPauseTimer] = useState(0);

  useEffect(() => {
    const type = () => {
      const currentMsg = messages[msgIndex];

      if (!isDeleting) {
        setDisplayText(currentMsg.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);

        if (charIndex === currentMsg.length) {
          setPauseTimer(60); // pause before deleting
          setIsDeleting(true);
        }
      } else {
        if (pauseTimer > 0) {
          setPauseTimer((prev) => prev - 1);
          return;
        }

        setDisplayText(currentMsg.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);

        if (charIndex === 0) {
          setIsDeleting(false);
          setMsgIndex((prev) => (prev + 1) % messages.length);
        }
      }
    };

    const speed = isDeleting ? 30 : 60;
    const timeout = setTimeout(() => {
      requestAnimationFrame(type);
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, messages, msgIndex, pauseTimer]);

  return displayText;
};
