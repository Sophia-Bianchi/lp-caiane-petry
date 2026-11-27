import { useEffect } from "react";
import { EVENTO_ABERTURA } from "../interactions/eventos";

// Appear dos títulos: cada palavra sobe de dentro de uma máscara, em cascata.
// Só mexe em nós de texto (mantém <br> e elementos do React no lugar).
// O estado vai em data-*, nunca em class (o React reescreve className).

const SELECTOR = [
  ".hero-content h1",
  ".about-copy h2",
  ".differentials h2",
  ".alignment-section h2",
  ".treatments-intro h2",
  ".process-intro h2",
  ".diagnosis-copy h2",
  ".beauty-image-wrapper h2",
  ".start-diagnosis-center h2",
  ".blog-heading",
  ".blog-page-title",
  ".article-title",
  ".article-related-title",
  ".privacy-title",
].join(",");

function splitWords(el: HTMLElement) {
  if (el.dataset.titleSplit) return;
  el.dataset.titleSplit = "true";
  let index = 0;

  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? "";
        if (!text.trim()) continue;
        const fragment = document.createDocumentFragment();
        for (const part of text.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(" "));
            continue;
          }
          const outer = document.createElement("span");
          outer.className = "tw";
          const inner = document.createElement("span");
          inner.className = "tw-i";
          inner.textContent = part;
          inner.style.setProperty("--w", String(index++));
          outer.appendChild(inner);
          fragment.appendChild(outer);
        }
        node.replaceChild(fragment, child);
      } else if (
        child.nodeType === Node.ELEMENT_NODE &&
        (child as HTMLElement).tagName !== "BR"
      ) {
        walk(child);
      }
    }
  };

  walk(el);
}

function aberturaPronta() {
  return document.documentElement.dataset.abertura === "pronta";
}

export function useTitleReveal(page: string) {
  useEffect(() => {
    const titles = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    titles.forEach(splitWords);

    const show = (el: HTMLElement) => {
      el.dataset.titleIn = "true";
    };

    if (reduced) {
      titles.forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          // o título do hero espera a abertura terminar
          if (el.matches(".hero-content h1") && !aberturaPronta()) continue;
          show(el);
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    titles
      .filter((el) => el.dataset.titleIn !== "true")
      .forEach((el) => observer.observe(el));

    const onAbertura = () => {
      const hero = document.querySelector<HTMLElement>(".hero-content h1");
      if (hero) show(hero);
      // foto do hero assenta e o texto de apoio entra depois do título
      document.querySelector<HTMLElement>(".hero")?.setAttribute("data-hero-in", "true");
    };
    window.addEventListener(EVENTO_ABERTURA, onAbertura);
    if (aberturaPronta()) onAbertura();

    return () => {
      observer.disconnect();
      window.removeEventListener(EVENTO_ABERTURA, onAbertura);
    };
  }, [page]);
}
