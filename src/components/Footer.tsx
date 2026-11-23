import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";

const ASSETS = "/assets/";
const WHATSAPP_URL = "https://wa.me/5548991545528";
const INSTAGRAM_URL = "https://www.instagram.com/dracaianepetry/";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Ed+Kplatz+Corporate+Av.+Presidente+Kennedy+568+Campinas+S%C3%A3o+Jos%C3%A9+SC+88101-050";

type FooterAssetImageProps = {
  fileName: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  loading?: "eager" | "lazy";
};

function FooterAssetImage({
  fileName,
  alt,
  className,
  style,
  loading = "eager",
}: FooterAssetImageProps) {
  const clean = fileName.trim();
  const dotIndex = clean.lastIndexOf(".");
  const base = dotIndex > 0 ? clean.slice(0, dotIndex) : clean;
  const ext = dotIndex > 0 ? clean.slice(dotIndex) : ".png";

  const urls = Array.from(
    new Set([
      `${ASSETS}${clean}`,
      `${ASSETS}${base}.png`,
      `${ASSETS}${base}.jpg`,
      `${ASSETS}${base}.JPG`,
      `${ASSETS}${base}.jpeg`,
      `${ASSETS}${base}.webp`,
      ...(ext.toLowerCase() !== ext ? [`${ASSETS}${base}${ext.toLowerCase()}`] : []),
    ]),
  ).map((url) => encodeURI(url));

  const [urlIndex, setUrlIndex] = useState(0);

  useEffect(() => {
    setUrlIndex(0);
  }, [fileName]);

  return (
    <img
      src={urls[urlIndex]}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={() =>
        setUrlIndex((prev) => (prev + 1 < urls.length ? prev + 1 : prev))
      }
    />
  );
}

type FooterProps = {
  currentPage: "home" | "privacidade";
  onNavigateSection: (
    sectionHash: string,
    event?: MouseEvent<HTMLAnchorElement>,
  ) => void;
  onOpenPrivacyPolicy: () => void;
};

export function Footer({
  currentPage,
  onNavigateSection,
  onOpenPrivacyPolicy,
}: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand-col">
            <span className="footer-brand-name">CAIANE PETRY</span>
            <span className="footer-cro">CRO-SC 12121</span>

            <a
              className="footer-insta-button"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Dra. Caiane Petry"
            >
              <FooterAssetImage
                fileName="IconInsta.png"
                alt=""
                className="footer-insta-icon"
                loading="eager"
              />
            </a>
          </div>

          <div className="footer-col">
            <h3>Navegação</h3>
            <ul>
              <li>
                <a
                  href="#inicio"
                  onClick={(event) => onNavigateSection("#inicio", event)}
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="#sobre"
                  onClick={(event) => onNavigateSection("#sobre", event)}
                >
                  Sobre
                </a>
              </li>
              <li>
                <a
                  href="#tratamentos"
                  onClick={(event) => onNavigateSection("#tratamentos", event)}
                >
                  Tratamentos
                </a>
              </li>
              <li>
                <a
                  href="#tecnologia"
                  onClick={(event) => onNavigateSection("#tecnologia", event)}
                >
                  Tecnologia
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  onClick={(event) => onNavigateSection("#blog", event)}
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Tratamentos</h3>
            <ul>
              <li>
                <a
                  href="#tratamentos"
                  onClick={(event) => onNavigateSection("#tratamentos", event)}
                >
                  Ortodontia
                </a>
              </li>
              <li>
                <a
                  href="#tratamentos"
                  onClick={(event) => onNavigateSection("#tratamentos", event)}
                >
                  Ortopedia Funcional
                </a>
              </li>
              <li>
                <a
                  href="#tratamentos"
                  onClick={(event) => onNavigateSection("#tratamentos", event)}
                >
                  Refinamento Estético
                </a>
              </li>
              <li>
                <a
                  href="#tratamentos"
                  onClick={(event) => onNavigateSection("#tratamentos", event)}
                >
                  Profilaxia e Prevenção
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-col-contact">
            <h3>Contato</h3>
            <ul>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                  +55 (48) 99154 5528
                </a>
              </li>
              <li>
                <a href="mailto:dracaianepetry@gmail.com">
                  dracaianepetry@gmail.com
                </a>
              </li>
              <li>
                <a
                  className="footer-address"
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
  Ed. Kplatz Corporate · Av.
  <br />
  Presidente Kennedy, 568, Sala
  <br />
  602 · Campinas, São José · SC
</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-credit">Desenvolvido por ZION</span>

          <div className="footer-bottom-right">
            <a
              className={`footer-privacy ${
                currentPage === "privacidade" ? "is-current" : ""
              }`}
              href="#politica-de-privacidade"
              onClick={(event) => {
                event.preventDefault();
                onOpenPrivacyPolicy();
              }}
            >
              Política de Privacidade
            </a>

            <span className="footer-copy">
              © 2026 Dra. Caiane Petry. Todos os direitos reservados.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}