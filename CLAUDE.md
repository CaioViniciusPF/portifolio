# CLAUDE.md — GSAPtest

## Projeto
Site-currículo single page de Caio Vinicius. Foco em estudo de GSAP — cada seção explora uma feature diferente. Conteúdo sempre vem de `src/lib/data.ts`, nunca hardcoded nos componentes.

## Stack
- Next.js 15+ (App Router), TypeScript, Tailwind CSS
- GSAP + `@gsap/react` — usar sempre `useGSAP`, nunca `useEffect` para animações
- Plugins GSAP registrados **só** em `src/lib/gsap.ts` (inclui `ScrollTrigger`, `SplitText`, `TextPlugin`, `DrawSVGPlugin`, `ScrambleTextPlugin` — todos gratuitos desde GSAP 3.13+) — importar de `@/lib/gsap`, nunca de `gsap` direto
- `lenis` — smooth scroll (dirigido pelo ticker do GSAP em `ui/SmoothScroll.tsx`; `scroll-behavior: smooth` foi removido do CSS; âncoras com `anchors: { offset: -80 }`)
- `three` — cena espacial do Hero (`components/three/HeroSpace.tsx`: planeta de pontos + fluido de mouse) e forma morfante do Contact (`components/three/MorphShape.tsx`), ambos lazy via `next/dynamic`; addons importam de `three/addons/...` (ex.: `three/addons/math/MeshSurfaceSampler.js`) — o caminho `three/examples/jsm` não resolve mais
- Fontes via `next/font`: Bricolage Grotesque (`font-display`), Instrument Sans (`font-sans`), JetBrains Mono (`font-mono`)
- `next-themes` — dark/light mode

## Comandos
```
npm run dev   npm run build   npm run lint
```

## Estrutura
```
src/
  app/          → layout.tsx, page.tsx, globals.css
    api/contact/route.ts → envio do form de contato (Resend)
  components/
    SiteContent.tsx → client wrapper que escolhe os dados pelo idioma
    sections/   → Hero, About, Skills, Projects, Experience, Contact, ContactForm
    three/      → HeroSpace (planeta de pontos + fluido do Hero), MorphShape (Contact)
    ui/         → Navbar, ThemeProvider, LanguageProvider, SmoothScroll
  lib/
    gsap.ts     → registro central de plugins GSAP + constantes MOTION_OK/REDUCED/DESKTOP
    data.ts     → dados do currículo (pt-BR)
    data.en.ts  → dados em inglês — manter em sincronia com data.ts
  types/index.ts
public/images/
  hero.jpeg
  projects/     → kebab-case, sem espaços
```

