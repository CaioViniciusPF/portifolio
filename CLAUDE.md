# CLAUDE.md — GSAPtest

## Projeto
Site-currículo single page de Caio Vinicius. Foco em estudo de GSAP — cada seção explora uma feature diferente. Conteúdo sempre vem de `src/lib/data.ts`, nunca hardcoded nos componentes.

## Stack
- Next.js 15+ (App Router), TypeScript, Tailwind CSS
- GSAP + `@gsap/react` — usar sempre `useGSAP`, nunca `useEffect` para animações
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
    ui/         → Navbar, ThemeProvider, ThemeTransition, LanguageProvider
  lib/
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

## Seções × GSAP
| Seção | Feature |
|---|---|
| Hero | `TextPlugin` + `timeline` + slide |
| Sobre mim | `ScrollTrigger` fade |
| Habilidades | `stagger` nas tags |
| Projetos | `ScrollTrigger` + stagger nos cards |
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
**Fase 1:** `TextPlugin` digita greeting → name → role[0], tudo centralizado na tela via `gsap.set(textRef, { x: shift })`.

**Fase 2:** `tl.call()` mede o offset com `getBoundingClientRect`, soma ao `x` atual e troca `textAlign` no mesmo frame (sem snap visual), depois anima `x → 0`. Foto aparece à direita (desktop). CTA usa `autoAlpha` para preservar espaço no layout e evitar reflow. Hero despacha `hero:ready` ao fim → Navbar escuta e anima entrada.

## Idiomas (pt-BR / en)
`LanguageProvider` (context, persiste em `localStorage`) + toggle na Navbar (texto "PT" ↔ "EN"). `SiteContent.tsx` escolhe `siteData` ou `siteDataEn` e usa `key={locale}` para remontar as seções — as animações GSAP (incl. typing do Hero) replays na troca. Textos de UI (títulos de seção, "Currículo", "Ver site" etc.) vêm todos de `data.ts`/`data.en.ts` — nada de string visível hardcoded em componente. Ao adicionar conteúdo, **sempre atualizar os dois arquivos**.

## Formulário de contato
`ContactForm.tsx` (textos em `data.ts → contact.form`) posta para `/api/contact`, que envia via Resend para `contact.email`. Requer `RESEND_API_KEY` (`.env.example`); sem domínio verificado, o `from` é `onboarding@resend.dev` e o `replyTo` carrega o email do remetente. Proteções no servidor: validação de tipos/tamanhos, honeypot (`company`, responde sucesso falso), rate limit em memória (3 req/10min por IP) e escape de HTML no corpo do email.

## Imagens de projetos
Salvar em `public/images/projects/nome.png`, adicionar `image: "/images/projects/nome.png"` na entrada em `data.ts`. `Projects.tsx` usa `<Image fill>` se existir, gradiente fallback se não.

## Commits
`tipo(escopo): descrição curta em minúsculo` — sem `Co-Authored-By`.
Tipos: `feat` `fix` `style` `refactor` `chore` `docs`
