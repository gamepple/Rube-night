import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  speed: number;
  phase: number;
};

type NightSkyProps = {
  lit: boolean;
  dawn: boolean;
};

export function NightSky({ lit, dawn }: NightSkyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const surface = canvas;
    const brush = ctx;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let raf = 0;
    let running = true;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      surface.width = Math.floor(w * dpr);
      surface.height = Math.floor(h * dpr);
      surface.style.width = `${w}px`;
      surface.style.height = `${h}px`;
      brush.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 480 ? 70 : w < 900 ? 110 : 150;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.92,
        r: Math.random() < 0.12 ? 1.35 : Math.random() < 0.5 ? 0.9 : 0.55,
        base: 0.22 + Math.random() * 0.55,
        speed: 0.35 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function draw(t: number) {
      if (!running) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      brush.clearRect(0, 0, w, h);
      const dawnFade = dawn ? 0.18 : 1;
      for (const star of stars) {
        const twinkle = reduce ? 0 : Math.sin(t * 0.001 * star.speed + star.phase);
        const alpha = Math.max(0.08, star.base + twinkle * 0.28) * dawnFade;
        brush.beginPath();
        brush.fillStyle = `rgba(236, 234, 228, ${alpha})`;
        brush.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        brush.fill();
      }
      raf = window.requestAnimationFrame(draw);
    }

    resize();
    raf = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [dawn]);

  return (
    <div className="sky-root" aria-hidden="true">
      <div className={cn("sky-wash", dawn && "is-dawn")} />
      <canvas ref={canvasRef} className="sky-stars" />
      <div className={cn("moon", lit && "is-lit", dawn && "is-dawn")}>
        <span className="moon-crater moon-crater-a" />
        <span className="moon-crater moon-crater-b" />
        <span className="moon-crater moon-crater-c" />
      </div>
      <div className="sky-vignette" />
    </div>
  );
}
