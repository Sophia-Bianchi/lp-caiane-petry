# LP Dra. Caiane Petry: ajustes de 23/11/2026

Ajustes feitos a pedido da Zion sobre a versão da Sophia (commit `f79a17b`), na branch `ajustes-zion-23-11`. O grupo aprovou a **versão interactions** em 23/11/2026.

Preview da versão aprovada (fora do Google): https://lp-caiane-petry-interactions.vercel.app

## Status

| Etapa | Status | Data | Critério de saída |
| --- | --- | --- | --- |
| Apontamentos do grupo (WhatsApp) | ✅ | 23/11 | todos os itens aplicados e conferidos no preview |
| Fidelidade ao Figma, desktop e mobile | ✅ | 23/11 | 1440 e 390 px medidos elemento a elemento (±3–6 px) |
| Páginas de blog (`/blog` e `/blog/:slug`) | ✅ | 23/11 | layout do Figma montado |
| Versão interactions (motion) | ✅ aprovada | 23/11 | grupo escolheu essa versão |
| Ajustes da Ana na interactions | ✅ | 23/11 | moldura das fotos alinhada; tipografia da entrada igual ao Figma |
| Crase em "àquela pessoa" | ⏸ | | Zion confirma (foi tirada a pedido da Ana, mas está correta) |
| Conteúdo real do blog | ⬜ | | hoje são os placeholders do Figma (Lorem ipsum) |
| Medição (GA4 / GTM / pixel) | ⬜ | | o site não tem nenhuma; Zion define se entra antes do deploy |
| PR no repositório oficial | ⬜ | | PR aberto e revisado pela Sophia |
| Deploy no domínio oficial | ⬜ | | site no ar no domínio da Dra., indexável |
| Apagar os previews da nossa Vercel | ⬜ | | depois do deploy oficial |

## O que mudou

### 1. Apontamentos do grupo
- Logo maior no mobile, margens laterais e linha do menu mobile.
- Números dos diferenciais em cinza, no formato `[ 01 ]`.
- Primeiro texto do diagnóstico não corta mais no mobile.
- Cards do blog iguais no desktop, com título e descrição.
- Instagram dentro do segundo círculo.
- Ícone do WhatsApp maior no botão flutuante (glifo 1.2x).
- Instagram do rodapé maior: 40 px no desktop e 34 px no mobile (pedido da Láyza).
- Link "ZION" no rodapé abre o site da Zion.

### 2. Fidelidade ao Figma
Home medida contra o Figma em 1440 px (desktop) e 390 px (mobile). Entraram ritmo de 160 px entre seções, tamanhos de título e botão, hero mobile com a foto inteira e tratamentos sempre abertos no mobile, como no Figma. Os ajustes de CSS ficam em blocos comentados no fim do `src/App.css`.

### 3. Páginas de blog
`/blog` (listagem) e `/blog/:slug` (artigo, com índice, compartilhar e "Leia também"), montadas pelo Figma. **Títulos, descrições e texto do artigo ainda são os placeholders do Figma** (ver Status).

### 4. Peso
Imagens de **93,2 MB → 1,4 MB**: 32 arquivos WebP em 2x do tamanho de exibição, em `public/img`. Os originais saíram de `public/assets` e continuam no histórico do git. Logo, ícones e símbolo viraram SVG.

### 5. Motion (versão interactions)
- **Entrada**, só na primeira visita da sessão: as bolinhas do símbolo entram girando até formar o logo, o nome e a frase sobem de uma máscara e o símbolo voa até o logo do header. A tipografia é o vetor exportado do Figma. Trocar de página (blog, artigo) não repete a entrada.
- **Scroll suave** (Lenis) no desktop.
- **Parallax** em todas as fotos, anotado no Figma. A foto fica em scale 1.08, enquadramento quase igual ao Figma, e anda ±3,5% da altura.
- **Foto que abre**: a moldura fica sempre no tamanho do Figma e a foto desfaz o zoom dentro dela (1.25 → 1) ao entrar na tela.
- **Títulos** com as palavras subindo de uma máscara; parágrafos com fade + subida.
- **Pilha do diagnóstico**, anotada no Figma: os cards se sobrepõem (sticky, também no mobile) e o card coberto afunda levemente.
- **"Função gera beleza"**, anotado no Figma: as bolinhas giram até formar o logo e o gradiente se move dentro delas.
- **Listas** (diferenciais e formação): o texto da linha no meio da tela desliza. As cores ficam as do Figma.
- **Frase-manifesto** acende palavra por palavra no scroll.
- **Header** some ao descer e volta ao subir. Os botões ganham preenchimento no hover. Cursor "Ver/Ler" sobre os cards, só com mouse.
- Com `prefers-reduced-motion` ativado, tudo fica parado.

### 6. Celular leve
- Parallax, foto que abre e saída do hero são **animações CSS presas ao scroll** (`animation-timeline: view()`). Rodam no compositor, junto com o dedo, sem passar pelo JavaScript. Funciona no Chrome 115+ e no Safari 26+; nos outros navegadores o JS faz o mesmo cálculo (`src/scrollFx.ts`).
- Nada de `clip-path` animado: repintava a foto inteira a cada frame.
- No mobile, header sem `backdrop-filter`. Nos cards de tratamento, a foto vem desfocada uma vez só, em vez do vidro recalculado a cada frame.
- Os efeitos em JS só mexem no que está na tela e leem todas as medidas antes de escrever qualquer valor.
- Depois da entrada, as fotos são baixadas e decodificadas em segundo plano.

