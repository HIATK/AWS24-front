// src/components/RainEffect/RainEffect.tsx
import React, { useEffect, useRef } from 'react';
import styles from './RainEffect.module.css';

const RainEffect: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let raindrops: { x: number; y: number; speed: number; length: number }[] = [];

        const createRaindrop = () => {
            return {
                x: Math.random() * canvas.width,
                y: 0,
                speed: 5 + Math.random() * 5,
                length: 10 + Math.random() * 20
            };
        };

        for (let i = 0; i < 100; i++) {
            raindrops.push(createRaindrop());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = 1;

            raindrops.forEach((drop) => {
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x, drop.y + drop.length);
                ctx.stroke();

                drop.y += drop.speed;

                if (drop.y > canvas.height) {
                    Object.assign(drop, createRaindrop());
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.rainCanvas} />;
};

export default RainEffect;