import React, { useEffect, useRef, useState } from 'react';

interface PizzaParticle {
    x: number;
    y: number;
    speed: number;
    rotation: number;
    rotationSpeed: number;
    size: number;
    emoji: string;
}

const PIZZA_EMOJIS = ['🍕', '🍅', '🧀', '🌶️', '🍄'];

const PizzaRain: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: PizzaParticle[] = [];
        const particleCount = 150;

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * dimensions.width,
                y: Math.random() * -dimensions.height,
                speed: 3 + Math.random() * 7,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                size: 20 + Math.random() * 40,
                emoji: PIZZA_EMOJIS[Math.floor(Math.random() * PIZZA_EMOJIS.length)],
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            particles.forEach((p) => {
                p.y += p.speed;
                p.rotation += p.rotationSpeed;

                // Reset if below screen
                if (p.y > dimensions.height + 50) {
                    p.y = -50;
                    p.x = Math.random() * dimensions.width;
                    p.speed = 3 + Math.random() * 7;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.font = `${p.size}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.emoji, 0, 0);
                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions]);

    return (
        <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="fixed inset-0 z-[9999] pointer-events-none"
            style={{ pointerEvents: 'none' }}
        />
    );
};

export default PizzaRain;
