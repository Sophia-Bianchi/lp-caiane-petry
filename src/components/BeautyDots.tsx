import { useEffect, useRef, type CSSProperties } from "react";

// "Função gera beleza": as bolinhas da marca, cada uma recortando o mesmo
// gradiente vivo (o movimento da abertura, anotação do Figma).
// Ao chegar na seção, as bolinhas entram girando até formar o logo.
// O gradiente anda sozinho, segue o mouse e gira com o scroll (vale no celular).

const W = 945.62;
const H = 603.6;
const CX = W / 2;
const CY = H / 2;

// centro, cor e ritmo de cada mancha do gradiente
const BLOBS = [
  { x: 190, y: 110, color: "#c9a98c", sx: 0.00031, sy: 0.00024, p: 0 },
  { x: 800, y: 190, color: "#23313d", sx: 0.00026, sy: 0.00033, p: 1.7 },
  { x: 240, y: 520, color: "#5f7c92", sx: 0.00022, sy: 0.00028, p: 3.1 },
  { x: 760, y: 520, color: "#e4e1da", sx: 0.00035, sy: 0.00021, p: 4.4 },
];

export function BeautyDots() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gradRefs = useRef<(SVGRadialGradientElement | null)[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // entra girando uma vez, quando a seção aparece
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          svg.dataset.in = "true";
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (reduced) svg.dataset.in = "true";
    else io.observe(svg);

    if (reduced) return () => io.disconnect();

    let visible = false;
    let frame = 0;
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    // no toque o gradiente anda a ~30 fps e espera o dedo parar: repintar o
    // SVG durante o scroll era o que pesava no celular
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    let clock = 0;
    let lastTime = 0;
    let angle = 0;
    let scrollingUntil = 0;
    const onScroll = () => {
      scrollingUntil = performance.now() + 180;
    };
    if (touch) window.addEventListener("scroll", onScroll, { passive: true });

    const vis = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(tick);
    });
    vis.observe(svg);

    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      tx = Math.max(-1.4, Math.min(1.4, ((e.clientX - r.left) / r.width - 0.5) * 2));
      ty = Math.max(-1.4, Math.min(1.4, ((e.clientY - r.top) / r.height - 0.5) * 2));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    function tick(now: number) {
      frame = 0;
      if (!visible || !svg) return;
      if (touch) {
        // dedo rolando: espera (o relógio não anda, então não há salto)
        if (now < scrollingUntil) {
          lastTime = now;
          frame = requestAnimationFrame(tick);
          return;
        }
        // ~30 fps
        if (lastTime && now - lastTime < 30) {
          frame = requestAnimationFrame(tick);
          return;
        }
      }
      const dt = lastTime ? Math.min(64, now - lastTime) : 16;
      lastTime = now;
      clock += dt; // relógio próprio: pausar não faz o gradiente pular
      const time = clock;
      px += (tx - px) * 0.06;
      py += (ty - py) * 0.06;
      const r = svg.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const s = Math.max(-1, Math.min(1, ((vh - r.top) / (vh + r.height)) * 2 - 1));
      // ~63° de giro ao atravessar a tela, com amortecimento (sem salto)
      angle += (s * 1.1 - angle) * (touch ? 0.18 : 0.12);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      BLOBS.forEach((b, i) => {
        const g = gradRefs.current[i];
        if (!g) return;
        let x = b.x + Math.sin(time * b.sx + b.p) * 190 + px * 160;
        let y = b.y + Math.cos(time * b.sy + b.p) * 130 + py * 110;
        const dx = x - CX;
        const dy = y - CY;
        x = CX + dx * cos - dy * sin;
        y = CY + dx * sin + dy * cos;
        g.setAttribute("cx", x.toFixed(1));
        g.setAttribute("cy", y.toFixed(1));
      });
      frame = requestAnimationFrame(tick);
    }

    return () => {
      io.disconnect();
      vis.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="beauty-ring"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Símbolo da marca Caiane Petry"
    >
      <defs>
          <path id="bd-p-0" d="M473.175 136.725C510.93 136.725 541.537 106.118 541.537 68.3625C541.537 30.6069 510.93 0 473.175 0C435.419 0 404.812 30.6069 404.812 68.3625C404.812 106.118 435.419 136.725 473.175 136.725Z" />
          <path id="bd-p-1" d="M738.398 173.613C768.62 173.613 793.119 143.006 793.119 105.251C793.119 67.4951 768.62 36.8882 738.398 36.8882C708.176 36.8882 683.677 67.4951 683.677 105.251C683.677 143.006 708.176 173.613 738.398 173.613Z" />
          <path id="bd-p-2" d="M207.952 173.613C238.173 173.613 262.673 143.006 262.673 105.251C262.673 67.4951 238.173 36.8882 207.952 36.8882C177.73 36.8882 153.23 67.4951 153.23 105.251C153.23 143.006 177.73 173.613 207.952 173.613Z" />
          <path id="bd-p-3" d="M917.322 261.865C932.951 261.865 945.62 231.258 945.62 193.502C945.62 155.747 932.951 125.14 917.322 125.14C901.694 125.14 889.025 155.747 889.025 193.502C889.025 231.258 901.694 261.865 917.322 261.865Z" />
          <path id="bd-p-4" d="M28.2978 261.865C43.9262 261.865 56.5956 231.258 56.5956 193.502C56.5956 155.747 43.9262 125.14 28.2978 125.14C12.6694 125.14 0 155.747 0 193.502C0 231.258 12.6694 261.865 28.2978 261.865Z" />
          <path id="bd-p-5" d="M472.472 603.599C510.227 603.599 540.834 572.992 540.834 535.236C540.834 497.481 510.227 466.874 472.472 466.874C434.716 466.874 404.109 497.481 404.109 535.236C404.109 572.992 434.716 603.599 472.472 603.599Z" />
          <path id="bd-p-6" d="M207.248 566.737C237.47 566.737 261.97 536.13 261.97 498.375C261.97 460.619 237.47 430.012 207.248 430.012C177.027 430.012 152.527 460.619 152.527 498.375C152.527 536.13 177.027 566.737 207.248 566.737Z" />
          <path id="bd-p-7" d="M737.696 566.737C767.917 566.737 792.417 536.13 792.417 498.375C792.417 460.619 767.917 430.012 737.696 430.012C707.474 430.012 682.975 460.619 682.975 498.375C682.975 536.13 707.474 566.737 737.696 566.737Z" />
          <path id="bd-p-8" d="M28.2978 478.459C43.9262 478.459 56.5956 447.852 56.5956 410.096C56.5956 372.341 43.9262 341.734 28.2978 341.734C12.6694 341.734 0 372.341 0 410.096C0 447.852 12.6694 478.459 28.2978 478.459Z" />
          <path id="bd-p-9" d="M917.322 478.459C932.951 478.459 945.62 447.852 945.62 410.096C945.62 372.341 932.951 341.734 917.322 341.734C901.694 341.734 889.025 372.341 889.025 410.096C889.025 447.852 901.694 478.459 917.322 478.459Z" />
        {BLOBS.map((b, i) => (
          <radialGradient
            key={i}
            id={`bd-g${i}`}
            ref={(el) => {
              gradRefs.current[i] = el;
            }}
            gradientUnits="userSpaceOnUse"
            cx={b.x}
            cy={b.y}
            r="560"
          >
            <stop offset="0" stopColor={b.color} />
            <stop offset="1" stopColor={b.color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
        <g className="bd-dot" style={{ "--i": 0 } as CSSProperties}>
          <use href="#bd-p-0" fill="#6d7276" />
          <use href="#bd-p-0" fill="url(#bd-g0)" />
          <use href="#bd-p-0" fill="url(#bd-g1)" />
          <use href="#bd-p-0" fill="url(#bd-g2)" />
          <use href="#bd-p-0" fill="url(#bd-g3)" />
        </g>
        <g className="bd-dot" style={{ "--i": 1 } as CSSProperties}>
          <use href="#bd-p-1" fill="#6d7276" />
          <use href="#bd-p-1" fill="url(#bd-g0)" />
          <use href="#bd-p-1" fill="url(#bd-g1)" />
          <use href="#bd-p-1" fill="url(#bd-g2)" />
          <use href="#bd-p-1" fill="url(#bd-g3)" />
        </g>
        <g className="bd-dot" style={{ "--i": 9 } as CSSProperties}>
          <use href="#bd-p-2" fill="#6d7276" />
          <use href="#bd-p-2" fill="url(#bd-g0)" />
          <use href="#bd-p-2" fill="url(#bd-g1)" />
          <use href="#bd-p-2" fill="url(#bd-g2)" />
          <use href="#bd-p-2" fill="url(#bd-g3)" />
        </g>
        <g className="bd-dot" style={{ "--i": 2 } as CSSProperties}>
          <use href="#bd-p-3" fill="#6d7276" />
          <use href="#bd-p-3" fill="url(#bd-g0)" />
          <use href="#bd-p-3" fill="url(#bd-g1)" />
          <use href="#bd-p-3" fill="url(#bd-g2)" />
          <use href="#bd-p-3" fill="url(#bd-g3)" />
        </g>
        <g className="bd-dot" style={{ "--i": 8 } as CSSProperties}>
          <use href="#bd-p-4" fill="#6d7276" />
          <use href="#bd-p-4" fill="url(#bd-g0)" />
          <use href="#bd-p-4" fill="url(#bd-g1)" />
          <use href="#bd-p-4" fill="url(#bd-g2)" />
          <use href="#bd-p-4" fill="url(#bd-g3)" />
        </g>
        <g className="bd-dot" style={{ "--i": 5 } as CSSProperties}>
          <use href="#bd-p-5" fill="#6d7276" />
          <use href="#bd-p-5" fill="url(#bd-g0)" />
          <use href="#bd-p-5" fill="url(#bd-g1)" />
          <use href="#bd-p-5" fill="url(#bd-g2)" />
          <use href="#bd-p-5" fill="url(#bd-g3)" />
        </g>
        <g className="bd-dot" style={{ "--i": 6 } as CSSProperties}>
          <use href="#bd-p-6" fill="#6d7276" />
          <use href="#bd-p-6" fill="url(#bd-g0)" />
          <use href="#bd-p-6" fill="url(#bd-g1)" />
          <use href="#bd-p-6" fill="url(#bd-g2)" />
          <use href="#bd-p-6" fill="url(#bd-g3)" />
        </g>
        <g className="bd-dot" style={{ "--i": 4 } as CSSProperties}>
          <use href="#bd-p-7" fill="#6d7276" />
          <use href="#bd-p-7" fill="url(#bd-g0)" />
          <use href="#bd-p-7" fill="url(#bd-g1)" />
          <use href="#bd-p-7" fill="url(#bd-g2)" />
          <use href="#bd-p-7" fill="url(#bd-g3)" />
        </g>
        <g className="bd-dot" style={{ "--i": 7 } as CSSProperties}>
          <use href="#bd-p-8" fill="#6d7276" />
          <use href="#bd-p-8" fill="url(#bd-g0)" />
          <use href="#bd-p-8" fill="url(#bd-g1)" />
          <use href="#bd-p-8" fill="url(#bd-g2)" />
          <use href="#bd-p-8" fill="url(#bd-g3)" />
        </g>
        <g className="bd-dot" style={{ "--i": 3 } as CSSProperties}>
          <use href="#bd-p-9" fill="#6d7276" />
          <use href="#bd-p-9" fill="url(#bd-g0)" />
          <use href="#bd-p-9" fill="url(#bd-g1)" />
          <use href="#bd-p-9" fill="url(#bd-g2)" />
          <use href="#bd-p-9" fill="url(#bd-g3)" />
        </g>
    </svg>
  );
}
