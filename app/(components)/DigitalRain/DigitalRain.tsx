import React, { useEffect, useRef } from 'react';

interface Color {
    red: number;
    green: number;
    blue: number;
}

interface MatrixRainProps {
    width: number;
    height: number;
    charList: string[];
    red: number;
    green: number;
    blue: number;
    randomColors: boolean;
    flowRate: number;
    fps: number;
}

function random(min: number = 0, max: number = 1): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function colorToText(r: number, g: number, b: number, a: number = 1): string {
    return `rgba(${r},${g},${b},${a})`;
}

abstract class Entity {
    protected pos: { x: number; y: number };
    protected ctx: CanvasRenderingContext2D;

    constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
        this.pos = { x, y };
        this.ctx = ctx;
    }

    getPosition(): { x: number; y: number } {
        return this.pos;
    }

    abstract show(): boolean;

    protected abstract update(): boolean;

    protected abstract draw(): void;

    protected static showAll(list: Entity[]): void {
        for (let i = list.length - 1; i >= 0; i--) {
            if (!list[i].show()) {
                list.splice(i, 1);
            }
        }
    }
}

class Strand extends Entity {
    private canvas: HTMLCanvasElement;
    private charList: string[];
    private color: Color;
    private chars: Char[];

    constructor(x: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, charList: string[], color: Color) {
        super(x, Char.height, ctx);
        this.canvas = canvas;
        this.charList = charList;
        this.color = color;
        this.chars = [];
    }

    show(): boolean {
        this.update();
        this.draw();
        return true;
    }

    update(): boolean {
        if (this.chars.length < 1 || this.chars[this.chars.length - 1].getPosition().y < this.canvas.height * 2) {
            this.chars.push(new Char(this.pos.x, this.pos.y, this.ctx, this.charList, this.color));
            this.pos.y += Char.height;
            return true;
        } else {
            return false;
        }
    }

    draw(): void {
        Entity.showAll(this.chars);
    }
}

class Char extends Entity {
    static size = 20;
    static width = 12;
    static height = 14;

    private charList: string[];
    private color: Color;
    private head: boolean;
    private alpha: number;
    private val: string;

    constructor(x: number, y: number, ctx: CanvasRenderingContext2D, charList: string[], color: Color) {
        super(x, y, ctx);
        this.charList = charList;
        this.color = color;
        this.head = true;
        this.alpha = 1;
        this.val = this.randomizeCharVal();
    }

    private randomizeCharVal(): string {
        return this.charList[random(0, this.charList.length - 1)];
    }

    show(): boolean {
        return this.update() && this.draw();
    }

    update(): boolean {
        if (random(0, 100) < 5) {
            this.val = this.randomizeCharVal();
        }
        this.alpha *= 0.95;
        return this.alpha >= 0.01;
    }

    draw(): boolean {
        this.ctx.font = Char.size + "px Monospace";
        if (!this.head) {
            this.ctx.fillStyle = colorToText(this.color.red, this.color.green, this.color.blue, this.alpha);
        } else {
            this.ctx.fillStyle = colorToText(255, 255, 255, 1);
            this.head = false;
        }
        this.ctx.fillText(this.val, this.pos.x, this.pos.y);
        return true;
    }
}

const MatrixRainComponent: React.FC<MatrixRainProps> = ({
                                                            width,
                                                            height,
                                                            charList,
                                                            red,
                                                            green,
                                                            blue,
                                                            randomColors,
                                                            flowRate,
                                                            fps
                                                        }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 여기에 MatrixRain 클래스를 초기화하세요
        // const matrixRain = new MatrixRain(canvas, width, height, charList, red, green, blue, randomColors, flowRate, fps);
        // matrixRain.start();

        return () => {
            // 정리 코드
            // matrixRain.stop();
        };
    }, [width, height, charList, red, green, blue, randomColors, flowRate, fps]);

    return <canvas ref={canvasRef} width={width} height={height}></canvas>;
};

export default MatrixRainComponent;