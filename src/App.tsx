import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import "./App.css";
import { LogoMark, LogoWordmark, WhatsAppButtonIcon } from "./components/Icons";
import {
  SmoothScroll,
  getLenis,
  pauseScroll,
  resumeScroll,
  scrollToY,
} from "./components/SmoothScroll";
import { useTitleReveal } from "./components/TitleReveal";
import { BeautyDots } from "./components/BeautyDots";
import { EntrancePlus } from "./interactions/EntrancePlus";
import { MotionPlus } from "./interactions/MotionPlus";
import "./interactions/motion-plus.css";

import { CSS_SCROLL_FX, unclipAncestors } from "./scrollFx";
import { EVENTO_ABERTURA } from "./interactions/eventos";
import {
  BlogArticlePage,
  BlogCard,
  BlogListPage,
  blogPosts,
} from "./components/BlogPages";

export type Page = "home" | "privacidade" | "blog" | "artigo";


// Rotas: /blog (listagem), /blog/:slug (artigo), #politica-de-privacidade.
function pageFromLocation(): Page {
  if (window.location.hash === "#politica-de-privacidade") return "privacidade";
  const path = window.location.pathname.replace(/\/+$/, "");
  if (path === "/blog") return "blog";
  if (path.startsWith("/blog/")) return "artigo";
  return "home";
}
import { Cookies } from "./components/Cookies";
import { PoliticaPrivacidade } from "./components/PoliticaPrivacidade";
import { Footer } from "./components/Footer";

const ASSETS = "/img/";

const WHATSAPP_URL = "https://wa.me/5548991545528";

const differentials = [
  "Crescimento e desenvolvimento facial",
  "Função e oclusão",
  "Estética do sorriso",
  "Longevidade dos resultados",
];

const formations = [
  {
    code: "[ 01 ]",
    title: "Ortodontia (adolescentes e adultos), incluindo Invisalign",
  },
  {
    code: "[ 02 ]",
    title: "Ortopedia Funcional dos Maxilares (desde os primeiros meses de vida)",
  },
  {
    code: "[ 03 ]",
    title: "Refinamento Estético do Sorriso",
  },
  {
    code: "[ 04 ]",
    title: "Profilaxia e prevenção",
  },
];


type Treatment = {
  title: string;
  image: string;
  expandedImage?: string;
  description: string;
};

const treatments: Treatment[] = [
  {
    title: "Ortodontia",
    image: "tratamento-ortodontia.webp",
    expandedImage: "tratamento-ortodontia-aberta.webp",
    description:
      "Tratamentos ortodônticos para adolescentes e adultos, planejados a partir de um diagnóstico que considera não apenas a posição dos dentes, mas também função, oclusão, estética do sorriso e harmonia facial. Utilizamos recursos digitais avançados e diferentes possibilidades terapêuticas, incluindo Invisalign, buscando resultados precisos, naturais e estáveis.",
  },
  {
    title: "Ortopedia Funcional dos Maxilares",
    image: "tratamento-ortopedia.webp",
    expandedImage: "tratamento-ortopedia-aberta.webp",
    description:
      "Acompanhamos o desenvolvimento dentofacial de bebês, crianças e adolescentes com abordagens ortopédicas individualizadas, identificando e tratando precocemente alterações na face, arcadas e oclusão. Sem idade mínima: atendemos desde os primeiros meses de vida, incluindo bebês com síndrome de Down a partir dos 2 meses.",
  },
  {
    title: "Refinamento Estético do Sorriso",
    image: "tratamento-refinamento.webp",
    expandedImage: "tratamento-refinamento-aberta.webp",
    description:
      "A plastia do sorriso vai além do alinhamento para devolver forma, proporção, função e naturalidade. Por meio de intervenções conservadoras em resina, aprimoramos contornos e pequenos detalhes que fazem diferença na harmonia do conjunto. Uma estética delicada e individualizada, que preserva a estrutura dental para valorizar o que já é naturalmente seu.",
  },
  {
    title: "Profilaxia & Prevenção",
    image: "tratamento-profilaxia.webp",
    expandedImage: "tratamento-profilaxia-aberta.webp",
    description:
      "Saúde e cuidado para preservar resultados ao longo da vida. Mais do que uma limpeza profissional, a profilaxia une prevenção e avaliação periódica com o apoio da tecnologia. Assim, identificamos alterações precocemente para proteger dentes, gengivas e a longevidade dos tratamentos estéticos e ortodônticos.",
  },
];