## Regras
- TypeScript sempre; props tipadas explicitamente
- Tailwind com tokens do tema (`text-accent`, `bg-surface`, etc.) — nunca cores hardcoded
- Componentes funcionais com hooks, sem class components
- Sem comentários, exceto quando o porquê for não-óbvio
- **Nunca** aplicar `transition-transform` (CSS) num elemento que o GSAP anima via transform — o transition intercepta as escritas do GSAP e o elemento trava no meio (aconteceu no h3 de Projects; hover em span interno resolve)
- **Sempre** usar `type: "chars, words"` (não só `"chars"`) no `SplitText.create` de qualquer headline que possa quebrar linha — só `"chars"` deixa o navegador quebrar no meio da palavra, porque cada char vira um span isolado sem noção de limite de palavra (aconteceu no "Vamos conversar." do Contact)
- Animações respeitam `prefers-reduced-motion`: branch `MOTION_OK` completo, branch `REDUCED` com `gsap.set` para estado final — e eventos de contrato (`hero:ready`) disparam nos **dois** branches. **Todo** `useGSAP` do projeto segue esse padrão, sem exceção (o `ContactForm` ficou de fora numa passada e o form ficava animando mesmo com reduced-motion ligado — corrigido)
- Scrub/parallax só em desktop (≥768px); mobile ganha reveals simples
- Layouts que mudam de estrutura via CSS responsivo (`md:flex-row` etc.) **e** dependem de JS/GSAP para funcionar (pin, scrub) precisam de um fallback `motion-reduce:` no Tailwind — se o layout desktop só funciona com o pin do ScrollTrigger e o pin nunca é criado sob reduced-motion, o CSS sozinho pode deixar conteúdo preso/inacessível (aconteceu na galeria horizontal de Projects: com reduced-motion + desktop, `md:w-max md:overflow-hidden` sem o pin escondia os projetos além do primeiro — corrigido com `motion-reduce:!flex-col motion-reduce:!overflow-visible` etc.)
- Nunca combinar `backdrop-filter`/`backdrop-blur` com animação de `clip-path` no mesmo elemento — produz artefato visual de "fantasma"/ghosting no Chromium. Para overlays fullscreen (menu mobile), preferir fundo sólido (sem transparência) e animar só opacity/transform
- Filho decorativo com `-z-10` dentro de elemento com `bg-*` exige `isolate` no pai (junto do `relative`) — sem stacking context próprio, o filho negativo é pintado atrás do background do pai e some (aconteceu com os selos de gradiente dos divisores de seção e com as partículas do Hero vs. `bg-background` do `<main>`)
- **Nunca** combinar `DrawSVGPlugin` com `vectorEffect="non-scaling-stroke"` num SVG esticado por `viewBox` + `preserveAspectRatio="none"` — o `getTotalLength()` devolve unidades do viewBox, mas o `stroke-dasharray` sob non-scaling-stroke é aplicado em px de tela, então a linha desenha só uma fração da altura real e nunca completa (aconteceu na timeline de Experiência: `viewBox="0 0 4 100"` numa div de ~900px desenhava no máximo 100px). Solução: SVG **sem** `viewBox` (unidades = px, mapeamento 1:1) e o `d` do path escrito por JS a partir do `offsetHeight` medido, ressincronizado no `refreshInit` do ScrollTrigger + `ResizeObserver`, com `invalidateOnRefresh: true` no tween para o DrawSVG reler o comprimento
- `ScrambleTextPlugin` num `.to()` disparado por ScrollTrigger embaralha do texto atual para ele mesmo — se o elemento já estiver visível, o usuário vê o texto **correto** e só depois ele embaralha, o que parece bug. O elemento precisa estar escondido até o embaralhamento começar (no Experience o scramble entra na posição `0` da timeline do item, junto do `from(item, { autoAlpha: 0 })`)
- Vários `ScrollTrigger` independentes com `start` levemente diferentes no mesmo elemento (item + dot + período) fazem o reveal parecer desconexo — preferir **uma** `gsap.timeline({ scrollTrigger })` por item e orquestrar as partes por posição na timeline
- Modificadores de alpha do Tailwind em tokens do tema (`text-text-main/[0.07]`, `bg-accent/70` etc.) são **silenciosamente ignorados** — as cores em `tailwind.config.ts` são strings `var(--color-*)` sem `<alpha-value>`, então a classe gera a cor 100% opaca. Para transparência usar a propriedade `opacity-*` num elemento dedicado (aconteceu na numeração fantasma de Projects, que saiu escura sólida em vez de 7%)

