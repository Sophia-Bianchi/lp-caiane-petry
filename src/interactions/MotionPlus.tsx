import { useEffect } from "react";
import { CSS_SCROLL_FX, unclipAncestors } from "../scrollFx";

// Motor do /interactions. Métodos tirados das referências (Red Dot Tours,
// Cocoon, Sobha, OSI Storia):
//  1. foto que abre: a moldura fica no tamanho do Figma e a foto desfaz o
//     zoom dentro dela (1.25 → 1). Só transform: nada de clip-path, que
//     repintava a foto inteira a cada frame e travava o celular.
//  2. cards do diagnóstico afundam (scale .92 + véu) quando o próximo cobre
//  3. listas com foco: o texto da linha no meio da tela desliza (cores do Figma)
//  4. frase-manifesto: palavras acendem de .14 → 1 conforme rola
//  5. hero: o texto sobe e some mais rápido que a página
//  6. header some ao descer e volta ao subir
//  7. cursor "Ver" nos cards (só com mouse)
//
// Com scroll-timeline nativo (CSS_SCROLL_FX), 1 e 5 são CSS puro
// (motion-plus.css) e rodam no compositor. O resto é JS, mas só mexe no que
// está na tela e lê todas as medidas antes de escrever qualquer valor.

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

const WINDOW_SELECTOR = [
  ".about-small-image",
  ".about-large-image",
  ".alignment-image",
  ".editorial-duo-gray",
  ".editorial-duo-color",
  ".clinic-location-image",
  ".diag-photo",
  ".blog-card-image",
].join(",");

const FOCUS_SELECTOR = ".differential-row, .formation-row";

export function MotionPlus() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = "plus";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      return () => {
        delete root.dataset.motion;
      };
    }

    const header = document.querySelector<HTMLElement>(".site-header");
    const heroContent = document.querySelector<HTMLElement>(".hero-content");
    const windows = Array.from(document.querySelectorAll<HTMLElement>(WINDOW_SELECTOR));
    const stack = Array.from(document.querySelectorAll<HTMLElement>(".diagnosis-stack-card"));
    const focus = Array.from(document.querySelectorAll<HTMLElement>(FOCUS_SELECTOR));
    const statement = document.querySelector<HTMLElement>(".process-intro h2");

    if (CSS_SCROLL_FX) unclipAncestors(windows);

    // o que está perto da tela
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        schedule();
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    if (!CSS_SCROLL_FX) windows.forEach((el) => io.observe(el));
    stack.forEach((el) => io.observe(el));
    focus.forEach((el) => io.observe(el));
    if (statement) io.observe(statement);

    let frame = 0;
    let lastY = window.scrollY;
    let headerHidden = false;
    let words: HTMLElement[] = [];

    const update = () => {
      frame = 0;
      const vh = window.innerHeight || 1;
      const y = window.scrollY;

      // ---------- 1) leituras ----------
      const winTops = CSS_SCROLL_FX
        ? []
        : windows.filter((el) => visible.has(el)).map((el) => ({ el, top: el.getBoundingClientRect().top }));

      const stackRects: { card: HTMLElement; p: number }[] = [];
      stack.forEach((card, i) => {
        const next = stack[i + 1];
        if (!next || !(visible.has(card) || visible.has(next))) return;
        const cr = card.getBoundingClientRect();
        const nr = next.getBoundingClientRect();
        // 0 quando o próximo ainda está embaixo, 1 quando já cobriu
        stackRects.push({ card, p: clamp((cr.bottom - nr.top) / Math.max(1, cr.height)) });
      });

      const mid = vh * 0.5;
      const focusVals = focus
        .filter((row) => visible.has(row))
        .map((row) => {
          const r = row.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - mid);
          return { row, v: clamp(1 - d / (vh * 0.22)) };
        });

      let statementP = -1;
      if (statement && visible.has(statement)) {
        statementP = clamp((vh * 0.85 - statement.getBoundingClientRect().top) / (vh * 0.55));
      }

      // ---------- 2) escritas ----------
      for (const { el, top } of winTops) {
        const p = easeOut(clamp((vh - top) / (vh * 0.55)));
        el.style.setProperty("--win-k", (1.25 - 0.25 * p).toFixed(4));
      }

      for (const { card, p } of stackRects) card.style.setProperty("--sink", p.toFixed(4));

      for (const { row, v } of focusVals) row.style.setProperty("--focus", v.toFixed(3));

      if (statement && statementP >= 0) {
        if (!words.length) words = Array.from(statement.querySelectorAll<HTMLElement>(".tw-i"));
        const lit = statementP * words.length;
        words.forEach((w, i) => {
          w.style.opacity = String(0.14 + 0.86 * clamp(lit - i));
        });
      }

      if (heroContent && !CSS_SCROLL_FX && y < vh * 1.2) {
        const p = clamp(y / (vh * 0.8));
        heroContent.style.transform = `translate3d(0, ${(-p * 90).toFixed(2)}px, 0)`;
        heroContent.style.opacity = String(1 - p * 0.9);
      }

      // header some ao descer, volta ao subir
      if (header) {
        const goingDown = y > lastY + 2;
        const goingUp = y < lastY - 2;
        if (goingDown && y > 240 && !headerHidden) {
          headerHidden = true;
          header.dataset.hidden = "true";
        } else if ((goingUp || y < 120) && headerHidden) {
          headerHidden = false;
          header.dataset.hidden = "false";
        }
      }
      lastY = y;
    };

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    // 7. cursor "Ver" (só com mouse fino)
    const fine = window.matchMedia("(pointer: fine)").matches;
    let cursor: HTMLDivElement | null = null;
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;
    let cursorFrame = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = (e.target as HTMLElement | null)?.closest?.(
        ".treatment-card:not(.is-open), .blog-card",
      );
      if (cursor) {
        cursor.dataset.on = target ? "true" : "false";
        cursor.textContent = target?.classList.contains("blog-card") ? "Ler" : "Ver";
      }
      if (!cursorFrame) cursorFrame = requestAnimationFrame(loopCursor);
    };
    const loopCursor = () => {
      cursorFrame = 0;
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      if (cursor) cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) {
        cursorFrame = requestAnimationFrame(loopCursor);
      }
    };
    if (fine) {
      cursor = document.createElement("div");
      cursor.className = "plus-cursor";
      cursor.setAttribute("aria-hidden", "true");
      cursor.textContent = "Ver";
      document.body.appendChild(cursor);
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
      if (cursorFrame) cancelAnimationFrame(cursorFrame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onMove);
      cursor?.remove();
      delete root.dataset.motion;
      if (header) delete header.dataset.hidden;
      if (heroContent) {
        heroContent.style.transform = "";
        heroContent.style.opacity = "";
      }
      windows.forEach((el) => {
        el.style.removeProperty("--win-k");
      });
    };
  }, []);

  return null;
}
