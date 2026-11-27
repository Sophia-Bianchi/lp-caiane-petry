import { useEffect, useState, type MouseEvent } from "react";
import { scrollToY } from "./SmoothScroll";
import {
  ChevronIcon,
  ShareLinkedInIcon,
  ShareLinkIcon,
  ShareWhatsAppIcon,
  ShareXIcon,
} from "./Icons";

// Páginas de blog conforme o Figma ("Blog" listagem + artigo, desk e mobile).
// Títulos, descrições e o texto do artigo ainda são os placeholders do Figma:
// quando os artigos reais existirem, é só trocar os dados abaixo.

export type BlogPost = {
  slug: string;
  category: string;
  image: string;
  title: string;
  description: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "artigo-exemplo",
    category: "Infantil",
    image: "blog-infantil.webp",
    title: "Título do artigo do blog",
    description: "Breve descrição do tema",
  },
  {
    slug: "artigo-exemplo",
    category: "Bastidores",
    image: "blog-bastidores.webp",
    title: "Título do artigo do blog",
    description: "Breve descrição do tema",
  },
  {
    slug: "artigo-exemplo",
    category: "Estética",
    image: "blog-estetica.webp",
    title: "Título do artigo do blog",
    description: "Breve descrição do tema",
  },
  {
    slug: "artigo-exemplo",
    category: "Tratamentos",
    image: "blog-tratamentos.webp",
    title: "Título do artigo do blog",
    description: "Breve descrição do tema",
  },
];

type NavigateFn = (path: string, event?: MouseEvent<HTMLAnchorElement>) => void;

export function BlogCard({
  post,
  onNavigate,
}: {
  post: BlogPost;
  onNavigate: NavigateFn;
}) {
  const href = `/blog/${post.slug}`;
  return (
    <a
      className="blog-card"
      href={href}
      onClick={(event) => onNavigate(href, event)}
    >
      <div className="blog-card-image">
        <img
          src={`/img/${post.image}`}
          alt={post.category}
          className="parallax-media"
          data-parallax=""
          data-parallax-speed="0.06"
          loading="lazy"
          decoding="async"
        />
      </div>
      <span className="blog-card-category">{post.category}</span>
      <h3 className="blog-card-title">{post.title}</h3>
      <p className="blog-card-description">{post.description}</p>
    </a>
  );
}

export function BlogListPage({ onNavigate }: { onNavigate: NavigateFn }) {
  // O Figma mostra 3 linhas de 4 artigos.
  const posts = [...blogPosts, ...blogPosts, ...blogPosts];

  return (
    <main className="blog-page">
      <h1 className="blog-page-title" data-reveal>
        Acompanhe o blog
      </h1>

      <div className="blog-grid blog-page-grid">
        {posts.map((post, index) => (
          <div data-reveal key={`${post.category}-${index}`}>
            <BlogCard post={post} onNavigate={onNavigate} />
          </div>
        ))}
      </div>
    </main>
  );
}

