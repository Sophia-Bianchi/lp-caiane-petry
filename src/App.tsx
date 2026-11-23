import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import "./App.css";
import { Abertura } from "./components/Abertura";
import { Cookies } from "./components/Cookies";
import { PoliticaPrivacidade } from "./components/PoliticaPrivacidade";
import { Footer } from "./components/Footer";

const ASSETS = "/assets/";

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

const blogPosts = [
  {
    category: "Infantil",
    image: "Blog_IMG01.png",
  },
  {
    category: "Bastidores",
    image: "Blog_IMG02.JPG",
  },
  {
    category: "Estética",
    image: "Blog_IMG03.png",
  },
  {
    category: "Tratamentos",
    image: "Blog_IMG04.png",
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
    image: "OrtodontiaIMG.png",
    expandedImage: "OrtodontiaImgAberta.png",
    description:
      "Tratamentos ortodônticos para adolescentes e adultos, planejados a partir de um diagnóstico que considera não apenas a posição dos dentes, mas também função, oclusão, estética do sorriso e harmonia facial. Utilizamos recursos digitais avançados e diferentes possibilidades terapêuticas, incluindo Invisalign, buscando resultados precisos, naturais e estáveis.",
  },
  {
    title: "Ortopedia Funcional dos Maxilares",
    image: "OrtodontiaDosMaxilaresPequena.png",
    expandedImage: "OrtopediaFuncionalAberta.png",
    description:
      "Acompanhamos o desenvolvimento dentofacial de bebês, crianças e adolescentes com abordagens ortopédicas individualizadas, identificando e tratando precocemente alterações na face, arcadas e oclusão. Sem idade mínima: atendemos desde os primeiros meses de vida, incluindo bebês com síndrome de Down a partir dos 2 meses.",
  },
  {
    title: "Refinamento Estético do Sorriso",
    image: "RefinamentoEsteticoPequena.png",
    expandedImage: "RefinamentoEsteticoAberta.png",
    description:
      "A plastia do sorriso vai além do alinhamento para devolver forma, proporção, função e naturalidade. Por meio de intervenções conservadoras em resina, aprimoramos contornos e pequenos detalhes que fazem diferença na harmonia do conjunto. Uma estética delicada e individualizada, que preserva a estrutura dental para valorizar o que já é naturalmente seu.",
  },
  {
    title: "Profilaxia & Prevenção",
    image: "ProfilaxiaPequena.png",
    expandedImage: "ProfilaxiaAberta.png",
    description:
      "Saúde e cuidado para preservar resultados ao longo da vida. Mais do que uma limpeza profissional, a profilaxia une prevenção e avaliação periódica com o apoio da tecnologia. Assim, identificamos alterações precocemente para proteger dentes, gengivas e a longevidade dos tratamentos estéticos e ortodônticos.",
  },
];

type DiagnosisStep = {
  title: string;
  description: string;
  image: string;
  fallbacks?: string[];
  backgroundColor: string;
};

const diagnosisSteps: DiagnosisStep[] = [
  {
    title: "Diagnóstico personalizado",
    description:
      "Tudo começa por uma avaliação criteriosa. Analisamos proporções, função, oclusão, relação dos dentes com a face e o potencial de crescimento, quando indicado. É esse entendimento que define o caminho, e não o contrário.",
    image: "Diagnostico.png",
    backgroundColor: "#2D3945",
  },
  {
    title: "Planejamento digital",
    description:
      "O planejamento digital permite visualizar o tratamento antes de iniciá-lo, tornando o processo mais previsível, preciso e transparente para o paciente.",
    image: "Blog_IMG02.JPG",
    backgroundColor: "#665E54",
  },
  {
    title: "Tecnologia",
    description:
      "Recursos como iTero 5D, planejamento digital, fotografia clínica e Invisalign permitem tratamentos cada vez mais precisos, previsíveis e minimamente invasivos.",
    image: "IMG_8457.JPG",
    backgroundColor: "#5A6B7B",
  },
  {
    title: "Naturalidade e precisão",
    description:
      "A tecnologia está a serviço de um resultado que respeita a anatomia e a individualidade de cada paciente. Nosso objetivo é um sorriso que funcione bem, seja elegante e pareça sempre ter sido seu.",
    image: "Naturalidade.png",
    fallbacks: ["NaturalidadePrecisao.png", "GeraBelezaSorriso.png"],
    backgroundColor: "#2D3945",
  },
];

function buildAssetUrls(fileName: string, fallbacks: string[] = []): string[] {
  const clean = fileName.trim();
  const dotIndex = clean.lastIndexOf(".");
  const base = dotIndex > 0 ? clean.slice(0, dotIndex) : clean;
  const ext = dotIndex > 0 ? clean.slice(dotIndex) : ".png";

  const urls: string[] = [
    `${ASSETS}${clean}`,
    `${ASSETS}${base}.png`,
    `${ASSETS}${base}.jpg`,
    `${ASSETS}${base}.JPG`,
    `${ASSETS}${base}.jpeg`,
    `${ASSETS}${base}.webp`,
  ];

  if (ext.toLowerCase() !== ext) {
    urls.push(`${ASSETS}${base}${ext.toLowerCase()}`);
  }

  for (const fallback of fallbacks) {
    urls.push(`${ASSETS}${fallback}`);
  }

  return Array.from(new Set(urls)).map((url) => encodeURI(url));
}

