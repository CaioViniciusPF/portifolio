# CLAUDE.md — GSAPtest

## Contexto do Projeto
- Site-currículo single page com foco em estudo de GSAP
- Cada seção usa uma feature diferente do GSAP
- Portfólio real de Caio Vinicius — conteúdo vem de `src/lib/data.ts`

## Stack
- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS
- GSAP + @gsap/react (usar sempre `useGSAP` ao invés de `useEffect` para animações)
- `next-themes` (dark/light mode)

## Comandos do Projeto
- Rodar em dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Estrutura de Pastas
```
src/
  app/          → layout.tsx, page.tsx, globals.css
  components/
    sections/   → seções da página (Hero, About, Skills, etc)
    ui/         → componentes reutilizáveis (Navbar, ThemeProvider)
    animations/ → hooks e utilitários de animação GSAP
  lib/
    data.ts     → todos os dados do currículo centralizados
  types/
    index.ts    → tipagens globais
public/
  images/
    hero.jpeg              → foto do Hero
    projects/              → screenshots dos projetos
      wisecontrol.png      → adicionar quando disponível
      portfolio.png        → adicionar quando disponível
```

## Sistema de Temas (dark/light)

### Como funciona
- `next-themes` gerencia o tema via `ThemeProvider` em `layout.tsx`
- O tema alterna a classe `.dark` no `<html>` → muda as CSS custom properties em `globals.css`
- `defaultTheme="dark"` — escuro por padrão; persiste em `localStorage`
- Toggle no Navbar (ícone sol/lua) via `useTheme()` com `mounted` guard

### Variáveis de cor (`globals.css`)
| Token Tailwind | Modo claro | Modo escuro |
|---|---|---|
| `bg-background` | `#fcfade` | `#12122b` |
| `bg-surface` | `#f0eed4` | `#383845` |
| `text-text-main` | `#452d3d` | `#fcfade` |
| `text-text-muted` | `#7a6070` | `#848478` |
| `text-accent` | `#d55d63` | `#548c82` |
| `border-border` | `#d1ce95` | `#383845` |
| `text-primary` | `#548c82` | `#aaaa91` |
| `text-secondary` | `#d1ce95` | `#848478` |

### Regra crítica
**Todo novo componente ou estilo deve usar os tokens do tema (`text-accent`, `bg-surface`, etc.), nunca cores hardcoded (`#fff`, `text-white`, `bg-gray-900`).** Isso garante que dark e light mode funcionem automaticamente.

## Regras de Código
- Sempre usar TypeScript, nunca JavaScript puro
- Componentes sempre com tipagem explícita nas props
- Dados do currículo sempre vindo de `src/lib/data.ts`, nunca hardcoded nos componentes
- Animações GSAP sempre usando `useGSAP` (hook oficial do `@gsap/react`)
- Estilização com Tailwind usando os tokens de cor do tema — nunca cores fixas
- Componentes funcionais com hooks, nunca class components
- Sem comentários no código, exceto quando o porquê for não óbvio

## Seções e suas features GSAP
| Seção | Feature GSAP | Status |
|---|---|---|
| Hero | `TextPlugin` (digitação) + `timeline` + slide | Implementado |
| Sobre mim | `ScrollTrigger` fade | Implementado (MVP) |
| Habilidades | `stagger` nas tags | Implementado (MVP) |
| Projetos | `ScrollTrigger` + stagger nos cards | Implementado |
| Experiência | `stagger` sequencial | Implementado (MVP) |
| Contato | `stagger` nos cards | Implementado (MVP) |

> MVP usa animações simples (`gsap.from` + `ScrollTrigger`) em todas as seções.
> Animações mais complexas ficam para iterações futuras.

## Hero — Animação em dois atos

### Fase 1 — Apresentação (centralizada)
Texto digitado com `TextPlugin` no centro da tela:
1. `data.greeting` — fonte grande bold (mesmo tamanho do nome)
2. `data.name` — fonte grande bold
3. `data.roles[0]` — fonte menor mono

### Fase 2 — Transição
- `tl.call()` mede o offset de centralização via `getBoundingClientRect`, soma ao `x` do bloco e troca `textAlign` no mesmo frame → deslize suave sem snap
- Bloco desliza para a esquerda com `power3.inOut`
- Foto aparece à direita (desktop only) com `power3.out`
- Botões CTA aparecem com `autoAlpha` (sem reflow)
- Navbar dispara `window.dispatchEvent(new CustomEvent("hero:ready"))` → Navbar anima entrada

### Coordenação Hero → Navbar
Hero despacha `hero:ready` no mesmo momento que os botões aparecem (`transition+=1.0`). Navbar escuta o evento via `useEffect` e anima entrada.

## Adicionando imagens de projetos

1. Salvar em `public/images/projects/nome-do-projeto.png` (kebab-case, sem espaços)
2. Em `data.ts`, adicionar `image: "/images/projects/nome-do-projeto.png"` na entrada correspondente
3. O componente `Projects.tsx` usa `<Image fill>` quando `image` existe, e fallback de gradiente quando não existe

## Padrão de Commits

Seguir Conventional Commits. Nunca adicionar assinatura `Co-Authored-By`.

**Tipos:**
- `feat:` — nova funcionalidade
- `fix:` — correção de bug
- `chore:` — configuração, dependências, build
- `style:` — ajustes visuais/CSS sem mudança de lógica
- `refactor:` — reorganização de código sem mudança de comportamento
- `docs:` — documentação

**Formato:**
```
tipo(escopo): descrição curta em minúsculo

Corpo opcional explicando o porquê da mudança (não o que).
```

**Exemplos:**
```
feat(projects): add Projects section with gradient fallback
fix(navbar): animation firing twice on remount
chore(deps): upgrade to Next.js 15 + React 19
style(hero): speed up text animation by 25%
docs(readme): rewrite as technical business card
```

## O que NÃO fazer
- Não usar `useEffect` para animações GSAP
- Não criar dados hardcoded nos componentes
- Não usar cores hardcoded — sempre tokens do tema
- Não instalar bibliotecas novas sem avisar e justificar
