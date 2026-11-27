import type { MouseEvent } from "react";
import { InstagramIcon, LogoWordmark, ZionLogo } from "./Icons";

const WHATSAPP_URL = "https://wa.me/5548991545528";
const INSTAGRAM_URL = "https://www.instagram.com/dracaianepetry/";
const ZION_URL = "https://zionsoftwarehouse.com.br/";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Ed+Kplatz+Corporate+Av.+Presidente+Kennedy+568+Campinas+S%C3%A3o+Jos%C3%A9+SC+88101-050";

type FooterProps = {
  currentPage: string;
  onNavigateSection: (
    sectionHash: string,
    event?: MouseEvent<HTMLAnchorElement>,
  ) => void;
  onOpenPrivacyPolicy: () => void;
  onNavigate: (path: string, event?: MouseEvent<HTMLAnchorElement>) => void;
};

export function Footer({
  currentPage,
  onNavigateSection,
  onOpenPrivacyPolicy,
  onNavigate,
}: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand-col">
            <span className="footer-brand-name">
              <LogoWordmark className="footer-brand-wordmark" />
              <span className="sr-only">Caiane Petry</span>
            </span>
            <span className="footer-cro">CRO-SC 12121</span>

            <a
              className="footer-insta-button"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Dra. Caiane Petry"
            >
              <InstagramIcon className="footer-insta-icon" />
            </a>
          </div>

          <div className="footer-col">
            <h3>Navegação</h3>
            <ul>
              <li>
                <a
                  href={"/#inicio"}
                  onClick={(event) => onNavigateSection("#inicio", event)}
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href={"/#sobre"}
                  onClick={(event) => onNavigateSection("#sobre", event)}
                >
                  Sobre
                </a>
              </li>
              <li>
                <a
                  href={"/#tratamentos"}
                  onClick={(event) => onNavigateSection("#tratamentos", event)}
                >
                  Tratamentos
                </a>
              </li>
              <li>
                <a
                  href={"/#tecnologia"}
                  onClick={(event) => onNavigateSection("#tecnologia", event)}
                >
                  Tecnologia
                </a>
              </li>
              <li>
                <a href="/blog" onClick={(event) => onNavigate("/blog", event)}>
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
                  href={"/#tratamentos"}
                  onClick={(event) => onNavigateSection("#tratamentos", event)}
                >
                  Ortodontia
                </a>
              </li>
              <li>
                <a
                  href={"/#tratamentos"}
                  onClick={(event) => onNavigateSection("#tratamentos", event)}
                >
                  Ortopedia Funcional
                </a>
              </li>
              <li>
                <a
                  href={"/#tratamentos"}
                  onClick={(event) => onNavigateSection("#tratamentos", event)}
                >
                  Estética do Sorriso
                </a>
              </li>
              <li>
                <a
                  href={"/#tratamentos"}
                  onClick={(event) => onNavigateSection("#tratamentos", event)}
                >
                  Profilaxia &amp; Prevenção
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
                    Ed. Kplatz Corporate · Av.{" "}
                    <br />
                    Presidente Kennedy, 568, Sala{" "}
                    <br />
                    602 · Campinas, São José · SC
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <a
            className="footer-credit"
            href={ZION_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Desenvolvido por ZION (abre o site da Zion)"
          >
            <span>Desenvolvido por</span>
            <ZionLogo className="footer-zion-logo" />
          </a>

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
              ©2026 Dra. Caiane Petry. Todos os direitos reservados.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}