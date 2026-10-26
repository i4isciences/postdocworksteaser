"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingHeroAndServices() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const irises = Array.from(document.querySelectorAll(".iris")) as SVGElement[];
    let idle: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      irises.forEach((el) => {
        const svgEl = el.ownerSVGElement;
        if (!svgEl) return;
        const r = svgEl.getBoundingClientRect();
        if (!r.width) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const k = Math.min(1, Math.hypot(dx, dy) / 420);
        const a = Math.atan2(dy, dx);
        el.style.animation = "none";
        el.style.transform = `translate(${Math.cos(a) * 100 * k}px, ${Math.sin(a) * 40 * k}px)`;
      });
      clearTimeout(idle);
      idle = setTimeout(() => {
        irises.forEach((el) => {
          el.style.animation = "";
          el.style.transform = "";
        });
      }, 3500);
    };

    window.addEventListener("mousemove", handleMouseMove);

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      const g = document.querySelector(".sec");
      if (g) {
        observer = new IntersectionObserver(
          (entries) => {
            document.body.classList.toggle("paused", !entries[0].isIntersecting);
          },
          { threshold: 0 }
        );
        observer.observe(g);
      }
    }

    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.defaultMuted = true;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }
    };
    playVideo();
    const vid = videoRef.current;
    if (vid) {
      vid.addEventListener("loadeddata", playVideo);
      vid.addEventListener("canplay", playVideo);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(idle);
      if (observer) observer.disconnect();
      if (vid) {
        vid.removeEventListener("loadeddata", playVideo);
        vid.removeEventListener("canplay", playVideo);
      }
    };
  }, []);

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <div className="hero">
        <div>
          <div className="eyebrow">PEER MATCHING FOR THE NEXT STEP</div>
          <h1>Where the Next Step Has Already Been Taken.</h1>
          <div className="sub">
            Meet people one step ahead of you, and get help with everything that comes with the move, all the way to settled.
          </div>
          <div className="cta">
            <a href="#waitlist" className="btn navy" style={{ textDecoration: "none" }}>
              Join the waitlist
            </a>
            <a href="#svc" className="btn out" style={{ textDecoration: "none" }}>
              See the three services
            </a>
          </div>
        </div>

        <div className="hero-art-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "auto", display: "block" }}
            viewBox="0 0 800 660"
          >
            <rect width="100%" height="100%" fill="transparent" />
            <path d="M60,545 C250,650 600,648 684,478 C640,578 340,590 60,545Z" fill="#F4A725" />
            <path d="M100,530 C100,360 148,326 205,326 C262,326 310,360 310,530Z" fill="#182D5A" />
            <path d="M182,336 Q152,432 186,530 L228,530 Q196,432 224,334Z" fill="#F4A725" />
            <circle cx="205" cy="244" r="54" fill="#182D5A" />
            <path
              d="M157,203 L157,219 Q205,242 253,219 L253,203Z"
              fill="#182D5A"
              stroke="#F3F6FB"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <path
              d="M120,184 L205,150 L290,184 L205,218Z"
              fill="#182D5A"
              stroke="#F3F6FB"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <path d="M280,188 L280,232" stroke="#F4A725" strokeWidth="5" strokeLinecap="round" />
            <rect x="274" y="228" width="12" height="26" rx="5" fill="#F4A725" />
            <path d="M490,530 C490,326 540,284 595,284 C650,284 700,326 700,530Z" fill="#182D5A" />
            <path d="M561,282 L595,350 L629,282Z" fill="#F3F6FB" />
            <path
              d="M552,284 L595,364 L638,284"
              fill="none"
              stroke="#F4A725"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="632" y="420" width="38" height="46" rx="8" fill="none" stroke="#F4A725" strokeWidth="6" />
            <circle cx="595" cy="196" r="54" fill="#182D5A" />
            <path d="M262,446 Q296,450 322,450" fill="none" stroke="#182D5A" strokeWidth="42" strokeLinecap="round" />
            <path d="M536,414 Q512,424 488,430" fill="none" stroke="#182D5A" strokeWidth="40" strokeLinecap="round" />
            <g transform="translate(398,438) scale(0.68) translate(-207.9,-138.3)">
              <mask id="mgm" maskUnits="userSpaceOnUse" x="-100" y="-100" width="700" height="600">
                <rect x="-100" y="-100" width="700" height="600" fill="#fff" />
                <g clipPath="url(#cmgm)">
                  <rect
                    x="-93.0"
                    y="-50.0"
                    width="186"
                    height="100"
                    rx="50.0"
                    fill="none"
                    stroke="#000"
                    strokeWidth="47"
                    transform="translate(140,178) rotate(-12)"
                  />
                </g>
              </mask>
              <clipPath id="cmgm">
                <circle cx="160.3" cy="122.6" r="60" />
              </clipPath>
              <mask id="mnm" maskUnits="userSpaceOnUse" x="-100" y="-100" width="700" height="600">
                <rect x="-100" y="-100" width="700" height="600" fill="#fff" />
                <g clipPath="url(#cmnm)">
                  <rect
                    x="-111.0"
                    y="-60.0"
                    width="222"
                    height="120"
                    rx="60.0"
                    fill="none"
                    stroke="#000"
                    strokeWidth="51"
                    transform="translate(262,122) rotate(-26)"
                  />
                </g>
              </mask>
              <clipPath id="cmnm">
                <circle cx="217.5" cy="204.3" r="60" />
              </clipPath>
              <rect
                x="-93.0"
                y="-50.0"
                width="186"
                height="100"
                rx="50.0"
                fill="none"
                stroke="#F3F6FB"
                strokeWidth="49"
                transform="translate(140,178) rotate(-12)"
              />
              <rect
                x="-111.0"
                y="-60.0"
                width="222"
                height="120"
                rx="60.0"
                fill="none"
                stroke="#F3F6FB"
                strokeWidth="53"
                transform="translate(262,122) rotate(-26)"
              />
              <g mask="url(#mgm)">
                <rect
                  x="-111.0"
                  y="-60.0"
                  width="222"
                  height="120"
                  rx="60.0"
                  fill="none"
                  stroke="#F4A725"
                  strokeWidth="35"
                  transform="translate(262,122) rotate(-26)"
                />
              </g>
              <g mask="url(#mnm)">
                <rect
                  x="-93.0"
                  y="-50.0"
                  width="186"
                  height="100"
                  rx="50.0"
                  fill="none"
                  stroke="#182D5A"
                  strokeWidth="31"
                  transform="translate(140,178) rotate(-12)"
                />
              </g>
            </g>
          </svg>

          <div className="bub">
            <svg
              className="eyesvg"
              viewBox="0 0 1219 525"
              style={{ width: "56px", height: "auto", display: "block", overflow: "visible" }}
            >
              <defs>
                <clipPath id="ochb">
                  <path
                    transform="translate(-22,-90)"
                    d="M80.0,351.3 L86.0,349.3 L92.0,347.3 L98.0,346.3 L104.0,344.3 L110.0,342.3 L116.0,340.3 L122.0,338.3 L128.0,337.3 L134.0,335.3 L140.0,333.3 L146.0,332.3 L152.0,330.3 L158.0,329.3 L164.0,327.3 L170.0,325.3 L176.0,324.3 L182.0,322.3 L188.0,321.3 L194.0,319.3 L200.0,318.3 L206.0,316.3 L212.0,315.3 L218.0,314.3 L224.0,312.3 L230.0,311.3 L236.0,310.3 L242.0,308.3 L248.0,307.3 L254.0,306.3 L260.0,304.3 L266.0,303.3 L272.0,302.3 L278.0,301.3 L284.0,300.3 L290.0,299.3 L296.0,297.3 L302.0,296.3 L308.0,295.3 L314.0,294.3 L320.0,293.3 L326.0,292.3 L332.0,291.3 L338.0,290.3 L344.0,289.3 L350.0,288.3 L356.0,287.3 L362.0,286.3 L368.0,281.3 L374.0,277.3 L380.0,272.3 L386.0,268.3 L392.0,265.3 L398.0,261.3 L404.0,258.3 L410.0,255.3 L416.0,252.3 L422.0,250.3 L428.0,247.3 L434.0,245.3 L440.0,242.3 L446.0,240.3 L452.0,238.3 L458.0,236.3 L464.0,234.3 L470.0,232.3 L476.0,231.3 L482.0,229.3 L488.0,228.3 L494.0,226.3 L500.0,225.3 L506.0,223.3 L512.0,222.3 L518.0,221.3 L524.0,220.3 L530.0,219.3 L536.0,218.3 L542.0,217.3 L548.0,216.3 L554.0,216.3 L560.0,215.3 L566.0,214.3 L572.0,214.3 L578.0,213.3 L584.0,213.3 L590.0,212.3 L596.0,212.3 L602.0,212.3 L608.0,211.3 L614.0,211.3 L620.0,211.3 L626.0,211.3 L632.0,211.3 L638.0,211.3 L644.0,211.3 L650.0,211.3 L656.0,211.3 L662.0,212.3 L668.0,212.3 L674.0,212.3 L680.0,213.3 L686.0,213.3 L692.0,214.3 L698.0,214.3 L704.0,215.3 L710.0,216.3 L716.0,216.3 L722.0,217.3 L728.0,218.3 L734.0,219.3 L740.0,220.3 L746.0,221.3 L752.0,222.3 L758.0,224.3 L764.0,225.3 L770.0,226.3 L776.0,228.3 L782.0,229.3 L788.0,231.3 L794.0,233.3 L800.0,235.3 L806.0,236.3 L812.0,238.3 L818.0,240.3 L824.0,243.3 L830.0,245.3 L836.0,247.3 L842.0,250.3 L848.0,253.3 L854.0,256.3 L860.0,259.3 L866.0,262.3 L872.0,265.3 L878.0,269.3 L884.0,273.3 L890.0,277.3 L896.0,282.3 L902.0,286.3 L908.0,287.3 L914.0,288.3 L920.0,289.3 L926.0,290.3 L932.0,291.3 L938.0,292.3 L944.0,293.3 L950.0,294.3 L956.0,295.3 L962.0,296.3 L968.0,298.3 L974.0,299.3 L980.0,300.3 L986.0,301.3 L992.0,302.3 L998.0,303.3 L1004.0,305.3 L1010.0,306.3 L1016.0,307.3 L1022.0,309.3 L1028.0,310.3 L1034.0,311.3 L1040.0,313.3 L1046.0,314.3 L1052.0,315.3 L1058.0,317.3 L1064.0,318.3 L1070.0,320.3 L1076.0,321.3 L1082.0,323.3 L1088.0,324.3 L1094.0,326.3 L1100.0,327.3 L1106.0,329.3 L1112.0,330.3 L1118.0,332.3 L1124.0,334.3 L1130.0,335.3 L1136.0,337.3 L1142.0,339.3 L1148.0,341.3 L1154.0,342.3 L1160.0,344.3 L1166.0,346.3 L1172.0,348.3 L1178.0,350.3 L1184.0,351.3 L1184.0,351.3 L1184.0,353.7 L1184.0,353.7 L1178.0,355.7 L1172.0,357.7 L1166.0,358.7 L1160.0,360.7 L1154.0,362.7 L1148.0,364.7 L1142.0,365.7 L1136.0,367.7 L1130.0,369.7 L1124.0,370.7 L1118.0,372.7 L1112.0,374.7 L1106.0,375.7 L1100.0,377.7 L1094.0,378.7 L1088.0,380.7 L1082.0,381.7 L1076.0,383.7 L1070.0,384.7 L1064.0,386.7 L1058.0,387.7 L1052.0,389.7 L1046.0,390.7 L1040.0,392.7 L1034.0,393.7 L1028.0,394.7 L1022.0,395.7 L1016.0,397.7 L1010.0,398.7 L1004.0,399.7 L998.0,401.7 L992.0,402.7 L986.0,403.7 L980.0,404.7 L974.0,405.7 L968.0,406.7 L962.0,408.7 L956.0,409.7 L950.0,410.7 L944.0,411.7 L938.0,412.7 L932.0,413.7 L926.0,414.7 L920.0,415.7 L914.0,416.7 L908.0,417.7 L902.0,418.7 L896.0,422.7 L890.0,427.7 L884.0,431.7 L878.0,435.7 L872.0,439.7 L866.0,442.7 L860.0,446.7 L854.0,449.7 L848.0,452.7 L842.0,454.7 L836.0,457.7 L830.0,459.7 L824.0,462.7 L818.0,464.7 L812.0,466.7 L806.0,468.7 L800.0,470.7 L794.0,472.7 L788.0,472.7 L782.0,474.7 L776.0,476.5 L770.0,478.3 L764.0,480.1 L758.0,481.7 L752.0,483.3 L746.0,484.8 L740.0,486.2 L734.0,487.6 L728.0,488.8 L722.0,490.1 L716.0,491.2 L710.0,492.2 L704.0,493.2 L698.0,494.1 L692.0,495.0 L686.0,495.7 L680.0,496.4 L674.0,497.0 L668.0,497.5 L662.0,498.0 L656.0,498.4 L650.0,498.7 L644.0,498.9 L638.0,499.1 L632.0,499.2 L626.0,499.2 L620.0,499.1 L614.0,499.0 L608.0,498.8 L602.0,498.5 L596.0,498.1 L590.0,497.7 L584.0,497.2 L578.0,496.6 L572.0,496.0 L566.0,495.2 L560.0,494.4 L554.0,493.5 L548.0,492.6 L542.0,491.5 L536.0,490.4 L530.0,489.3 L524.0,488.0 L518.0,486.7 L512.0,485.3 L506.0,483.8 L500.0,482.2 L494.0,480.6 L488.0,478.9 L482.0,477.1 L476.0,475.3 L470.0,473.4 L464.0,470.7 L458.0,468.7 L452.0,466.7 L446.0,464.7 L440.0,462.7 L434.0,460.7 L428.0,457.7 L422.0,455.7 L416.0,452.7 L410.0,449.7 L404.0,446.7 L398.0,443.7 L392.0,440.7 L386.0,436.7 L380.0,432.7 L374.0,428.7 L368.0,423.7 L362.0,418.7 L356.0,417.7 L350.0,416.7 L344.0,415.7 L338.0,414.7 L332.0,413.7 L326.0,412.7 L320.0,411.7 L314.0,410.7 L308.0,409.7 L302.0,408.7 L296.0,407.7 L290.0,406.7 L284.0,404.7 L278.0,403.7 L272.0,402.7 L266.0,401.7 L260.0,400.7 L254.0,398.7 L248.0,397.7 L242.0,396.7 L236.0,394.7 L230.0,393.7 L224.0,392.7 L218.0,390.7 L212.0,389.7 L206.0,388.7 L200.0,386.7 L194.0,385.7 L188.0,383.7 L182.0,382.7 L176.0,380.7 L170.0,379.7 L164.0,377.7 L158.0,376.7 L152.0,374.7 L146.0,372.7 L140.0,371.7 L134.0,369.7 L128.0,367.7 L122.0,366.7 L116.0,364.7 L110.0,362.7 L104.0,361.7 L98.0,359.7 L92.0,357.7 L86.0,355.7 L80.0,353.7Z"
                  />
                </clipPath>
                <radialGradient id="ighb" cx="42%" cy="38%" r="70%">
                  <stop offset="0" stopColor="#F3CC78" />
                  <stop offset="1" stopColor="#E8B34E" />
                </radialGradient>
              </defs>
              <g className="blink" style={{ transformOrigin: "606px 262px" }}>
                <image href="/eye_shell.png" x="46" y="80" width="1127" height="365" />
                <g clipPath="url(#ochb)">
                  <g transform="translate(-22,-90)">
                    <g className="iris">
                      <circle cx="628.0" cy="381.0" r="128" fill="#1D2A57" />
                      <circle cx="628.0" cy="381.0" r="112" fill="url(#ighb)" />
                      <circle cx="628.0" cy="381.0" r="51" fill="#1D2A57" />
                      <circle className="hl" cx="659" cy="344.6" r="16" fill="#fff" />
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            <span>Who is one step ahead of me in my field?</span>
          </div>
        </div>
      </div>

      {/* ================= SECOND SECTION (THREE SERVICES) ================= */}
      <div className="sec" id="svc">
        <h2>Three services. One path from Doc to Postdoc.</h2>
        <div className="lead">Everything the next step needs, with eyewee guiding you through each one.</div>
        <div className="grid">
          {/* Service 1 */}
          <div className="card c1">
            <div className="top">
              <div className="ico t1">
                <svg viewBox="0 0 64 64" width="80" height="80">
                  <g className="waves" stroke="#F4A725" strokeWidth="3" strokeLinecap="round" fill="none">
                    <path d="M9 22 Q4 32 9 42" />
                    <path d="M55 22 Q60 32 55 42" />
                    <path d="M3 18 Q-3 32 3 46" opacity=".6" />
                    <path d="M61 18 Q67 32 61 46" opacity=".6" />
                  </g>
                  <g className="bell" style={{ transformOrigin: "32px 12px" }}>
                    <g transform="translate(8,8) scale(2)">
                      <path
                        d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"
                        stroke="#182D5A"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </g>
                  </g>
                </svg>
              </div>
              <div className="num">1</div>
            </div>
            <h3>Matching Up-line &amp; Ring the Bell</h3>
            <p>
              Find people one step ahead of you, by field, stage, place and language. Need a quick answer? Ring the bell to
              your own connections first.
            </p>
            <ul>
              <li>Match by field, career stage and place</li>
              <li>Ring the Bell: your connections first</li>
            </ul>
            <div className="act">
              <a href="#waitlist" className="btn out">
                Join the waitlist
              </a>
            </div>
          </div>

          {/* Service 2 */}
          <div className="card c2">
            <div className="top">
              <div className="ico t2">
                <svg viewBox="0 0 64 64" width="80" height="80">
                  <g
                    className="trail"
                    stroke="#F4A725"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="1 7"
                    fill="none"
                  >
                    <path d="M6 58 Q22 52 34 36" />
                  </g>
                  <g className="plane">
                    <g transform="translate(8,8) scale(2)">
                      <path
                        d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
                        stroke="#182D5A"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="#fff"
                      />
                    </g>
                  </g>
                </svg>
              </div>
              <div className="num">2</div>
            </div>
            <h3>Travel Companion</h3>
            <p>
              Parents visiting from abroad? Match with a trusted companion for the airport pickup and the first days in a
              new city.
            </p>
            <ul>
              <li>Safety check before contact is shared</li>
              <li>A simple step-by-step trip form</li>
            </ul>
            <div className="act">
              <span className="btn soon">Coming soon</span>
            </div>
          </div>

          {/* Service 3 */}
          <div className="card c5">
            <div className="top">
              <div className="ico t5">
                <svg
                  className="eyesvg"
                  viewBox="0 0 1219 525"
                  style={{ width: "110px", height: "auto", display: "block", overflow: "visible" }}
                >
                  <defs>
                    <clipPath id="occ5">
                      <path
                        transform="translate(-22,-90)"
                        d="M80.0,351.3 L86.0,349.3 L92.0,347.3 L98.0,346.3 L104.0,344.3 L110.0,342.3 L116.0,340.3 L122.0,338.3 L128.0,337.3 L134.0,335.3 L140.0,333.3 L146.0,332.3 L152.0,330.3 L158.0,329.3 L164.0,327.3 L170.0,325.3 L176.0,324.3 L182.0,322.3 L188.0,321.3 L194.0,319.3 L200.0,318.3 L206.0,316.3 L212.0,315.3 L218.0,314.3 L224.0,312.3 L230.0,311.3 L236.0,310.3 L242.0,308.3 L248.0,307.3 L254.0,306.3 L260.0,304.3 L266.0,303.3 L272.0,302.3 L278.0,301.3 L284.0,300.3 L290.0,299.3 L296.0,297.3 L302.0,296.3 L308.0,295.3 L314.0,294.3 L320.0,293.3 L326.0,292.3 L332.0,291.3 L338.0,290.3 L344.0,289.3 L350.0,288.3 L356.0,287.3 L362.0,286.3 L368.0,281.3 L374.0,277.3 L380.0,272.3 L386.0,268.3 L392.0,265.3 L398.0,261.3 L404.0,258.3 L410.0,255.3 L416.0,252.3 L422.0,250.3 L428.0,247.3 L434.0,245.3 L440.0,242.3 L446.0,240.3 L452.0,238.3 L458.0,236.3 L464.0,234.3 L470.0,232.3 L476.0,231.3 L482.0,229.3 L488.0,228.3 L494.0,226.3 L500.0,225.3 L506.0,223.3 L512.0,222.3 L518.0,221.3 L524.0,220.3 L530.0,219.3 L536.0,218.3 L542.0,217.3 L548.0,216.3 L554.0,216.3 L560.0,215.3 L566.0,214.3 L572.0,214.3 L578.0,213.3 L584.0,213.3 L590.0,212.3 L596.0,212.3 L602.0,212.3 L608.0,211.3 L614.0,211.3 L620.0,211.3 L626.0,211.3 L632.0,211.3 L638.0,211.3 L644.0,211.3 L650.0,211.3 L656.0,211.3 L662.0,212.3 L668.0,212.3 L674.0,212.3 L680.0,213.3 L686.0,213.3 L692.0,214.3 L698.0,214.3 L704.0,215.3 L710.0,216.3 L716.0,216.3 L722.0,217.3 L728.0,218.3 L734.0,219.3 L740.0,220.3 L746.0,221.3 L752.0,222.3 L758.0,224.3 L764.0,225.3 L770.0,226.3 L776.0,228.3 L782.0,229.3 L788.0,231.3 L794.0,233.3 L800.0,235.3 L806.0,236.3 L812.0,238.3 L818.0,240.3 L824.0,243.3 L830.0,245.3 L836.0,247.3 L842.0,250.3 L848.0,253.3 L854.0,256.3 L860.0,259.3 L866.0,262.3 L872.0,265.3 L878.0,269.3 L884.0,273.3 L890.0,277.3 L896.0,282.3 L902.0,286.3 L908.0,287.3 L914.0,288.3 L920.0,289.3 L926.0,290.3 L932.0,291.3 L938.0,292.3 L944.0,293.3 L950.0,294.3 L956.0,295.3 L962.0,296.3 L968.0,298.3 L974.0,299.3 L980.0,300.3 L986.0,301.3 L992.0,302.3 L998.0,303.3 L1004.0,305.3 L1010.0,306.3 L1016.0,307.3 L1022.0,309.3 L1028.0,310.3 L1034.0,311.3 L1040.0,313.3 L1046.0,314.3 L1052.0,315.3 L1058.0,317.3 L1064.0,318.3 L1070.0,320.3 L1076.0,321.3 L1082.0,323.3 L1088.0,324.3 L1094.0,326.3 L1100.0,327.3 L1106.0,329.3 L1112.0,330.3 L1118.0,332.3 L1124.0,334.3 L1130.0,335.3 L1136.0,337.3 L1142.0,339.3 L1148.0,341.3 L1154.0,342.3 L1160.0,344.3 L1166.0,346.3 L1172.0,348.3 L1178.0,350.3 L1184.0,351.3 L1184.0,351.3 L1184.0,353.7 L1184.0,353.7 L1178.0,355.7 L1172.0,357.7 L1166.0,358.7 L1160.0,360.7 L1154.0,362.7 L1148.0,364.7 L1142.0,365.7 L1136.0,367.7 L1130.0,369.7 L1124.0,370.7 L1118.0,372.7 L1112.0,374.7 L1106.0,375.7 L1100.0,377.7 L1094.0,378.7 L1088.0,380.7 L1082.0,381.7 L1076.0,383.7 L1070.0,384.7 L1064.0,386.7 L1058.0,387.7 L1052.0,389.7 L1046.0,390.7 L1040.0,392.7 L1034.0,393.7 L1028.0,394.7 L1022.0,395.7 L1016.0,397.7 L1010.0,398.7 L1004.0,399.7 L998.0,401.7 L992.0,402.7 L986.0,403.7 L980.0,404.7 L974.0,405.7 L968.0,406.7 L962.0,408.7 L956.0,409.7 L950.0,410.7 L944.0,411.7 L938.0,412.7 L932.0,413.7 L926.0,414.7 L920.0,415.7 L914.0,416.7 L908.0,417.7 L902.0,418.7 L896.0,422.7 L890.0,427.7 L884.0,431.7 L878.0,435.7 L872.0,439.7 L866.0,442.7 L860.0,446.7 L854.0,449.7 L848.0,452.7 L842.0,454.7 L836.0,457.7 L830.0,459.7 L824.0,462.7 L818.0,464.7 L812.0,466.7 L806.0,468.7 L800.0,470.7 L794.0,472.7 L788.0,472.7 L782.0,474.7 L776.0,476.5 L770.0,478.3 L764.0,480.1 L758.0,481.7 L752.0,483.3 L746.0,484.8 L740.0,486.2 L734.0,487.6 L728.0,488.8 L722.0,490.1 L716.0,491.2 L710.0,492.2 L704.0,493.2 L698.0,494.1 L692.0,495.0 L686.0,495.7 L680.0,496.4 L674.0,497.0 L668.0,497.5 L662.0,498.0 L656.0,498.4 L650.0,498.7 L644.0,498.9 L638.0,499.1 L632.0,499.2 L626.0,499.2 L620.0,499.1 L614.0,499.0 L608.0,498.8 L602.0,498.5 L596.0,498.1 L590.0,497.7 L584.0,497.2 L578.0,496.6 L572.0,496.0 L566.0,495.2 L560.0,494.4 L554.0,493.5 L548.0,492.6 L542.0,491.5 L536.0,490.4 L530.0,489.3 L524.0,488.0 L518.0,486.7 L512.0,485.3 L506.0,483.8 L500.0,482.2 L494.0,480.6 L488.0,478.9 L482.0,477.1 L476.0,475.3 L470.0,473.4 L464.0,470.7 L458.0,468.7 L452.0,466.7 L446.0,464.7 L440.0,462.7 L434.0,460.7 L428.0,457.7 L422.0,455.7 L416.0,452.7 L410.0,449.7 L404.0,446.7 L398.0,443.7 L392.0,440.7 L386.0,436.7 L380.0,432.7 L374.0,428.7 L368.0,423.7 L362.0,418.7 L356.0,417.7 L350.0,416.7 L344.0,415.7 L338.0,414.7 L332.0,413.7 L326.0,412.7 L320.0,411.7 L314.0,410.7 L308.0,409.7 L302.0,408.7 L296.0,407.7 L290.0,406.7 L284.0,404.7 L278.0,403.7 L272.0,402.7 L266.0,401.7 L260.0,400.7 L254.0,398.7 L248.0,397.7 L242.0,396.7 L236.0,394.7 L230.0,393.7 L224.0,392.7 L218.0,390.7 L212.0,389.7 L206.0,388.7 L200.0,386.7 L194.0,385.7 L188.0,383.7 L182.0,382.7 L176.0,380.7 L170.0,379.7 L164.0,377.7 L158.0,376.7 L152.0,374.7 L146.0,372.7 L140.0,371.7 L134.0,369.7 L128.0,367.7 L122.0,366.7 L116.0,364.7 L110.0,362.7 L104.0,361.7 L98.0,359.7 L92.0,357.7 L86.0,355.7 L80.0,353.7Z"
                      />
                    </clipPath>
                    <radialGradient id="igc5" cx="42%" cy="38%" r="70%">
                      <stop offset="0" stopColor="#F3CC78" />
                      <stop offset="1" stopColor="#E8B34E" />
                    </radialGradient>
                  </defs>
                  <g className="blink" style={{ transformOrigin: "606px 262px" }}>
                    <image href="/eye_shell.png" x="46" y="80" width="1127" height="365" />
                    <g clipPath="url(#occ5)">
                      <g transform="translate(-22,-90)">
                        <g className="iris">
                          <circle cx="628.0" cy="381.0" r="128" fill="#1D2A57" />
                          <circle cx="628.0" cy="381.0" r="112" fill="url(#igc5)" />
                          <circle cx="628.0" cy="381.0" r="51" fill="#1D2A57" />
                          <circle className="hl" cx="659" cy="344.6" r="16" fill="#fff" />
                        </g>
                      </g>
                    </g>
                  </g>
                  <g transform="translate(70,70) scale(3.4)">
                    <path className="spk s0" d="M0-26 L6-6 26 0 6 6 0 26 -6 6 -26 0 -6-6Z" fill="#F4A725" />
                  </g>
                  <g transform="translate(1139,60) scale(4.25)">
                    <path className="spk s1" d="M0-26 L6-6 26 0 6 6 0 26 -6 6 -26 0 -6-6Z" fill="#F4A725" />
                  </g>
                  <g transform="translate(975,477) scale(3.06)">
                    <path className="spk s2" d="M0-26 L6-6 26 0 6 6 0 26 -6 6 -26 0 -6-6Z" fill="#F4A725" />
                  </g>
                  <g transform="translate(244,485) scale(2.72)">
                    <path className="spk s3" d="M0-26 L6-6 26 0 6 6 0 26 -6 6 -26 0 -6-6Z" fill="#F4A725" />
                  </g>
                  <g transform="translate(610,28) scale(2.38)">
                    <path className="spk s4" d="M0-26 L6-6 26 0 6 6 0 26 -6 6 -26 0 -6-6Z" fill="#F4A725" />
                  </g>
                </svg>
              </div>
              <div className="num">3</div>
            </div>
            <h3>
              eyewee<sup>SM</sup>, your AI assistant
            </h3>
            <p>
              Ask in plain words, by text or voice. eyewee guides you through each service, from your first match to
              settling in.
            </p>
            <ul>
              <li>Finds matches and rings the bell</li>
              <li>Tells you what is due next</li>
            </ul>
            <div className="act">
              <a href="#waitlist" className="btn out">
                Join the waitlist
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ================= VIDEO SHOWCASE TEMPLATE ================= */}
      <section className="teaser-video-section" id="teaser-video">
        <div className="teaser-video-header">
          <h2>See How the Next Step Unfolds</h2>
          <p>
            Watch the official preview to discover how peer matching, eyewee AI guidance, and career navigation connect
            seamlessly for postdocs.
          </p>
        </div>

        <div className="teaser-video-wrapper">
          <video
            ref={videoRef}
            className="teaser-video-player"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/doc2postdoc.png"
          >
            <source src="/teaser.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="teaser-video-action">
          <a href="#waitlist" className="btn navy">
            Join the waitlist for early access
          </a>
          <a href="#eyewee" className="btn out">
            Learn more about eyewee
          </a>
        </div>
      </section>
    </>
  );
}
