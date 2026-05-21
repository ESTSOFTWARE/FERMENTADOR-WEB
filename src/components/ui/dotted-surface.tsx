'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
    particleColor?: string;
};

export function DottedSurface({ className, particleColor = '#ffffff', ...props }: DottedSurfaceProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const COLS = 22;
        const ROWS = 32;

        let animId: number;
        let count = 0;

        const resize = () => {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Parse hex color once
        const hex = particleColor.replace('#', '');
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        const draw = () => {
            animId = requestAnimationFrame(draw);
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            const colGap = w / (COLS + 1);
            const rowGap = h / (ROWS + 1);
            const amp = Math.min(rowGap * 0.45, 18);

            for (let ix = 0; ix < COLS; ix++) {
                for (let iy = 0; iy < ROWS; iy++) {
                    const wave =
                        Math.sin((ix + count) * 0.3) * amp +
                        Math.sin((iy + count) * 0.5) * amp;

                    const x = (ix + 1) * colGap;
                    const y = (iy + 1) * rowGap + wave;

                    // dots closer to wave peak = brighter + bigger
                    const t = wave / (amp * 2) + 0.5;
                    const alpha = 0.15 + t * 0.45;
                    const radius = 1.5 + t * 1.5;

                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
                    ctx.fill();
                }
            }

            count += 0.05;
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animId);
            if (container.contains(canvas)) container.removeChild(canvas);
        };
    }, [particleColor]);

    return (
        <div
            ref={containerRef}
            className={cn('pointer-events-none absolute inset-0', className)}
            {...props}
        />
    );
}
