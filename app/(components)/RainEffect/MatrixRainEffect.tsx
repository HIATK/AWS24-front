'use client';

import React, { useEffect, useRef } from 'react';
import styles from './MatrixRainEffect.module.css';
import { useTheme } from "@/(components)/DarkModToggle/ThemeContext";

interface MatrixRainEffectProps {
    speed?: number; // 1 (느림) 에서 10 (빠름) 사이의 값
}

const MatrixRainEffect: React.FC<MatrixRainEffectProps> = ({ speed = 5 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const setupCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const columns = Math.floor(canvas.width / 20);
            const drops: number[] = [];

            for (let i = 0; i < columns; i++) {
                drops[i] = 1;
            }

            return { columns, drops };
        };

        let { columns, drops } = setupCanvas();

        const drawMatrix = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(66,209,27,0.46)';
            ctx.font = '15px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = String.fromCharCode(Math.random() * 128);
                ctx.fillText(text, i * 20, drops[i] * 20);

                if (drops[i] * 10 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i] += speed / 3; // 속도 조절
            }
        };

        const animate = () => {
            if (theme === 'dark') {
                drawMatrix();
                animationFrameId = requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        const handleResize = () => {
            ({ columns, drops } = setupCanvas());
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme, speed]);

    if (theme !== 'dark') {
        return null;
    }

    return <canvas ref={canvasRef} className={styles.matrixCanvas} />;
};

export default MatrixRainEffect;