## O que estava errado no código original

Fica de referência pros próximos projetos.

1. **Peso**: PNG e JPG de até 8 MB direto do Figma ou da câmera, ~80 MB no primeiro acesso. Exportar no tamanho de exibição ×2, em WebP, com `loading="lazy"` do primeiro scroll pra baixo.
2. **Imagens inexistentes**: o `AssetImage` tentava `.png`, `.jpg`, `.JPG`, `.jpeg`, `.webp`… até 6 requisições por imagem quando o arquivo não existia. Melhor apontar o arquivo certo e deixar o erro aparecer.
3. **Logo e ícones em PNG pequeno** (38×24 e 53×53 px), borrados em tela retina. Usar o SVG do Figma.
4. **Abertura pesada**: duas camadas com blur de 220 px animadas a cada frame e 4,1 s fixos em toda visita.
5. **CSS duplicado**: `index.css` e `App.css` definem as mesmas classes com valores diferentes, e o `App.css` ganha porque carrega depois. Uma largura do `index.css` somava com o padding da seção e encolhia "Sobre" e "Diferenciais" 32 px de cada lado. Ter uma folha de estilo como fonte de verdade.
6. **Medidas fora do Figma**: `clamp`/`vw` que não batiam em 1440 px (título 44 em vez de 48, botões 50 em vez de 44, seções com 72–144 px em vez de 160).
7. **Parallax sem efeito**: o JS calculava `--parallax-y`, mas nenhuma regra CSS aplicava o valor nas imagens.
8. **Scroll pesado**: o reveal lia a posição de cada elemento e trocava classe dentro do evento de scroll, intercalando leitura e escrita (layout forçado a cada item). O `IntersectionObserver` que já existia resolve sozinho.
9. **Blog e "Vamos começar"**: imagens do blog sem proporção fixa (cards de 280 e 350 px lado a lado); fotos e texto do "Vamos começar" posicionados separadamente, encostando entre 1100 e 1440 px.
10. **Mobile diferente do Figma**: tratamentos em acordeão (no Figma ficam abertos), card do diagnóstico com 780 px (maior que a tela, cortando o texto) e foto do topo cortada.

## Onde está cada coisa

| Arquivo | O que faz |
| --- | --- |
| `src/App.tsx` | Home, rotas (`/blog`, `/blog/:slug`, `#politica-de-privacidade`), parallax (JS de reserva), reveal, pré-carga das fotos |
| `src/App.css` | Estilos originais + blocos comentados no fim: "AJUSTES 23/11", "FIDELIDADE AO FIGMA", "PÁGINAS DE BLOG", "INTERAÇÕES ANOTADAS", "RODADA DE MOTION", "ENQUADRAMENTO DO FIGMA + SCROLL LEVE" |
| `src/components/Icons.tsx` | Logo, símbolo (com bolinhas separadas), WhatsApp, Instagram, compartilhar |
| `src/components/Footer.tsx` | Rodapé pelo Figma |
| `src/components/BlogPages.tsx` | Listagem e artigo do blog (`blogPosts` = conteúdo) |
| `src/components/BeautyDots.tsx` | "Função gera beleza" em SVG com gradiente vivo |
| `src/components/SmoothScroll.tsx` | Lenis (scroll suave); `scrollToY` para rolar via código |
| `src/components/TitleReveal.ts` | Títulos com palavras subindo |
| `src/interactions/` | Camada de motion: `EntrancePlus` (entrada), `EntranceType` (tipografia vetorial do Figma), `MotionPlus` (efeitos de scroll), `motion-plus.css`, `eventos.ts` (evento de fim da entrada) |
| `src/scrollFx.ts` | Detecta scroll-timeline nativo e troca `overflow: hidden` por `clip` nos ancestrais (o `hidden` quebra o `view()`) |
| `public/img/` | Imagens WebP |
| `vercel.json` | Reescreve as rotas pro `index.html`; sem isso a Vercel devolve 404 em `/blog` |
| `index.html` | Pré-carga da foto do hero (desktop e mobile) |
| `package.json` | Nova dependência: `lenis` |

## Como rodar

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

Dicas para testar:
- Com o Lenis ativo, `window.scrollTo` é ignorado no desktop; use `scrollToY` de `SmoothScroll.tsx`.
- A entrada só aparece uma vez por sessão. Para ver de novo, apague `cp-entrada-vista` do `sessionStorage`.

## Antes do deploy oficial
- [ ] Zion confirma a crase em "àquela pessoa".
- [ ] Conteúdo real dos artigos, ou esconder o blog até ter conteúdo.
- [ ] Definir medição (GA4 / GTM / pixel) e eventos do WhatsApp.
- [ ] Definir o domínio da Dra. e o projeto da Vercel que vai servir o site.
- [ ] Trocar `og:image` e `twitter:image` do `index.html` para URL absoluta com o domínio final (hoje `/assets/BannerDesktop.png`; WhatsApp e redes não leem caminho relativo).
- [ ] Conferir no celular real (iPhone e Android) depois do deploy.
