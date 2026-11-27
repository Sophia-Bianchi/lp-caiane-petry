import { useEffect, useRef, useState, type CSSProperties } from "react";
import { LogoMarkDots } from "../components/Icons";
import { EVENTO_ABERTURA } from "./eventos";
import { pauseScroll, resumeScroll } from "../components/SmoothScroll";
import { EntranceFunction, EntranceHarmony, EntranceSubtitle, EntranceTitle } from "./EntranceType";

// Entrada do site (método da Carrera, adaptado):
// 1) as bolinhas do símbolo entram girando, uma a uma, até formar o logo;
// 2) nome, frase e FUNCTION / HARMONY entram em cascata;
// 3) o símbolo voa até o logo do header enquanto o fundo se dissolve.
// Roda só na primeira visita da sessão e fica montada uma vez no app:
// trocar de tela (blog, artigo) nunca repete a entrada.

const SESSION_KEY = "cp-entrada-vista";

const T = {
  dotsAt: 120,
  titleAt: 700,
  subtitleAt: 1200,
  pillarsAt: 1450,
  exitAt: 2750,
  morph: 950,
  overlayOut: 650,
};

const MORPH_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

type Phase = "idle" | "dots" | "title" | "subtitle" | "pillars" | "exit";
const ORDER: Phase[] = ["idle", "dots", "title", "subtitle", "pillars", "exit"];

function jaViu() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function marcaVista() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* storage bloqueado: segue sem lembrar */
  }
}

// libera o resto do site (títulos do hero, sequência do hero)
function concluiEntrada() {
  document.documentElement.dataset.abertura = "pronta";
  window.dispatchEvent(new Event(EVENTO_ABERTURA));
}

export function EntrancePlus() {
  const [visible, setVisible] = useState(() => !jaViu());
  const [phase, setPhase] = useState<Phase>("idle");
  const [morph, setMorph] = useState<string>();
  const markRef = useRef<HTMLDivElement | null>(null);
  const skip = useRef(!visible);

  useEffect(() => {
    if (skip.current) {
      concluiEntrada();
      return;
    }

    delete document.documentElement.dataset.abertura;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const headerMark = document.querySelector<HTMLElement>(".site-header .brand-mark");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    pauseScroll();
    if (headerMark) headerMark.style.opacity = "0";

    // devolve o que a entrada travou (rodar duas vezes não faz mal)
    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      if (headerMark) headerMark.style.opacity = "";
      document.body.style.overflow = prevOverflow;
      resumeScroll();
    };
    const finish = () => {
      restore();
      setVisible(false);
    };

    if (reduced) {
      const id = window.setTimeout(() => {
        marcaVista();
        concluiEntrada();
        finish();
      }, 300);
      return () => {
        window.clearTimeout(id);
        restore();
      };
    }

    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    at(T.dotsAt, () => setPhase("dots"));
    at(T.titleAt, () => setPhase("title"));
    at(T.subtitleAt, () => setPhase("subtitle"));
    at(T.pillarsAt, () => setPhase("pillars"));
    at(T.exitAt, () => {
      marcaVista();
      const from = markRef.current?.getBoundingClientRect();
      const to = headerMark?.getBoundingClientRect();
      if (from && to && to.width > 0) {
        setMorph(
          `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width})`,
        );
      }
      setPhase("exit");
    });
    // o site começa a se montar enquanto o símbolo ainda está voando
    at(T.exitAt + 250, concluiEntrada);
    at(T.exitAt + T.morph, finish);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      restore();
    };
  }, []);

  if (!visible) return null;

  const reached = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p);
  const exiting = phase === "exit";

  return (
    <div
      className={`entrada-plus ${exiting ? "is-exiting" : ""}`}
      aria-hidden="true"
      style={{ "--overlay-out": `${T.overlayOut}ms` } as CSSProperties}
    >
      <div className="entrada-plus-bg" />

      {/* proporções do frame de abertura do Figma (1440): o bloco tem a
          largura do nome (503,65px) e o resto é medido em cqw a partir dele */}
      <div className="entrada-plus-content">
        <EntranceTitle className={`entrada-plus-title ${reached("title") ? "is-in" : ""}`} />

        <EntranceSubtitle
          className={`entrada-plus-subtitle ${reached("subtitle") ? "is-in" : ""}`}
        />

        <div className="entrada-plus-row">
          <EntranceFunction
            className={`ep-pillar ep-pillar-left ${reached("pillars") ? "is-in" : ""}`}
          />

          <div
            ref={markRef}
            className={`ep-mark ${reached("dots") ? "is-in" : ""}`}
            style={
              {
                transform: morph,
                transformOrigin: "0 0",
                transition: morph
                  ? `transform ${T.morph}ms ${MORPH_EASE}, color ${T.morph}ms ${MORPH_EASE}`
                  : undefined,
                color: morph ? "#2d3945" : undefined,
              } as CSSProperties
            }
          >
            <LogoMarkDots className="ep-dots" />
          </div>

          <EntranceHarmony
            className={`ep-pillar ep-pillar-right ${reached("pillars") ? "is-in" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}
