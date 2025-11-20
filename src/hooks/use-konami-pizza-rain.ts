import { useEffect, useState } from "react";
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

export function useKonamiPizzaRain() {
    const [isRaining, setIsRaining] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        let index = 0;

        const handler = (event: KeyboardEvent) => {
            const key = event.key;
            const expected = KONAMI_SEQUENCE[index];

            if (key.toLowerCase() === expected.toLowerCase()) {
                index += 1;

                if (index === KONAMI_SEQUENCE.length) {
                    index = 0;
                    setIsRaining(true);

                    toast({
                        title: "🍕 PIZZA STORM ACTIVATED 🍕",
                        description: "Unlimited toppings from the sky!",
                        duration: 5000,
                    });

                    // Stop raining after 10 seconds
                    setTimeout(() => setIsRaining(false), 10000);
                }
            } else {
                index = 0;
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return isRaining;
}