type AssetImageProps = {
  fileName: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  loading?: "eager" | "lazy";
  dataParallax?: boolean;
  dataParallaxSpeed?: string;
  dataReveal?: boolean;
  fallbacks?: string[];
};

function AssetImage({
  fileName,
  alt,
  className,
  style,
  loading = "eager",
  dataParallax,
  dataParallaxSpeed,
  dataReveal,
  fallbacks = [],
}: AssetImageProps) {
  const urls = buildAssetUrls(fileName, fallbacks);
  const [urlIndex, setUrlIndex] = useState(0);

  useEffect(() => {
    setUrlIndex(0);
  }, [fileName]);

  const handleError = () => {
    setUrlIndex((prev) => (prev + 1 < urls.length ? prev + 1 : prev));
  };

  return (
    <img
      src={urls[urlIndex]}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={handleError}
      {...(dataParallax ? { "data-parallax": "" } : {})}
      {...(dataParallaxSpeed ? { "data-parallax-speed": dataParallaxSpeed } : {})}
      {...(dataReveal ? { "data-reveal": "" } : {})}
    />
  );
}

function getParallaxOffset(element: HTMLElement, speed: number): number {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || 1;
  const elementCenter = rect.top + rect.height / 2;
  const distanceFromCenter = elementCenter - viewportHeight / 2;
  const maxOffset = 32;

  const rawOffset = -distanceFromCenter * speed;
  return Math.max(-maxOffset, Math.min(maxOffset, rawOffset));
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTreatment, setActiveTreatment] = useState<number>(0);
  const [manualSelectionUntil, setManualSelectionUntil] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<"home" | "privacidade">(() =>
    window.location.hash === "#politica-de-privacidade"
      ? "privacidade"
      : "home",
  );

  useEffect(() => {
    const syncRouteFromHash = () => {
      setCurrentPage(
        window.location.hash === "#politica-de-privacidade"
          ? "privacidade"
          : "home",
      );
    };

    window.addEventListener("hashchange", syncRouteFromHash);
    window.addEventListener("popstate", syncRouteFromHash);
    return () => {
      window.removeEventListener("hashchange", syncRouteFromHash);
      window.removeEventListener("popstate", syncRouteFromHash);
    };
  }, []);

  useEffect(() => {
    if (currentPage !== "home") return;

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const revealVisibleElements = () => {
      const viewportHeight = window.innerHeight || 900;
      elements.forEach((element) => {
        if (element.classList.contains("is-visible")) return;
        const rect = element.getBoundingClientRect();
        if (rect.top <= viewportHeight + 120) {
          element.classList.add("is-visible");
        }
      });
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

    window.addEventListener("scroll", revealVisibleElements, { passive: true });
    window.addEventListener("resize", revealVisibleElements, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", revealVisibleElements);
      window.removeEventListener("resize", revealVisibleElements);
    };
  }, [currentPage]);

  useEffect(() => {
    if (currentPage !== "home") return;

    const parallaxElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );

    if (parallaxElements.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      parallaxElements.forEach((el) => {
        el.style.setProperty("--parallax-y", "0px");
      });
      return;
    }

    let frameId = 0;

    const updateParallax = () => {
      frameId = 0;
      const isCompactScreen = window.innerWidth <= 768;

      parallaxElements.forEach((el) => {
        const baseSpeed = Number(el.dataset.parallaxSpeed ?? "0.08");
        const effectiveSpeed = isCompactScreen ? baseSpeed * 0.45 : baseSpeed;
        const offset = getParallaxOffset(el, effectiveSpeed);
        el.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
      });
    };

    const scheduleUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateParallax);
      }
    };

    updateParallax();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.querySelector(sectionHash)?.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (currentPage !== "home") {
      setCurrentPage("home");
      window.history.pushState(null, "", sectionHash);
      window.setTimeout(scrollToTarget, 60);
      return;
    }

    window.history.pushState(null, "", sectionHash);
    scrollToTarget();
  };

  const handleCardClick = (index: number) => {
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
      <Abertura />

      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#inicio"
            aria-label="Caiane Petry - Início"
            onClick={(event) => navigateToHomeSection("#inicio", event)}
          >
            <AssetImage fileName="Group.png" alt="" loading="eager" />
            <span>CAIANE PETRY</span>
          </a>

          <nav
            id="mobile-navigation"
            className={`main-nav ${isMenuOpen ? "is-open" : ""}`}
            aria-label="Navegação principal"
          >
            <a
              className={currentPage === "home" ? "active" : ""}
              href="#inicio"
              onClick={(event) => navigateToHomeSection("#inicio", event)}
            >
              Início
            </a>
            <a
              href="#sobre"
              onClick={(event) => navigateToHomeSection("#sobre", event)}
            >
              Sobre
            </a>
            <a
              href="#tratamentos"
              onClick={(event) => navigateToHomeSection("#tratamentos", event)}
            >
              Tratamentos
            </a>
            <a
              href="#tecnologia"
              onClick={(event) => navigateToHomeSection("#tecnologia", event)}
            >
              Tecnologia
            </a>
            <a
              href="#blog"
              onClick={(event) => navigateToHomeSection("#blog", event)}
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
                Odontologia que une função, saúde e beleza em cada fase da vida.
              </h1>

              <p>
                Ortodontia, ortopedia funcional dos maxilares e refinamento
                estético do sorriso, conduzidos por um diagnóstico
                individualizado e recursos digitais avançados. O resultado que
                buscamos não é apenas ter dentes alinhados, mas um sorriso
                funcional, natural, elegante e integrado à face.
              </p>

              <div className="hero-actions" data-reveal>
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
                  href="#tratamentos"
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
                    fileName="GeraBelezaPedras.png"
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
                    que parecem sempre ter pertencido àquela pessoa.
                  </p>
                </div>
              </div>

              <div className="about-large-image" data-reveal>
                <AssetImage
                  fileName="GeraBelezaSorriso.png"
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
                    <span className="differential-number">[{index + 1}]</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="approach-feature" id="tecnologia">
            <div className="approach-image">
              <AssetImage
                fileName="OrtopediaFuncional.png"
                alt="Imagem ilustrativa de ortopedia funcional"
                className="parallax-media parallax-media-contain"
                dataParallax
                dataParallaxSpeed="0.06"
                style={parallaxStyle("0px")}
                dataReveal
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
                fileName="AlinharDentes.png"
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
  const isOpen = activeTreatment === index;
  const currentImage =
    isOpen && treatment.expandedImage
      ? treatment.expandedImage
      : treatment.image;
  const imageFallbacks = isOpen
    ? [treatment.image]
    : [
        "OrtodontiaImgDesfocada.png",
        "OrtopediaFuncionalDosMaxilares.png",
        "RefinamentoEstetico.png",
        "Profilaxia.png",
      ];

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
                    <AssetImage
                      fileName={currentImage}
                      alt={treatment.title}
                      fallbacks={imageFallbacks}
                      className="treatment-image parallax-media"
                      dataParallax
                      dataParallaxSpeed="0.06"
                      style={parallaxStyle("0px")}
                    />

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
                    fallbacks={step.fallbacks}
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
              <AssetImage
                fileName="FuncaoGeraBeleza.png"
                alt="Composição visual com o conceito Função gera beleza"
                className="beauty-image"
                loading="eager"
              />

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
                  fileName="ImgCinza.png"
                  alt="Detalhe editorial em preto e branco"
                  className="parallax-media"
                  dataParallax
                  dataParallaxSpeed="0.07"
                  style={parallaxStyle("0px")}
                  fallbacks={["IMG_12583.JPG", "IMG_8457.JPG"]}
                />
              </div>

              <div className="editorial-duo-color" data-reveal>
                <AssetImage
                  fileName="ImgColorida.png"
                  alt="Dra. Caiane Petry em ambiente clínico"
                  className="parallax-media"
                  dataParallax
                  dataParallaxSpeed="0.1"
                  style={parallaxStyle("0px")}
                  fallbacks={["IMG_12584.JPG", "IMG_12602.JPG"]}
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

            <div className="clinic-location-image">
              <AssetImage
                fileName="IMG_8455.png"
                alt="Ambiente do consultório da Dra. Caiane Petry"
                className="parallax-media"
                dataParallax
                dataParallaxSpeed="0.08"
                style={parallaxStyle("0px")}
                fallbacks={["IMG_12602.JPG"]}
                dataReveal
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
                  avaliação e
                  <br />
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
                  fileName="VamosComecarPeloDiagnostico_Homem.png"
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
                  fileName="VamosComecarPeloDiagnostico_Adolescente.png"
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
                  fileName="VamosComecarPeloDiagnostico_Mulher.png"
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
                  fileName="VamosComecarPeloDiagnostico_Crianca.png"
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
                <article className="blog-card" key={post.category}>
                  <div className="blog-card-image">
                    <AssetImage
                      fileName={post.image}
                      alt={post.category}
                      className="parallax-media"
                      dataParallax
                      dataParallaxSpeed="0.06"
                      style={parallaxStyle("0px")}
                    />
                  </div>
                  <span className="blog-card-category">{post.category}</span>
                </article>
              ))}
            </div>

            <div className="blog-actions" data-reveal>
              <a
                className="button blog-all-button"
                href="#blog"
                onClick={(event) => navigateToHomeSection("#blog", event)}
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
        onOpenPrivacyPolicy={openPrivacyPolicy}
      />

      <a
        className="whatsapp-float"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar pelo WhatsApp"
      >
        <AssetImage
          fileName="BotaoWhats.png"
          alt="WhatsApp"
          className="whatsapp-float-icon"
          loading="eager"
        />
      </a>

      <Cookies onOpenPrivacyPolicy={openPrivacyPolicy} />
    </div>
  );
}

export default App;