import { useEffect, useState } from "react";

const COOKIE_STORAGE_KEY = "caiane_petry_cookie_consent";

interface CookiesProps {
  onOpenPrivacyPolicy?: () => void;
}

export function Cookies({ onOpenPrivacyPolicy }: CookiesProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const savedConsent = window.localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!savedConsent) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-cookie-banner", isVisible);
    return () => {
      document.body.classList.remove("has-cookie-banner");
    };
  }, [isVisible]);

  const handleConsent = (choice: "accepted" | "rejected") => {
    window.localStorage.setItem(COOKIE_STORAGE_KEY, choice);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      className="cookie-banner"
      role="region"
      aria-label="Aviso de uso de cookies"
    >
      <div className="cookie-banner-inner">
        <p className="cookie-banner-text">
          Nosso site utiliza cookies para melhorar sua experiência, personalizar
          conteúdo e analisar o tráfego. Ao continuar navegando,
          <br className="cookie-desktop-break" /> você concorda com o uso de
          cookies. Para mais informações, consulte nossa{" "}
          <a
            href="#politica-de-privacidade"
            className="cookie-banner-link"
            onClick={(event) => {
              if (onOpenPrivacyPolicy) {
                event.preventDefault();
                onOpenPrivacyPolicy();
              }
            }}
          >
            Política de Privacidade
          </a>
          .
        </p>

        <div className="cookie-banner-actions">
          <button
            type="button"
            className="cookie-btn cookie-btn-accept"
            onClick={() => handleConsent("accepted")}
          >
            ACEITAR
          </button>

          <button
            type="button"
            className="cookie-btn cookie-btn-reject"
            onClick={() => handleConsent("rejected")}
          >
            RECUSAR
          </button>
        </div>
      </div>
    </aside>
  );
}