type DiagnosisStep = {
  title: string;
  description: string;
  image: string;
  backgroundColor: string;
};

const diagnosisSteps: DiagnosisStep[] = [
  {
    title: "Diagnóstico personalizado",
    description:
      "Tudo começa por uma avaliação criteriosa. Analisamos proporções, função, oclusão, relação dos dentes com a face e o potencial de crescimento, quando indicado. É esse entendimento que define o caminho, e não o contrário.",
    image: "diag-personalizado.webp",
    backgroundColor: "#2D3945",
  },
  {
    title: "Planejamento digital",
    description:
      "O planejamento digital permite visualizar o tratamento antes de iniciá-lo, tornando o processo mais previsível, preciso e transparente para o paciente.",
    image: "diag-planejamento.webp",
    backgroundColor: "#665E54",
  },
  {
    title: "Tecnologia",
    description:
      "Recursos como iTero 5D, planejamento digital, fotografia clínica e Invisalign permitem tratamentos cada vez mais precisos, previsíveis e minimamente invasivos.",
    image: "diag-tecnologia.webp",
    backgroundColor: "#5A6B7B",
  },
  {
    title: "Naturalidade e precisão",
    description:
      "A tecnologia está a serviço de um resultado que respeita a anatomia e a individualidade de cada paciente. Nosso objetivo é um sorriso que funcione bem, seja elegante e pareça sempre ter sido seu.",
    image: "diag-naturalidade.webp",
    backgroundColor: "#2D3945",
  },
];

type AssetImageProps = {
  fileName: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  loading?: "eager" | "lazy";
  dataParallax?: boolean;
  dataParallaxSpeed?: string;
  dataReveal?: boolean;
};

// Imagens otimizadas (WebP, 2x) ficam em /public/img. Lazy por padrão:
// só baixa quando a seção chega perto da tela.
function AssetImage({
  fileName,
  alt,
  className,
  style,
  loading = "lazy",
  dataParallax,
  dataParallaxSpeed,
  dataReveal,
}: AssetImageProps) {
  return (
    <img
      src={`${ASSETS}${fileName}`}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding="async"
      {...(dataParallax ? { "data-parallax": "" } : {})}
      {...(dataParallaxSpeed ? { "data-parallax-speed": dataParallaxSpeed } : {})}
      {...(dataReveal ? { "data-reveal": "" } : {})}
    />
  );
}


