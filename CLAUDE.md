# CLAUDE.md — GSAPtest

## Projeto
Site-currículo single page de Caio Vinicius. Foco em estudo de GSAP — cada seção explora uma feature diferente. Conteúdo sempre vem de `src/lib/data.ts`, nunca hardcoded nos componentes.

## Stack
- Next.js 15+ (App Router), TypeScript, Tailwind CSS
- GSAP + `@gsap/react` — usar sempre `useGSAP`, nunca `useEffect` para animações
- Plugins GSAP registrados **só** em `src/lib/gsap.ts` — importar `gsap`/`useGSAP`/`ScrollTrigger`/`SplitText` de `@/lib/gsap`, nunca de `gsap` direto
- `lenis` — smooth scroll (dirigido pelo ticker do GSAP em `ui/SmoothScroll.tsx`; `scroll-behavior: smooth` foi removido do CSS; âncoras com `anchors: { offset: -80 }`)
- `three` — só as partículas do Hero (`components/three/HeroParticles.tsx`, lazy via `next/dynamic`)
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
    three/      → HeroParticles (campo de pontos WebGL do Hero)
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
- Animações respeitam `prefers-reduced-motion`: branch `MOTION_OK` completo, branch `REDUCED` com `gsap.set` para estado final — e eventos de contrato (`hero:ready`) disparam nos **dois** branches
- Scrub/parallax só em desktop (≥768px); mobile ganha reveals simples

## Seções × GSAP
| Seção | Feature |
|---|---|
| Hero | `TextPlugin` (greeting/role) + `SplitText` mask no nome + clip reveal na foto + partículas three.js + parallax de saída |
| Sobre mim | `ScrollTrigger` fade |
| Habilidades | `stagger` nas tags |
| Projetos | galeria horizontal com pin + scrub (desktop; mobile mantém linhas verticais com clip reveal), `SplitText` no headline, parallax horizontal via `containerAnimation`, painel tipográfico outlined no placeholder |
| Experiência | `stagger` sequencial |
| Contato | `stagger` nos cards |

## Sistema de Temas
`next-themes` alterna a classe `.dark` no `<html>`, trocando as CSS custom properties definidas em `globals.css`. Todo componente usa tokens Tailwind mapeados para essas variáveis — o tema funciona automaticamente.

**Transição animada — View Transition API:**
- `Navbar.tsx` seta `--vt-x`/`--vt-y` no `document.documentElement` com a posição do botão, depois chama `document.startViewTransition(() => setTheme(targetTheme))`
- Fallback sem animação via `setTheme()` direto para browsers sem suporte
- `globals.css` define `@keyframes vt-reveal` (`clip-path: circle(0 → 150vmax)`) aplicado em `::view-transition-new(root)`, respeitando `prefers-reduced-motion`
- `src/types/global.d.ts` declara os tipos de `document.startViewTransition`

## Hero — Animação em dois atos
**Ato 1:** greeting digitado via `TextPlugin` (mono, escala de eyebrow) → nome gigante em `font-display` revelado com `SplitText` chars + mask (`yPercent 110→0`), ponto accent com scale pop → role digitado.

**Ato 2:** texto desliza de centralizado (`x: shift`) para `x: 0`; foto (desktop) revela com `clip-path: inset(100%→0)` + `scale 1.15→1`, bloco accent offset atrás, grayscale com hover colorido. CTA usa `autoAlpha`. Hero despacha `hero:ready` em `"transition+=1.0"` → Navbar escuta e anima entrada (no branch reduced dispara via `delayedCall`). Parallax de saída: texto sobe e partículas esmaecem com scrub.

**Partículas:** `HeroParticles` lê `--color-accent`/`--color-primary` via `getComputedStyle` e observa a classe do `<html>` (MutationObserver) para retween das cores na troca de tema. Pausa fora de vista (IntersectionObserver), DPR cap 1.5, disposal completo no unmount, não monta em reduced motion.

## Idiomas (pt-BR / en)
`LanguageProvider` (context, persiste em `localStorage`) + toggle na Navbar (texto "PT" ↔ "EN"). `SiteContent.tsx` escolhe `siteData` ou `siteDataEn` e usa `key={locale}` para remontar as seções — as animações GSAP (incl. typing do Hero) replays na troca. Textos de UI (títulos de seção, "Currículo", "Ver site" etc.) vêm todos de `data.ts`/`data.en.ts` — nada de string visível hardcoded em componente. Ao adicionar conteúdo, **sempre atualizar os dois arquivos**.

## Formulário de contato
`ContactForm.tsx` (textos em `data.ts → contact.form`) posta para `/api/contact`, que envia via Resend para `contact.email`. Requer `RESEND_API_KEY` (`.env.example`); sem domínio verificado, o `from` é `onboarding@resend.dev` e o `replyTo` carrega o email do remetente. Proteções no servidor: validação de tipos/tamanhos, honeypot (`company`, responde sucesso falso), rate limit em memória (3 req/10min por IP) e escape de HTML no corpo do email.

## Imagens de projetos
Salvar em `public/images/projects/nome.png`, adicionar `image: "/images/projects/nome.png"` na entrada em `data.ts`. `Projects.tsx` usa `<Image fill>` se existir, gradiente fallback se não.

## Commits
`tipo(escopo): descrição curta em minúsculo` — sem `Co-Authored-By`.
Tipos: `feat` `fix` `style` `refactor` `chore` `docs`