const ARTICLE_TOPICS = [
  {
    id: "topico-1",
    label: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    id: "topico-2",
    label: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
];

export function BlogArticlePage({ onNavigate }: { onNavigate: NavigateFn }) {
  const [indexOpen, setIndexOpen] = useState(true);
  const [activeTopic, setActiveTopic] = useState(ARTICLE_TOPICS[0].id);
  const [copied, setCopied] = useState(false);

  // Marca no índice o tópico que está na tela.
  useEffect(() => {
    const targets = ARTICLE_TOPICS.map((topic) =>
      document.getElementById(topic.id),
    ).filter((el): el is HTMLElement => Boolean(el));

    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let current = ARTICLE_TOPICS[0].id;
      targets.forEach((el) => {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      });
      setActiveTopic(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pageUrl =
    typeof window !== "undefined" ? window.location.href.split("#")[0] : "";
  const shareText = encodeURIComponent(
    "Nam laoreet diam non magna bibendum bibendum.",
  );
  const shareUrl = encodeURIComponent(pageUrl);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sem permissão de clipboard: segue sem feedback */
    }
  };

  const goToTopic = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    scrollToY(top);
  };

  return (
    <main className="article-page">
      <header className="article-head" data-reveal>
        <h1 className="article-title">
          Nam laoreet diam non magna bibendum bibendum.
        </h1>
        <p className="article-lead">
          am in mattis magna. Cras semper purus non mauris ornare, a euismod
          nunc lobortis. Suspendisse convallis purus et convallis tempus. Sed
          aliquet ex pretium, condimentum lacus sit amet, consectetur risus.
          Maecenas fermentum sapien vitae libero ultricies imperdiet.
        </p>
      </header>

      <div className="article-cover" data-reveal>
        <img
          src="/img/artigo-capa.webp"
          alt="Mão de adulto segurando a mão de uma criança"
          className="parallax-media"
          data-parallax=""
          data-parallax-speed="0.08"
          decoding="async"
        />
      </div>

      <div className="article-layout">
        <aside
          className={`article-index ${indexOpen ? "is-open" : ""}`}
          aria-label="Índice do artigo"
        >
          <button
            type="button"
            className="article-index-toggle"
            aria-expanded={indexOpen}
            onClick={() => setIndexOpen((open) => !open)}
          >
            <span>Índice</span>
            <ChevronIcon className="article-index-chevron" />
          </button>

          <ol className="article-index-list">
            {ARTICLE_TOPICS.map((topic) => (
              <li key={topic.id}>
                <button
                  type="button"
                  className={activeTopic === topic.id ? "is-active" : ""}
                  onClick={() => goToTopic(topic.id)}
                >
                  {topic.label}
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <div className="article-body">
          <div id="topico-1" className="article-text">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in
              mattis magna. Cras semper purus non mauris ornare, a euismod nunc
              lobortis. Suspendisse convallis purus et convallis tempus. Sed
              aliquet ex pretium, condimentum lacus sit amet, consectetur
              risus. Maecenas fermentum sapien vitae libero ultricies
              imperdiet. In euismod, libero ut laoreet efficitur, massa purus
              feugiat nisl, a vulputate lorem nisl et elit. Duis ac quam
              faucibus, iaculis justo eget, vehicula odio.
            </p>
            <p>
              Nam laoreet diam non magna bibendum bibendum. Donec quis neque
              sed leo iaculis efficitur. Nulla sit amet nibh suscipit, euismod
              mauris quis, molestie nisl. Praesent dapibus augue vel lacus
              sollicitudin blandit. Maecenas ultrices lorem vitae dignissim
              tristique. Ut maximus, eros eget luctus sodales, dolor velit
              blandit erat, ac rutrum magna nisl et erat. Phasellus lobortis,
              neque a finibus sagittis, lacus odio tempus odio, eu aliquet ante
              tortor non sapien. Curabitur vitae consectetur massa, sed
              sollicitudin lectus. Phasellus elementum consectetur vestibulum.
              Curabitur sollicitudin ligula et dignissim ultricies. Nulla sit
              amet tortor ut turpis efficitur convallis. Aliquam tincidunt,
              eros sit amet scelerisque congue, tortor massa porta lectus,
              vitae facilisis lacus nibh sit amet ipsum. Pellentesque ut magna
              arcu. Nulla facilisi. Pellentesque in fermentum mauris. Ut eu
              magna turpis.
            </p>
          </div>

          <h2 id="topico-2" className="article-subtitle">
            Lorem ipsum dolor sit amet
          </h2>

          <div className="article-text">
            <p>
              Nullam luctus lectus quis nulla ornare, ac tincidunt diam
              vulputate. Morbi et eros nibh. Fusce sed massa mauris. Donec nec
              turpis quis turpis fringilla luctus. Nam tempor, odio eget
              rhoncus pellentesque, magna magna luctus sapien, nec ullamcorper
              felis justo vel mi. Proin malesuada facilisis ex, at euismod
              neque maximus vitae. Fusce tristique eros erat, in porttitor eros
              efficitur a. Morbi scelerisque accumsan ante, eget vestibulum
              risus mollis a. Sed ac sem egestas, vestibulum massa a, mattis
              purus. Proin magna eros, iaculis sit amet rhoncus nec, lacinia at
              ante. Phasellus placerat risus et ultrices scelerisque.
            </p>
            <p>
              Sed in consectetur augue. Mauris vehicula fringilla quam.
              Vestibulum pretium posuere diam id pellentesque. Donec vestibulum
              erat lacus, at feugiat elit fringilla at. In hac habitasse platea
              dictumst. Suspendisse euismod feugiat vulputate. Etiam ac ipsum
              nec lacus convallis rhoncus. Vestibulum lorem dui, fringilla non
              velit nec, consequat luctus massa. Maecenas tellus purus,
              consectetur sit amet velit sit amet, tincidunt facilisis tellus.
              Integer scelerisque suscipit semper. Phasellus ultrices magna sed
              urna luctus viverra.
            </p>
            <p>
              Pellentesque eget quam dignissim, dapibus orci sed, bibendum
              lectus. Morbi interdum lectus non vestibulum pharetra. Ut et
              luctus nibh. Orci varius natoque penatibus et magnis dis
              parturient montes, nascetur ridiculus mus. Sed aliquet ac mauris
              sed porttitor. Nullam malesuada tempor aliquet. Duis consequat mi
              eget scelerisque pellentesque.
            </p>
          </div>

          <div className="article-share">
            <span className="article-share-label">Compartilhe esse artigo</span>
            <div className="article-share-actions">
              <button
                type="button"
                className="article-share-button"
                aria-label={copied ? "Link copiado" : "Copiar link do artigo"}
                title={copied ? "Link copiado" : "Copiar link"}
                onClick={copyLink}
              >
                <ShareLinkIcon className="article-share-icon is-link" />
              </button>
              <a
                className="article-share-button"
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Compartilhar no X"
              >
                <ShareXIcon className="article-share-icon" />
              </a>
              <a
                className="article-share-button"
                href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Compartilhar no WhatsApp"
              >
                <ShareWhatsAppIcon className="article-share-icon" />
              </a>
              <a
                className="article-share-button"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Compartilhar no LinkedIn"
              >
                <ShareLinkedInIcon className="article-share-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <section className="article-related">
        <h2 className="article-related-title" data-reveal>
          Leia também
        </h2>
        <div className="blog-grid article-related-grid">
          {blogPosts.map((post) => (
            <div data-reveal key={post.category}>
              <BlogCard post={post} onNavigate={onNavigate} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