// No mobile o Figma mostra os 4 tratamentos sempre abertos.
function useIsMobile(query = "(max-width: 768px)") {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

// Folga do parallax: a foto fica em scale 1.08 (4% de sobra de cada lado,
// enquadramento quase igual ao Figma) e anda até 3,5% da altura. O fundo do
// hero não tem essa folga de escala e mantém o deslocamento pela velocidade.
function parallaxAmplitude(element: HTMLElement): number {
  if (element.classList.contains("parallax-media-contain")) return 0.018;
  if (element.classList.contains("parallax-media")) return 0.035;
  return Math.min(0.09, Number(element.dataset.parallaxSpeed ?? "0.08") * 0.9);
}

function parallaxOffset(box: DOMRect, viewportHeight: number, amplitude: number): number {
  const progress = Math.min(
    1,
    Math.max(0, (viewportHeight - box.top) / (viewportHeight + box.height)),
  );
  return (progress - 0.5) * 2 * amplitude * box.height;
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // menu mobile aberto trava o scroll suave por trás
  useEffect(() => {
    if (!isMenuOpen) return;
    pauseScroll();
    return () => resumeScroll();
  }, [isMenuOpen]);

  const [activeTreatment, setActiveTreatment] = useState<number>(0);
  const [manualSelectionUntil, setManualSelectionUntil] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<Page>(pageFromLocation);
  // camada de motion (entrada, fotos que abrem, listas, header) só na home
  const isPlus = currentPage === "home";
  useTitleReveal(currentPage);

  // Depois da entrada, com o navegador ocioso, baixa e decodifica as fotos
  // da página uma a uma: o primeiro contato com cada seção não paga mais o
  // custo de decodificar a imagem no meio do scroll.
  useEffect(() => {
    let cancelled = false;
    const idle = (fn: () => void) => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(fn, { timeout: 1500 });
      } else {
        setTimeout(fn, 200);
      }
    };

    const warm = async () => {
      const images = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
      for (const img of images) {
        if (cancelled) return;
        if (img.loading === "lazy") img.loading = "eager";
        try {
          await img.decode();
        } catch {
          /* imagem quebrada ou trocada: segue */
        }
      }
    };

    const start = () => idle(() => void warm());
    if (document.documentElement.dataset.abertura === "pronta") start();
    else window.addEventListener(EVENTO_ABERTURA, start, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener(EVENTO_ABERTURA, start);
    };
  }, [currentPage]);

  useEffect(() => {
    const syncRouteFromHash = () => {
      setCurrentPage(pageFromLocation());
    };

    window.addEventListener("hashchange", syncRouteFromHash);
    window.addEventListener("popstate", syncRouteFromHash);
    return () => {
      window.removeEventListener("hashchange", syncRouteFromHash);
      window.removeEventListener("popstate", syncRouteFromHash);
    };
  }, []);

  useEffect(() => {
    if (currentPage === "privacidade") return;

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    // primeiro mede tudo, depois marca (sem layout forçado a cada item)
    const revealVisibleElements = () => {
      const viewportHeight = window.innerHeight || 900;
      const due = elements.filter(
        (element) =>
          !element.classList.contains("is-visible") &&
          element.getBoundingClientRect().top <= viewportHeight + 120,
      );
      due.forEach((element) => element.classList.add("is-visible"));
    };

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "120px 0px 120px 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));
    revealVisibleElements();

    return () => {
      observer.disconnect();
    };
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === "privacidade") return;

    const all = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (all.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      all.forEach((el) => el.style.setProperty("--parallax-y", "0px"));
      return;
    }

    // com scroll-timeline nativo, as fotos ficam no CSS; o JS só cuida do
    // fundo do hero (e no celular nem dele: lá o fundo é fixo)
    if (CSS_SCROLL_FX) {
      unclipAncestors(document.querySelectorAll<HTMLElement>(".parallax-media"));
    }
    const compact = () => window.innerWidth <= 768;
    const handled = all.filter((el) => {
      if (CSS_SCROLL_FX && el.classList.contains("parallax-media")) return false;
      return true;
    });
    if (handled.length === 0) return;

    // só mexe no que está perto da tela
    const active = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) active.add(el);
          else active.delete(el);
        });
        scheduleUpdate();
      },
      { rootMargin: "25% 0px 25% 0px" },
    );
    handled.forEach((el) => io.observe(el));

    let frameId = 0;

    const updateParallax = () => {
      frameId = 0;
      const viewportHeight = window.innerHeight || 1;
      const isCompact = compact();
      const items = Array.from(active).filter(
        (el) => !(isCompact && el.classList.contains("hero-bg")),
      );
      // 1) lê todas as medidas  2) escreve todos os valores
      const boxes = items.map((el) => (el.parentElement ?? el).getBoundingClientRect());
      items.forEach((el, index) => {
        const offset = parallaxOffset(boxes[index], viewportHeight, parallaxAmplitude(el));
        el.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
      });
    };

    function scheduleUpdate() {
      if (!frameId) frameId = window.requestAnimationFrame(updateParallax);
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      io.disconnect();
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [currentPage]);

  useEffect(() => {
    if (currentPage !== "home") return;

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(".treatment-card"),
    );

    if (cards.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    let frameId = 0;

    const syncMobileActiveCardByScroll = () => {
      frameId = 0;
      if (window.innerWidth > 768) return;
      if (Date.now() < manualSelectionUntil) return;

      const viewportCenter = window.innerHeight * 0.5;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveTreatment((prev) => (prev === closestIndex ? prev : closestIndex));
    };

    const scheduleCardSync = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(syncMobileActiveCardByScroll);
      }
    };

    syncMobileActiveCardByScroll();

    window.addEventListener("scroll", scheduleCardSync, { passive: true });
    window.addEventListener("resize", scheduleCardSync, { passive: true });

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", scheduleCardSync);
      window.removeEventListener("resize", scheduleCardSync);
    };
  }, [currentPage, manualSelectionUntil]);

  const closeMenu = () => setIsMenuOpen(false);

  const openPrivacyPolicy = () => {
    closeMenu();
    setCurrentPage("privacidade");
    window.history.pushState(null, "", "#politica-de-privacidade");
    scrollToY(0, false);
  };

  const navigateTo = (path: string, event?: MouseEvent<HTMLAnchorElement>) => {
    if (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
    }
    closeMenu();
    window.history.pushState(null, "", path);
    setCurrentPage(pageFromLocation());
    scrollToY(0, false);
  };

  const navigateToHomeSection = (
    sectionHash: string,
    event?: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (event) {
      event.preventDefault();
    }
    closeMenu();

    const scrollToTarget = () => {
      if (sectionHash === "#inicio") {
        scrollToY(0);
        return;
      }
      const target = document.querySelector<HTMLElement>(sectionHash);
      if (!target) return;
      const header = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 64;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset: -header, force: true });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (currentPage !== "home") {
      setCurrentPage("home");
      window.history.pushState(null, "", `/${sectionHash}`);
      window.setTimeout(scrollToTarget, 60);
      return;
    }

    window.history.pushState(null, "", `/${sectionHash}`);
    scrollToTarget();
  };

  const handleCardClick = (index: number) => {
    if (isMobile) return;
    if (window.innerWidth <= 768) {
      setManualSelectionUntil(Date.now() + 900);
      setActiveTreatment((prev) => (prev === index ? -1 : index));
      return;
    }
    setActiveTreatment(index);
  };

  const parallaxStyle = (offsetPx = "0px"): CSSProperties =>
    ({ "--parallax-y": offsetPx }) as CSSProperties;

  return (
    <div className="page-shell">
      <SmoothScroll />
      {/* entrada montada uma única vez: trocar de tela nunca repete */}
      <EntrancePlus />
      {isPlus && <MotionPlus />}

      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href={"/#inicio"}
            aria-label="Caiane Petry - Início"
            onClick={(event) => navigateToHomeSection("#inicio", event)}
          >
            <LogoMark className="brand-mark" />
            <LogoWordmark className="brand-wordmark" />
          </a>

          <nav
            id="mobile-navigation"
            className={`main-nav ${isMenuOpen ? "is-open" : ""}`}
            aria-label="Navegação principal"
          >
            <a
              href={"/#inicio"}
              onClick={(event) => navigateToHomeSection("#inicio", event)}
            >
              Início
            </a>
            <a
              href={"/#sobre"}
              onClick={(event) => navigateToHomeSection("#sobre", event)}
            >
              Sobre
            </a>
            <a
              href={"/#tratamentos"}
              onClick={(event) => navigateToHomeSection("#tratamentos", event)}
            >
              Tratamentos
            </a>
            <a
              href={"/#tecnologia"}
              onClick={(event) => navigateToHomeSection("#tecnologia", event)}
            >
              Tecnologia
            </a>
            <a
              href="/blog"
              onClick={(event) => navigateTo("/blog", event)}
            >
              Blog
            </a>

            <a
              className="button button-dark mobile-menu-cta"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
            >
              Agendar consulta
            </a>
          </nav>

          <a
            className="button button-dark header-cta"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
          >
            Agendar consulta
          </a>

          <button
            className={`mobile-menu-button ${isMenuOpen ? "is-open" : ""}`}
            type="button"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? (
              <span className="mobile-menu-close-icon" aria-hidden="true">
                ×
              </span>
            ) : (
              <span className="hamburger-lines" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            )}
          </button>
        </div>
      </header>

      {currentPage === "privacidade" ? (
        <PoliticaPrivacidade />
      ) : currentPage === "blog" ? (
        <BlogListPage onNavigate={navigateTo} />
      ) : currentPage === "artigo" ? (
        <BlogArticlePage onNavigate={navigateTo} />
      ) : (
        <main>
          <section className="hero" id="inicio">
            <div
              className="hero-bg"
              data-parallax
              data-parallax-speed="0.08"
              style={parallaxStyle("0px")}
              aria-hidden="true"
            />

            <div className="hero-content">
              <h1>
                Odontologia <br className="br-mobile" />
                que une função, saúde e beleza em cada fase da vida.
              </h1>

              <p>
                Ortodontia, Ortopedia Funcional dos Maxilares e Refinamento
                Estético do Sorriso, conduzidos por um diagnóstico
                individualizado e recursos digitais avançados. O resultado que
                buscamos não é apenas ter dentes alinhados, mas um sorriso
                funcional, natural, elegante e integrado à face.
              </p>

              <div className="hero-actions">
                <a
                  className="button button-dark"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Agendar avaliação
                </a>

                <a
                  className="button button-outline"
                  href={"/#tratamentos"}
                  onClick={(event) =>
                    navigateToHomeSection("#tratamentos", event)
                  }
                >
                  Conhecer os tratamentos
                </a>
              </div>
            </div>
          </section>

          <section className="about-section" id="sobre">
            <div className="about-top">
              <div className="about-left">
                <div className="about-small-image" data-reveal>
                  <AssetImage
                    fileName="sobre-pedras.webp"
                    loading="eager"
                    alt="Detalhe de pedras em composição natural"
                    className="parallax-media"
                    dataParallax
                    dataParallaxSpeed="0.07"
                    style={parallaxStyle("0px")}
                  />
                </div>

                <span className="eyebrow" data-reveal>
                  Função gera beleza.
                </span>

                <div className="about-copy" data-reveal>
                  <h2>
                    O sorriso vai
                    <br />
                    além dos dentes.
                  </h2>

                  <p>
                    Na odontologia da Dra. Caiane Petry, o sorriso é resultado
                    do equilíbrio entre função, saúde, forma e beleza. E deve
                    estar em harmonia com a face, com cada fase da vida e,
                    sobretudo, com a individualidade de cada pessoa. Por isso,
                    antes de movimentar um dente ou transformar um sorriso,
                    buscamos compreender suas proporções, sua função, sua
                    relação com a face e aquilo que pode ser preservado,
                    desenvolvido ou aprimorado. Acreditamos que os melhores
                    resultados não são aqueles que parecem feitos, mas aqueles
                    que parecem sempre ter pertencido aquela pessoa.
                  </p>
                </div>
              </div>

              <div className="about-large-image" data-reveal>
                <AssetImage
                  fileName="sobre-sorriso.webp"
                    loading="eager"
                  alt="Sorriso natural em harmonia com a face"
                  className="parallax-media"
                  dataParallax
                  dataParallaxSpeed="0.1"
                  style={parallaxStyle("0px")}
                />
              </div>
            </div>

            <div className="differentials">
              <h2 data-reveal>
                Nosso diferencial está em um diagnóstico individualizado que vai
                além do alinhamento e considera:
              </h2>

              <div className="differential-list" data-reveal>
                {differentials.map((item, index) => (
                  <div className="differential-row" key={item}>
                    <span className="differential-number">
                      [ {String(index + 1).padStart(2, "0")} ]
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="approach-feature" id="tecnologia">
            <div className="approach-image" data-reveal>
              <AssetImage
                fileName="abordagem-ortopedia.webp"
                alt="Imagem ilustrativa de ortopedia funcional"
                className="parallax-media parallax-media-contain"
                dataParallax
                dataParallaxSpeed="0.06"
                style={parallaxStyle("0px")}
              />
            </div>

            <div className="approach-panel">
              <p data-reveal>
                Integramos Ortodontia, Ortopedia Funcional dos Maxilares e
                
                Refinamento Estético em uma única visão, para que cada etapa
                
                do cuidado converse com a anterior e prepare a próxima.
              </p>
            </div>
          </section>

          <section className="individual-care" data-reveal>
            <p>
              Cada paciente chega com uma história, uma face e objetivos
              próprios. Por isso, nenhum tratamento começa igual ao outro: todos
              partem de um diagnóstico criterioso e são planejados respeitando
              as características, as necessidades e o momento de vida de cada
              pessoa. Esse cuidado acompanha todas as idades. Não há idade
              mínima para o acompanhamento: a Dra. Caiane atende bebês a partir
              dos 2 meses de vida e crianças que precisam de um cuidado adaptado
              às suas particularidades, sempre com um olhar atento e acolhedor
              para cada criança e sua família.
            </p>
          </section>

          <section className="alignment-section">
            <div className="alignment-image" data-reveal>
              <AssetImage
                fileName="alinhar-dentes.webp"
                alt="Imagem relacionada ao alinhamento dos dentes"
                className="parallax-media"
                dataParallax
                dataParallaxSpeed="0.08"
                style={parallaxStyle("0px")}
              />
            </div>

            <h2 data-reveal>
              Mais do que alinhar
              <br />
              dentes, construímos
              <br />
              sorrisos funcionais,
              <br />
              naturais, elegantes
              <br />e duradouros.
            </h2>
          </section>

          <section className="treatments-section" id="tratamentos">
            <div className="treatments-intro" data-reveal>
              <h2>
                Cuidado para cada
                <br />
                fase do sorriso.
              </h2>
              <p>
                Dos primeiros meses de vida à vida adulta, a clínica acompanha o
                sorriso em suas diferentes fases, com o tratamento certo no
                momento certo.
              </p>
            </div>

            <div
              className="treatment-grid"
              data-reveal
              onMouseLeave={() => {
                if (window.innerWidth > 768) {
                  setActiveTreatment(0);
                }
              }}
            >
            {treatments.map((treatment, index) => {
  const isOpen = isMobile || activeTreatment === index;

  return (
                  <article
                    key={treatment.title}
                    className={`treatment-card ${isOpen ? "is-open" : ""}`}
                    onMouseEnter={() => {
                      if (window.innerWidth > 768) {
                        setActiveTreatment(index);
                      }
                    }}
                    onClick={() => handleCardClick(index)}
                    onFocus={() => setActiveTreatment(index)}
                    tabIndex={0}
                    aria-expanded={isOpen}
                  >
                    {/* as duas imagens ficam montadas e fazem crossfade
                        (trocar o src no hover piscava) */}
                    <AssetImage
                      fileName={treatment.image}
                      alt=""
                      className="treatment-image parallax-media"
                      dataParallax
                      dataParallaxSpeed="0.06"
                      style={parallaxStyle("0px")}
                    />
                    {treatment.expandedImage && (
                      <AssetImage
                        fileName={treatment.expandedImage}
                        alt={treatment.title}
                        className="treatment-image treatment-image-open parallax-media"
                        dataParallax
                        dataParallaxSpeed="0.06"
                        style={parallaxStyle("0px")}
                      />
                    )}

                    <div className="treatment-shade" />

                    <div className="treatment-closed-label">
                      <h3>{treatment.title}</h3>
                    </div>

                    <div className="treatment-open-content">
                      <h3>{treatment.title}</h3>
                      <p>{treatment.description}</p>
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Saiba mais
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="process-intro" data-reveal>
            <h2>
              Do diagnóstico ao acabamento final, cada etapa é conduzida com
              método, precisão e olhar artístico.
            </h2>
          </section>

          <section
            className="diagnosis-stack"
            aria-label="Etapas do atendimento"
          >
            {diagnosisSteps.map((step, index) => (
              <article
                key={step.title}
                className="diagnosis-feature diagnosis-stack-card"
                style={{ zIndex: index + 1 }}
              >
                <div className="diagnosis-image">
                  <AssetImage
                    fileName={step.image}
                    alt={step.title}
                    className="parallax-media"
                    dataParallax
                    dataParallaxSpeed="0.09"
                    style={parallaxStyle("0px")}
                  />
                </div>

                <div
                  className="diagnosis-panel"
                  style={{ backgroundColor: step.backgroundColor }}
                >
                  <div className="diagnosis-copy" data-reveal>
                    <h2>{step.title}</h2>
                    <p>{step.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="beauty-section" data-reveal>
            <div className="beauty-image-wrapper">
              <BeautyDots />

              <h2>Função gera beleza.</h2>
            </div>
          </section>

          <section className="history-section">
            <span className="history-eyebrow" data-reveal>
              História
            </span>

            <p className="history-intro" data-reveal>
              A clínica da Dra. Caiane Petry nasceu com o propósito de oferecer
              uma odontologia que enxergue o sorriso como parte da saúde, da
              função e da identidade de cada pessoa. Atendemos bebês, crianças,
              adolescentes e adultos, sem idade mínima, acompanhando o sorriso
              em suas diferentes fases: do desenvolvimento facial e da ortopedia
              na infância à ortodontia e Invisalign, chegando ao refinamento
              estético e funcional na vida adulta. Essa abordagem se traduz em
              uma atuação multidisciplinar, com experiência em:
            </p>

            <div className="formation-list" data-reveal>
              {formations.map((item) => (
                <div className="formation-row" key={item.code}>
                  <span className="formation-number">{item.code}</span>
                  <span className="formation-title">{item.title}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="editorial-duo-section">
            <div className="editorial-duo-inner">
              <div className="editorial-duo-gray" data-reveal>
                <AssetImage
                  fileName="editorial-cinza.webp"
                  alt="Detalhe editorial em preto e branco"
                  className="parallax-media"
                  dataParallax
                  dataParallaxSpeed="0.07"
                  style={parallaxStyle("0px")}
                />
              </div>

              <div className="editorial-duo-color" data-reveal>
                <AssetImage
                  fileName="editorial-colorida.webp"
                  alt="Dra. Caiane Petry em ambiente clínico"
                  className="parallax-media"
                  dataParallax
                  dataParallaxSpeed="0.1"
                  style={parallaxStyle("0px")}
                />
              </div>
            </div>
          </section>

          <section className="clinic-location-feature">
            <div className="clinic-location-panel">
              <p data-reveal>
                O consultório está localizado em São José, na Grande
                Florianópolis, onde cada detalhe foi pensado para proporcionar
                uma experiência próxima, individualizada e acolhedora, em um
                ambiente sofisticado. A Dra. Caiane também realiza atendimentos
                em Florianópolis, ampliando o cuidado sem perder a essência de
                um acompanhamento personalizado.
              </p>
            </div>

            <div className="clinic-location-image" data-reveal>
              <AssetImage
                fileName="consultorio.webp"
                alt="Ambiente do consultório da Dra. Caiane Petry"
                className="parallax-media"
                dataParallax
                dataParallaxSpeed="0.08"
                style={parallaxStyle("0px")}
              />
            </div>
          </section>

          <section className="start-diagnosis-section">
            <div className="start-diagnosis-inner">
              <div className="start-diagnosis-center" data-reveal>
                <h2>
                  Vamos começar
                  <br />
                  pelo diagnóstico?
                </h2>
                <p>
                  Cada sorriso tem uma história e um caminho próprio. Agende sua
                  avaliação e <br className="br-wide" />
                  descubra o que pode ser preservado, desenvolvido ou aprimorado
                  no seu.
                </p>
                <a
                  className="button start-diagnosis-button"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Agendar pelo WhatsApp
                </a>
              </div>

              <figure
                className="diag-photo diag-photo-01"
                data-reveal
                aria-hidden="true"
              >
                <AssetImage
                  fileName="cta-homem.webp"
                  alt=""
                  className="parallax-media"
                  dataParallax
                  dataParallaxSpeed="0.06"
                  style={parallaxStyle("0px")}
                />
              </figure>

              <figure
                className="diag-photo diag-photo-02"
                data-reveal
                aria-hidden="true"
              >
                <AssetImage
                  fileName="cta-adolescente.webp"
                  alt=""
                  className="parallax-media"
                  dataParallax
                  dataParallaxSpeed="0.09"
                  style={parallaxStyle("0px")}
                />
              </figure>

              <figure
                className="diag-photo diag-photo-03"
                data-reveal
                aria-hidden="true"
              >
                <AssetImage
                  fileName="cta-mulher.webp"
                  alt=""
                  className="parallax-media"
                  dataParallax
                  dataParallaxSpeed="0.09"
                  style={parallaxStyle("0px")}
                />
              </figure>

              <figure
                className="diag-photo diag-photo-04"
                data-reveal
                aria-hidden="true"
              >
                <AssetImage
                  fileName="cta-crianca.webp"
                  alt=""
                  className="parallax-media"
                  dataParallax
                  dataParallaxSpeed="0.06"
                  style={parallaxStyle("0px")}
                />
              </figure>
            </div>
          </section>

          <section
            className="blog-section"
            id="blog"
            data-blog-integration="ready"
          >
            <h2 className="blog-heading" data-reveal>
              Acompanhe o blog
            </h2>

            <div className="blog-grid" data-reveal>
              {blogPosts.map((post) => (
                <BlogCard
                  key={post.category}
                  post={post}
                  onNavigate={navigateTo}
                />
              ))}
            </div>

            <div className="blog-actions" data-reveal>
              <a
                className="button blog-all-button"
                href="/blog"
                onClick={(event) => navigateTo("/blog", event)}
              >
                Ver Todos os Artigos
              </a>
            </div>
          </section>
        </main>
      )}

      <Footer
        currentPage={currentPage}
        onNavigateSection={navigateToHomeSection}
        onNavigate={navigateTo}
        onOpenPrivacyPolicy={openPrivacyPolicy}
      />

      <a
        className="whatsapp-float"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar pelo WhatsApp"
      >
        <WhatsAppButtonIcon className="whatsapp-float-icon" />
      </a>

      <Cookies onOpenPrivacyPolicy={openPrivacyPolicy} />
    </div>
  );
}

export default App;