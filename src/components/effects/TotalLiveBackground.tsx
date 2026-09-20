"use client";
import { useEffect, useRef } from "react";

export default function TotalLiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Realistic Delicate Monsoon Rain (NO LINES, NO CIRCLES, NO ARTIFACTS)
    interface Raindrop {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      width: number;
    }

    const DROP_COUNT = 240;
    const drops: Raindrop[] = [];

    for (let i = 0; i < DROP_COUNT; i++) {
      const isForeground = Math.random() > 0.7;
      drops.push({
        x: Math.random() * (width + 350) - 150,
        y: Math.random() * height,
        length: isForeground ? 24 + Math.random() * 20 : 12 + Math.random() * 14,
        speed: isForeground ? 20 + Math.random() * 10 : 13 + Math.random() * 6,
        opacity: isForeground ? 0.25 + Math.random() * 0.15 : 0.08 + Math.random() * 0.1,
        width: isForeground ? 0.75 : 0.45,
      });
    }

    const slant = 0.22; // Natural monsoon wind angle

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render ONLY fine, smooth raindrops (ZERO geometric lines, ZERO fake circles)
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        ctx.beginPath();
        ctx.strokeStyle = `rgba(220, 235, 255, ${d.opacity})`;
        ctx.lineWidth = d.width;
        ctx.lineCap = "round";

        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.length * slant, d.y + d.length);
        ctx.stroke();

        d.x += d.speed * slant;
        d.y += d.speed;

        if (d.y > height) {
          d.y = -d.length;
          d.x = Math.random() * (width + 350) - 150;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-black">
      
      {/* 1. ACTUAL 1080P SEAMLESS VIDEO LOOP */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "contrast(1.06) brightness(1.02) saturate(1.04)" }}
      >
        <source src="/hero_loop.mp4" type="video/mp4" />
      </video>

      {/* 2. SOFT DRIFTING RIVER MIST (NO LINES, PURE SOFT FOG) */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 40%, black 50%, black 100%)",
          maskImage: "linear-gradient(to bottom, transparent 40%, black 50%, black 100%)",
        }}
      >
        <div 
          className="absolute inset-0 opacity-30 mix-blend-screen animate-river-mist"
          style={{
            background: "radial-gradient(ellipse 90% 25% at 50% 65%, rgba(190, 225, 245, 0.35) 0%, transparent 75%)",
          }}
        />
      </div>

      {/* 3. WARM LIVING PULSE: GAS LANTERNS & FERRY CABIN */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-color-dodge animate-warm-flicker"
        style={{
          background: "radial-gradient(circle at 37% 44%, rgba(240, 170, 70, 0.12) 0%, transparent 28%), radial-gradient(circle at 82% 52%, rgba(245, 190, 80, 0.10) 0%, transparent 35%)",
        }}
      />

      {/* 4. REAL-TIME SMOOTH 60FPS MONSOON RAIN (PURE RAIN ONLY) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      />

      {/* 5. CINEMATIC DIRECTIONAL SHADOW (PROTECTS LEFT TEXT) */}
      <div className="absolute inset-y-0 left-0 w-[55%] z-20 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-28 z-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 z-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      {/* EMBEDDED CLEAN ANIMATIONS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scene-breath {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.02) translate(-0.3%, -0.2%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .animate-scene-breath {
          animation: scene-breath 22s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes river-mist {
          0% { transform: translateX(0px) scale(1); opacity: 0.25; }
          50% { transform: translateX(-35px) scale(1.03); opacity: 0.40; }
          100% { transform: translateX(0px) scale(1); opacity: 0.25; }
        }
        .animate-river-mist {
          animation: river-mist 16s ease-in-out infinite;
        }

        @keyframes warm-flicker {
          0%, 100% { opacity: 0.6; }
          25% { opacity: 0.85; }
          50% { opacity: 0.7; }
          75% { opacity: 0.95; }
        }
        .animate-warm-flicker {
          animation: warm-flicker 3.5s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