## Seções × GSAP
| Seção | Feature |
|---|---|
| Hero | `TextPlugin` (greeting/role) + `SplitText` mask no nome + clip reveal na foto + cena espacial three.js (planeta de pontos + fluido) + parallax de saída |
| Sobre mim | `SplitText` no headline; parágrafos com reveal de linha scrubado (opacidade sobe conforme a leitura "alcança" a linha); faixa de stats editorial no lugar dos cards; headline sticky no desktop |
| Habilidades | `SplitText` no headline; categorias em texto grande com tags mono inline (sem mais pills), stagger por tag |
| Projetos | galeria horizontal com pin + scrub — o título fica fixo fora do track (só os cards rolam); slides com imagem e texto lado a lado, numeração gigante translúcida (`opacity-[0.08]`) atrás do texto; mobile e reduced-motion caem para pilha vertical via `motion-reduce:`; parallax horizontal via `containerAnimation`, painel tipográfico outlined no placeholder |
| Experiência | `SplitText` no headline; timeline desenhada com `DrawSVGPlugin` (scrub), dots com `back.out`, períodos com `ScrambleTextPlugin` no reveal |
| Contato | `SplitText` no headline (`ctaHeadline`); form à esquerda com o `MorphShape` 3D ao lado (só ≥lg); 4 cards (email/GitHub/LinkedIn/localização) numa linha abaixo do form, com stagger |

## Divisores de seção
Sem `border-t` e sem alternância de cor entre seções — todas ficam no fundo padrão e a separação é só pelo espaço em branco (`py-32 md:py-40`). Já foram testadas e descartadas duas ideias: linha condutora SVG (ScrollThread) e alternância `bg-background`/`bg-surface` com selos de gradiente na passagem. Não reintroduzir divisor visual sem o Caio pedir.

## Fundos decorativos
- **Brilhos**: divs `aria-hidden` com `bg-[radial-gradient(closest-side,var(--color-accent|primary),transparent_72%)]` + `opacity-[0.07~0.10]`, posicionadas absolutas com `-z-10` em About/Skills/Experience/Contact (seções com `relative isolate`; as que têm decoração pendurada à direita usam `overflow-x-clip` para não criar scroll horizontal — overflow à esquerda não cria scrollbar). CSS puro, estático.
- **MorphShape** (`three/MorphShape.tsx`): nuvem de ~1800 pontos (900 mobile) amostrada com `MeshSurfaceSampler` de 4 geometrias (icosaedro → torus knot → torus → octaedro), morfando a cada ~7,5s (uniform `uProgress` + stagger por ponto no vertex shader) com rotação lenta contínua. Fica na coluna direita do grid do Contact, ao lado do formulário (wrapper `hidden lg:block`), com sombra elíptica estática embaixo (`radial-gradient` preto, `opacity-25` — no tema escuro ela some naturalmente). O effect tem guard de tamanho zero: se o wrapper estiver escondido (mobile), o WebGL nem é criado. Segue os padrões de higiene WebGL do projeto: cores dos tokens + MutationObserver, pausa fora de vista, DPR cap 1.5, disposal no unmount, não monta em reduced-motion.

## Sistema de Temas
`next-themes` alterna a classe `.dark` no `<html>`, trocando as CSS custom properties definidas em `globals.css`. Todo componente usa tokens Tailwind mapeados para essas variáveis — o tema funciona automaticamente.

**Navbar:** indicador de seção ativa via `IntersectionObserver` (não ScrollTrigger — mais simples e independente de motion) com `rootMargin: "-45% 0px -45% 0px"`, atualiza `activeHref` e sublinha o link correspondente. Menu mobile: `lenis.stop()/start()` (via `useLenis()`) trava o scroll por trás do overlay; cai para `document.body.style.overflow` só se o Lenis não estiver montado (reduced-motion). Overlay do menu usa fundo **sólido** (sem blur) — ver regra de `backdrop-filter` + `clip-path` acima.

**Transição animada — View Transition API:**
- `Navbar.tsx` seta `--vt-x`/`--vt-y` no `document.documentElement` com a posição do botão, depois chama `document.startViewTransition(() => setTheme(targetTheme))`
- Fallback sem animação via `setTheme()` direto para browsers sem suporte
- `globals.css` define `@keyframes vt-reveal` (`clip-path: circle(0 → 150vmax)`) aplicado em `::view-transition-new(root)`, respeitando `prefers-reduced-motion`
- `src/types/global.d.ts` declara os tipos de `document.startViewTransition`

