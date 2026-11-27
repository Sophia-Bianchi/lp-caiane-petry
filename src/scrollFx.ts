// Efeitos de scroll no compositor.
//
// Onde o navegador tem scroll-timeline nativo (Chrome/Android, Safari 26+),
// parallax, janela que abre e saída do hero são animações CSS presas ao
// scroll: rodam junto com o dedo, sem esperar o JavaScript. É o que deixa o
// celular liso. Sem suporte (ex.: Firefox), o JS faz o mesmo cálculo.

const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const CSS_SCROLL_FX =
  !reduced &&
  typeof CSS !== "undefined" &&
  typeof CSS.supports === "function" &&
  CSS.supports("animation-timeline: view()");

export function markScrollFx() {
  if (CSS_SCROLL_FX) document.documentElement.dataset.scrollFx = "css";
}

// view() usa o ancestral com scroll mais próximo, e overflow:hidden conta
// como scroll. Troca hidden por clip (recorta igual, sem virar scroll) e
// preserva o que o hidden fazia de tabela: contexto de bloco e mínimo 0.
// Os valores dependem do breakpoint, então tudo é refeito ao redimensionar.

type Applied = { el: HTMLElement; props: string[] };

const subjects = new Set<HTMLElement>();
let applied: Applied[] = [];
let resizeTimer = 0;

function reset() {
  for (const { el, props } of applied) props.forEach((prop) => el.style.removeProperty(prop));
  applied = [];
}

function apply() {
  const seen = new Set<HTMLElement>();
  const reads: { el: HTMLElement; cs: CSSStyleDeclaration }[] = [];

  for (const subject of subjects) {
    if (!subject.isConnected) {
      subjects.delete(subject);
      continue;
    }
    let el = subject.parentElement;
    while (el && el !== document.body) {
      if (!seen.has(el)) {
        seen.add(el);
        reads.push({ el, cs: getComputedStyle(el) });
      }
      el = el.parentElement;
    }
  }

  // primeiro lê tudo, depois escreve (sem layout forçado no meio)
  const plan = reads
    .filter(({ cs }) => cs.overflowX === "hidden" || cs.overflowY === "hidden")
    .map(({ el, cs }) => {
      const set: [string, string][] = [];
      if (cs.overflowX === "hidden") set.push(["overflow-x", "clip"]);
      if (cs.overflowY === "hidden") set.push(["overflow-y", "clip"]);
      if (cs.display === "block") set.push(["display", "flow-root"]);
      if (cs.minWidth === "auto") set.push(["min-width", "0px"]);
      if (cs.minHeight === "auto") set.push(["min-height", "0px"]);
      return { el, set };
    });

  for (const { el, set } of plan) {
    set.forEach(([prop, value]) => el.style.setProperty(prop, value));
    applied.push({ el, props: set.map(([prop]) => prop) });
  }
}

function onResize() {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    reset();
    apply();
  }, 150);
}

export function unclipAncestors(list: Iterable<HTMLElement>) {
  if (!CSS_SCROLL_FX) return;
  if (subjects.size === 0) window.addEventListener("resize", onResize, { passive: true });
  for (const el of list) subjects.add(el);
  reset();
  apply();
}
