"use client";

import { useEffect, useRef } from "react";

/**
 * Hero background: "bridges".
 * A night sky of lone rings (every researcher who is working things out on their own). Every second or so a golden
 * arch, the Doc2Postdoc arch, builds between two of them. Both rings light up and smile, and the pair drifts on together.
 * Older pairs release again so the sky is never finished. Moving the pointer near a lone ring makes it "reach out".
 * Drawn on one canvas, paused when off-screen, and a still frame for people who prefer reduced motion.
 */

type Ring = { x: number; y: number; vx: number; vy: number; r: number; ph: number; pair: number; lit: number; hover: number };
type Pair = { a: number; b: number; draw: number; fade: number; ending: boolean; pinged: boolean };
type Ripple = { x: number; y: number; t: number };

const GOLD = "244,167,37";
const SKY = "157,180,232";
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);

export function HeroBridges() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let rings: Ring[] = [];
    let pairs: Pair[] = [];
    let ripples: Ripple[] = [];
    let nextMatch = 0.6;
    let t = 0;
    let last = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999, on: false };

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const maxPairs = () => Math.max(3, Math.floor(rings.length / 4.2));

    function build() {
      const count = Math.round(clamp((w * h) / 17000, 20, 64));
      rings = Array.from({ length: count }, () => {
        const sp = rand(5, 14);
        const ang = rand(0, Math.PI * 2);
        return {
          x: rand(0, w), y: rand(0, h), vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp * 0.6,
          r: rand(4.5, 7), ph: rand(0, 6.28), pair: -1, lit: 0, hover: 0,
        };
      });
      pairs = [];
      ripples = [];
      // Start with a few arches already standing so the first frame has life.
      for (let i = 0; i < 3; i++) makePair(true);
    }

    function makePair(instant = false) {
      const free = rings.map((_, i) => i).filter((i) => rings[i].pair < 0);
      if (free.length < 2) return;
      const a = free[Math.floor(Math.random() * free.length)];
      // Prefer neighbours that sit roughly side by side, so the bridge reads as an arch, not a long diagonal line.
      const maxD = clamp(w * 0.3, 130, 340);
      const near = free.filter((i) => {
        if (i === a) return false;
        const dx = Math.abs(rings[i].x - rings[a].x);
        const dy = Math.abs(rings[i].y - rings[a].y);
        const d = Math.hypot(dx, dy);
        return d > 70 && d < maxD && dy < dx * 0.6;
      });
      if (!near.length) return;
      const pool = near;
      const b = pool[Math.floor(Math.random() * pool.length)];
      const idx = pairs.length;
      rings[b].vx = rings[a].vx;
      rings[b].vy = rings[a].vy;
      rings[a].pair = idx;
      rings[b].pair = idx;
      pairs.push({ a, b, draw: instant ? 1 : 0, fade: 1, ending: false, pinged: instant });
      if (instant) {
        rings[a].lit = 1;
        rings[b].lit = 1;
      }
    }

    function releaseOldest() {
      const old = pairs.find((p) => !p.ending);
      if (old) old.ending = true;
    }

    function resize() {
      const r = host!.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      draw();
    }

    function step(dt: number) {
      t += dt;
      // movement (pairs drift together; walls reflect)
      for (const g of rings) {
        g.x += g.vx * dt;
        g.y += g.vy * dt;
      }
      for (let i = 0; i < rings.length; i++) {
        const g = rings[i];
        const p = g.pair >= 0 ? pairs[g.pair] : null;
        const mate = p ? rings[p.a === i ? p.b : p.a] : null;
        if (g.x < -20 || g.x > w + 20) {
          g.vx = -g.vx;
          if (mate) mate.vx = g.vx;
          g.x = clamp(g.x, -20, w + 20);
        }
        if (g.y < -20 || g.y > h + 20) {
          g.vy = -g.vy;
          if (mate) mate.vy = g.vy;
          g.y = clamp(g.y, -20, h + 20);
        }
        // hover: a lone ring near the pointer leans in
        let want = 0;
        if (pointer.on && g.pair < 0) {
          const d = Math.hypot(g.x - pointer.x, g.y - pointer.y);
          want = d < 170 ? 1 - d / 170 : 0;
        }
        g.hover += (want - g.hover) * Math.min(1, dt * 6);
      }
      // pairs
      for (let i = 0; i < pairs.length; i++) {
        const p = pairs[i];
        if (!p.ending) {
          p.draw = Math.min(1, p.draw + dt / 1.1);
          if (p.draw > 0.82) {
            rings[p.a].lit = Math.min(1, rings[p.a].lit + dt * 3);
            rings[p.b].lit = Math.min(1, rings[p.b].lit + dt * 3);
          }
          if (p.draw >= 1 && !p.pinged) {
            p.pinged = true;
            ripples.push({ x: rings[p.a].x, y: rings[p.a].y, t: 0 }, { x: rings[p.b].x, y: rings[p.b].y, t: 0 });
          }
        } else {
          p.fade = Math.max(0, p.fade - dt / 1.6);
          rings[p.a].lit = Math.min(rings[p.a].lit, p.fade);
          rings[p.b].lit = Math.min(rings[p.b].lit, p.fade);
        }
      }
      // release finished pairs (rebuild the index so ring.pair stays right)
      if (pairs.some((p) => p.ending && p.fade <= 0)) {
        const keep = pairs.filter((p) => !(p.ending && p.fade <= 0));
        for (const g of rings) g.pair = -1;
        keep.forEach((p, i) => {
          rings[p.a].pair = i;
          rings[p.b].pair = i;
        });
        pairs = keep;
      }
      ripples = ripples.filter((r) => (r.t += dt) < 1.4);
      // new arches
      nextMatch -= dt;
      if (nextMatch <= 0) {
        if (pairs.filter((p) => !p.ending).length >= maxPairs()) releaseOldest();
        makePair();
        nextMatch = rand(1.0, 2.0);
      }
    }

    function arch(a: Ring, b: Ring, prog: number, alpha: number, width: number) {
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      const lift = clamp(dist * 0.45, 28, 150);
      const mx = (a.x + b.x) / 2;
      const my = Math.min(a.y, b.y) - lift;
      const cx = 2 * mx - (a.x + b.x) / 2; // control point so the peak sits at (mx,my)
      const cy = 2 * my - (a.y + b.y) / 2;
      const steps = 36;
      const end = Math.max(1, Math.round(steps * ease(prog)));
      const grad = ctx!.createLinearGradient(a.x, 0, b.x, 0);
      grad.addColorStop(0, `rgba(${SKY},${alpha})`);
      grad.addColorStop(0.5, `rgba(255,236,190,${alpha})`);
      grad.addColorStop(1, `rgba(${GOLD},${alpha})`);
      ctx!.strokeStyle = a.x === b.x ? `rgba(${GOLD},${alpha})` : grad;
      ctx!.lineWidth = width;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      let hx = a.x;
      let hy = a.y;
      for (let s = 0; s <= end; s++) {
        const u = s / steps;
        const x = (1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * cx + u * u * b.x;
        const y = (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * cy + u * u * b.y;
        if (s === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
        hx = x;
        hy = y;
      }
      ctx!.stroke();
      return [hx, hy] as const;
    }

    function drawRing(g: Ring) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.3 + g.ph);
      const lit = g.lit;
      const radius = g.r + lit * 4 + g.hover * 2.5;
      if (lit > 0.01 || g.hover > 0.01) {
        const k = Math.max(lit, g.hover * 0.7);
        const glow = ctx!.createRadialGradient(g.x, g.y, 0, g.x, g.y, radius * 5);
        glow.addColorStop(0, `rgba(${GOLD},${0.32 * k})`);
        glow.addColorStop(1, `rgba(${GOLD},0)`);
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(g.x, g.y, radius * 5, 0, Math.PI * 2);
        ctx!.fill();
      }
      const a = 0.26 + 0.14 * pulse;
      ctx!.lineWidth = 1.6 + lit * 1.6;
      ctx!.strokeStyle = lit > 0.01 ? `rgba(${GOLD},${0.35 + 0.65 * lit})` : `rgba(${SKY},${a + g.hover * 0.5})`;
      ctx!.beginPath();
      ctx!.arc(g.x, g.y, radius, 0, Math.PI * 2);
      ctx!.stroke();
      if (lit > 0.5) {
        // the smile
        const k = (lit - 0.5) * 2;
        ctx!.strokeStyle = `rgba(110,72,14,${0.95 * k})`;
        ctx!.fillStyle = `rgba(110,72,14,${0.95 * k})`;
        ctx!.lineWidth = 1.5;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.arc(g.x, g.y + radius * 0.05, radius * 0.5, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx!.stroke();
        for (const ex of [-0.34, 0.34]) {
          ctx!.beginPath();
          ctx!.arc(g.x + ex * radius, g.y - radius * 0.28, Math.max(0.9, radius * 0.1), 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      // pointer hint: a dashed thread from the cursor to the nearest lone ring
      if (pointer.on) {
        let best: Ring | null = null;
        let bd = 170;
        for (const g of rings) {
          if (g.pair >= 0) continue;
          const d = Math.hypot(g.x - pointer.x, g.y - pointer.y);
          if (d < bd) {
            bd = d;
            best = g;
          }
        }
        if (best) {
          ctx!.setLineDash([3, 6]);
          ctx!.lineDashOffset = -t * 18;
          ctx!.strokeStyle = `rgba(${GOLD},${0.55 * (1 - bd / 170)})`;
          ctx!.lineWidth = 1.4;
          ctx!.beginPath();
          ctx!.moveTo(pointer.x, pointer.y);
          ctx!.lineTo(best.x, best.y);
          ctx!.stroke();
          ctx!.setLineDash([]);
        }
      }
      for (const p of pairs) {
        const a = rings[p.a];
        const b = rings[p.b];
        const alpha = (p.draw >= 1 ? 0.62 : 0.95) * p.fade;
        const head = arch(a, b, p.draw, alpha, 3.2);
        if (p.draw < 1) {
          ctx!.fillStyle = `rgba(255,240,205,${0.9 * p.fade})`;
          ctx!.beginPath();
          ctx!.arc(head[0], head[1], 3.4, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      for (const g of rings) drawRing(g);
      for (const r of ripples) {
        const k = r.t / 1.4;
        ctx!.strokeStyle = `rgba(${GOLD},${0.5 * (1 - k)})`;
        ctx!.lineWidth = 2 * (1 - k) + 0.5;
        ctx!.beginPath();
        ctx!.arc(r.x, r.y, 10 + k * 46, 0, Math.PI * 2);
        ctx!.stroke();
      }
    }

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (reduce || running || !visible || document.hidden) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height;
    };
    const onLeave = () => (pointer.on = false);
    const onVis = () => (document.hidden ? stop() : start());

    resize();
    const ro = new ResizeObserver(() => {
      const r = host.getBoundingClientRect();
      if (Math.abs(r.width - w) > 1 || Math.abs(r.height - h) > 40) resize();
    });
    ro.observe(host);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(host);
    window.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero2-canvas" aria-hidden="true" />;
}