## Hero — Animação em dois atos
**Ato 1:** greeting digitado via `TextPlugin` (mono, escala de eyebrow) → nome gigante em `font-display` revelado com `SplitText` chars + mask (`yPercent 110→0`), ponto accent com scale pop → role digitado.

**Ato 2:** texto desliza de centralizado (`x: shift`) para `x: 0`; foto (desktop) revela com `clip-path: inset(100%→0)` + `scale 1.15→1`, bloco accent offset atrás, grayscale com hover colorido. CTA usa `autoAlpha`. Hero despacha `hero:ready` em `"transition+=1.0"` → Navbar escuta e anima entrada (no branch reduced dispara via `delayedCall`). Parallax de saída: texto sobe e partículas esmaecem com scrub.

**Fundo espacial (`HeroSpace`):** planeta tipo Saturno feito de pontos — esfera de Fibonacci (~4200 pts, 1800 mobile) com iluminação fake no vertex shader (terminador dia/noite suave via `dot(normal, uLightDir)` + rim light), anel com bandas de densidade e divisão de Cassini (~2800 pts), estrelas com twinkle e glow atmosférico (quad com gradiente radial). Rotação lenta contínua (esfera e anel em velocidades diferentes). **Névoa de gás:** quad fullscreen em NDC (`renderOrder -1`, `frustumCulled false`) com FBM de 4 oitavas nas cores primary/accent, alpha ~0.4 — deriva sozinha com o tempo e é "mexida" pelo flowmap do mouse (offset das coordenadas do noise + brilho no rastro). No tema claro o uniform `uNebulaTone` (0 claro / 1 escuro, animado junto do MutationObserver de tema) mistura a névoa com `--color-background` e reduz o alpha, para ela não sujar o fundo. **Fluido de mouse:** flowmap ping-pong 256×256 (velocidade com decay 0.972 + advecção) alimentado pelo pointer; todos os shaders de ponto amostram o flowmap e deslocam `gl_Position` em NDC (força 0.06, suave) — os pontos escorrem ao redor do cursor. Só ativa em `(hover: hover)`; a névoa continua derivando sem mouse. Higiene padrão: cores dos tokens + MutationObserver, pausa fora de vista, DPR cap 1.5, disposal completo, não monta em reduced motion (fica só a grade CSS estática).

## Idiomas (pt-BR / en)
`LanguageProvider` (context, persiste em `localStorage`) + toggle na Navbar (texto "PT" ↔ "EN"). `SiteContent.tsx` escolhe `siteData` ou `siteDataEn` e usa `key={locale}` para remontar as seções — as animações GSAP (incl. typing do Hero) replays na troca. Textos de UI (títulos de seção, "Currículo", "Ver site" etc.) vêm todos de `data.ts`/`data.en.ts` — nada de string visível hardcoded em componente. Ao adicionar conteúdo, **sempre atualizar os dois arquivos**.

## Formulário de contato
`ContactForm.tsx` (textos em `data.ts → contact.form`) posta para `/api/contact`, que envia via Resend para `contact.email`. Requer `RESEND_API_KEY` (`.env.example`); sem domínio verificado, o `from` é `onboarding@resend.dev` e o `replyTo` carrega o email do remetente. Proteções no servidor: validação de tipos/tamanhos, honeypot (`company`, responde sucesso falso), rate limit em memória (3 req/10min por IP) e escape de HTML no corpo do email.

## Imagens de projetos
Salvar em `public/images/projects/nome.png`, adicionar `image: "/images/projects/nome.png"` na entrada em `data.ts`. `Projects.tsx` usa `<Image fill>` se existir, gradiente fallback se não.

## Commits
`tipo(escopo): descrição curta em minúsculo` — sem `Co-Authored-By`.
Tipos: `feat` `fix` `style` `refactor` `chore` `docs`
