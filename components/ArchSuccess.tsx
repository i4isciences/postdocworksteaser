"use client";

import { useEffect, useRef } from "react";
import { ARCH_LOGO_SVG } from "@/components/ArchLogoSvg";

// Plays the Doc2Postdoc logo animation (letters arrive, the arch draws across, the smiley "o"s settle) once,
// then holds the finished logo. Used after a successful waitlist or survey submission instead of a tick mark.
// Timeline values come from the campaign animation's logo; the story scene before it is deliberately not included.

const CY = 649.8095703125;
const LOGO_END = 6.9; // logo-time at which the arch has fully drawn and settled
const REAL_SECONDS = 4.2; // how long the animation takes on screen
const ORDER: [string, "t" | "r" | "s"][] = [
  ["L0", "t"], ["R1", "r"], ["L1", "t"], ["L2", "t"], ["L3", "t"], ["L4", "t"],
  ["L5", "t"], ["L6", "t"], ["L7", "t"], ["R2", "r"], ["L8", "t"], ["SM", "s"],
];
const T = { enter0: 0.35, step: 0.095, enterDur: 0.6, archL: [2.5, 4.4], archR: [2.8, 4.7], shake: [4.8, 6.9] };

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eOut = (x: number) => 1 - Math.pow(1 - x, 3);
const eSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;
const eBackL = (x: number) => {
  const c1 = 1.4, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export function ArchSuccess({ eyebrow, heading, message }: { eyebrow?: string; heading: string; message: string }) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    box.scrollIntoView({ block: "center", behavior: "smooth" });
    const q = <E extends Element = SVGElement>(sel: string) => box.querySelector(sel) as E;
    const mL = q<SVGPathElement>("#mLp");
    const mR = q<SVGPathElement>("#mRp");
    const LL = mL.getTotalLength();
    const LR = mR.getTotalLength();
    mL.style.strokeDasharray = String(LL);
    mR.style.strokeDasharray = String(LR);
    const byId = Object.fromEntries(ORDER.map(([id]) => [id, q<SVGGElement>("#" + id)]));
    const arch = q<SVGGElement>("#arch");

    function render(t: number) {
      ORDER.forEach(([id, kind], i) => {
        const el = byId[id];
        if (kind === "s") {
          el.style.opacity = String(eOut(clamp((t - 2.0) / 0.5)));
          return;
        }
        const p = clamp((t - (T.enter0 + i * T.step)) / T.enterDur);
        el.style.opacity = String(eOut(p));
        if (kind === "t") el.setAttribute("transform", `translate(0,${(1 - eOut(p)) * 28})`);
      });
      (["R1", "R2"] as const).forEach((id) => {
        const el = byId[id];
        const i = ORDER.findIndex((a) => a[0] === id);
        const p = clamp((t - (T.enter0 + i * T.step)) / (T.enterDur + 0.15));
        const sc = p < 1 ? 0.55 + 0.45 * eBackL(p) : 1;
        const cx = Number(el.getAttribute("data-cx"));
        const cy = Number(el.getAttribute("data-cy"));
        (el.firstElementChild as SVGGElement).setAttribute("transform", `translate(${cx},${cy}) scale(${sc.toFixed(4)},${sc.toFixed(4)})`);
      });
      const pl = eSine(clamp((t - T.archL[0]) / (T.archL[1] - T.archL[0])));
      const pr = eSine(clamp((t - T.archR[0]) / (T.archR[1] - T.archR[0])));
      mL.style.strokeDashoffset = String(LL * (1 - pl));
      mR.style.strokeDashoffset = String(LR * (1 - pr));
      const k = clamp((t - T.shake[0]) / (T.shake[1] - T.shake[0]));
      const s = 1 + 0.036 * Math.sin(4 * Math.PI * k) * Math.pow(Math.sin(Math.PI * k), 0.5);
      arch.setAttribute("transform", `translate(0,${CY}) scale(1,${s.toFixed(5)}) translate(0,${-CY})`);
    }

    // People who ask their device for reduced motion get the finished logo straight away.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      render(LOGO_END);
      return;
    }
    render(0);
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = (now - start) / 1000;
      render(Math.min(LOGO_END, (elapsed / REAL_SECONDS) * LOGO_END));
      if (elapsed < REAL_SECONDS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="arch-success" role="status">
      <div ref={boxRef} className="arch-success-logo" dangerouslySetInnerHTML={{ __html: ARCH_LOGO_SVG }} />
      {eyebrow && <p className="teaser-label arch-success-eyebrow">{eyebrow}</p>}
      <h2>{heading}</h2>
      <p>{message}</p>
    </div>
  );
}
