import { useEffect, useRef, useState, type CSSProperties } from "react";

export function Abertura() {
  const [phase, setPhase] = useState<"entering" | "leaving" | "done">("entering");
  const [logoSrc, setLogoSrc] = useState("/assets/LogoAbertura.png");
  const splashRef = useRef<HTMLDivElement | null>(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const leaveTimer = window.setTimeout(() => {
      setPhase("leaving");
    }, 3200);

    const doneTimer = window.setTimeout(() => {
      document.body.style.overflow = prevOverflow;
      setPhase("done");
    }, 4100);

    timersRef.current = [leaveTimer, doneTimer];

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    if (phase === "done") return;

    const el = splashRef.current;
    if (!el) return;

    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;
    let frameId = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / (innerWidth || 1)) * 100;
      targetY = (e.clientY / (innerHeight || 1)) * 100;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      el.style.setProperty("--mx", `${currentX.toFixed(2)}%`);
      el.style.setProperty("--my", `${currentY.toFixed(2)}%`);
      el.style.setProperty("--px", `${((currentX - 50) * 0.35).toFixed(2)}px`);
      el.style.setProperty("--py", `${((currentY - 50) * 0.35).toFixed(2)}px`);

      frameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.cancelAnimationFrame(frameId);
    };
  }, [phase]);

  if (phase === "done") {
    return null;
  }

  const initialVars = {
    "--mx": "50%",
    "--my": "50%",
    "--px": "0px",
    "--py": "0px",
  } as CSSProperties;

  return (
    <div
      ref={splashRef}
      style={initialVars}
      className={`abertura-splash ${phase === "leaving" ? "is-leaving" : ""}`}
      role="dialog"
      aria-label="Tela de abertura Caiane Petry"
    >
      <div className="abertura-gradient-canvas" aria-hidden="true">
        <span className="abertura-orb abertura-orb-slate" />
        <span className="abertura-orb abertura-orb-taupe" />
        <span className="abertura-cursor-spotlight" />
        <span className="abertura-grain" />
      </div>

      <div className="abertura-content">
        <h1 className="abertura-title">CAIANE PETRY</h1>

        <p className="abertura-subtitle">
          SCIENCE-LED
          <br />
          NATURALLY BEAUTIFUL.
        </p>

        <div className="abertura-mark-row">
          <span className="abertura-pillar">FUNCTION</span>
          <img
            src={logoSrc}
            alt="Logo Caiane Petry"
            className="abertura-logo-mark"
            onError={() => {
              if (logoSrc.endsWith(".png")) {
                setLogoSrc("/assets/Group.png");
              }
            }}
          />
          <span className="abertura-pillar">HARMONY</span>
        </div>
      </div>
    </div>
  );
}