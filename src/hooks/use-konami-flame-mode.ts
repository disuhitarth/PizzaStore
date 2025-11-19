import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

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

/**
 * Listens for the classic Konami code and briefly enables a fun "flame mode" effect.
 * Keeps all side effects client-side and no-ops in non-browser environments.
 */
export function useKonamiFlameMode() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let index = 0;
    let hasTriggeredInSession = false;

    const handler = (event: KeyboardEvent) => {
      const key = event.key;
      const expected = KONAMI_SEQUENCE[index];

      if (key.toLowerCase() === expected.toLowerCase()) {
        index += 1;

        if (index === KONAMI_SEQUENCE.length && !hasTriggeredInSession) {
          hasTriggeredInSession = true;
          index = 0;

          if (typeof document !== "undefined") {
            // Temporarily blast the whole app into a fiery "arcade" mode.
            document.body.classList.add("flame-mode");
            window.setTimeout(() => {
              document.body.classList.remove("flame-mode");
            }, 6000);
          }

          toast({
            title: "Secret menu discovered",
            description: "Flame mode: ON. The oven just went full arcade.",
          });

          // After the blaze, quietly sneak to the secret pineapple debate page.
          if (typeof window !== "undefined") {
            window.setTimeout(() => {
              if (window.location.pathname !== "/pineapple") {
                window.location.assign("/pineapple");
              }
            }, 1500);
          }
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);
}
