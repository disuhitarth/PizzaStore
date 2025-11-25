import { useEffect, useState } from "react";

// Simple, non-breaking placeholder implementation for the Konami flame easter egg.
// When the classic Konami code is entered, we briefly toggle a CSS class on <body>.
// You can enhance this later with fancier visuals if desired.

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

const FLAME_CLASS = "konami-flame-mode";
const FLAME_DURATION_MS = 4000;

export function useKonamiFlameMode() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let buffer: string[] = [];
    let timeoutId: number | undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      buffer.push(event.key);
      if (buffer.length > KONAMI_SEQUENCE.length) {
        buffer.shift();
      }

      const isMatch = KONAMI_SEQUENCE.every((key, index) => buffer[index] === key);

      if (isMatch) {
        setEnabled(true);

        if (typeof document !== "undefined") {
          document.body.classList.add(FLAME_CLASS);
        }

        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }

        timeoutId = window.setTimeout(() => {
          setEnabled(false);
          if (typeof document !== "undefined") {
            document.body.classList.remove(FLAME_CLASS);
          }
        }, FLAME_DURATION_MS);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      if (typeof document !== "undefined") {
        document.body.classList.remove(FLAME_CLASS);
      }
    };
  }, []);

  return { enabled };
}
