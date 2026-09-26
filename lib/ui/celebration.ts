/**
 * Lightweight 60fps Canvas Confetti & Particle Celebration Engine.
 * Tailored to Donezo brand colors (#154D38, #10B981, #F59E0B, #34D399).
 * Zero external npm dependencies.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  opacity: number;
  shape: "rect" | "circle";
}

const DONEZO_PALETTE = [
  "#154D38", // Deep Forest Green
  "#10B981", // Mint Green
  "#34D399", // Emerald Accent
  "#F59E0B", // Quest Gold
  "#047857", // Pine
  "#6EE7B7", // Light Mint
];

export function triggerCelebration(intensity: "small" | "medium" | "grand" = "medium") {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Respect prefers-reduced-motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const count = intensity === "grand" ? 140 : intensity === "medium" ? 80 : 40;
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const originX = width * (0.3 + Math.random() * 0.4);
    const originY = height * 0.4;
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 8 + 4) * (intensity === "grand" ? 1.4 : 1);

    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5, // initial upward kick
      size: Math.random() * 7 + 4,
      color: DONEZO_PALETTE[Math.floor(Math.random() * DONEZO_PALETTE.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: Math.random() > 0.4 ? "rect" : "circle",
    });
  }

  let animationFrameId: number;
  const startTime = Date.now();
  const maxDuration = intensity === "grand" ? 3200 : 2400;

  function render() {
    const elapsed = Date.now() - startTime;
    if (elapsed > maxDuration || !ctx) {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.985; // air drag
      p.rotation += p.vRot;

      // Fade out towards the end
      if (elapsed > maxDuration - 800) {
        p.opacity = Math.max(0, 1 - (elapsed - (maxDuration - 800)) / 800);
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  animationFrameId = requestAnimationFrame(render);
}
