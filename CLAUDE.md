# CLAUDE.md — GSAPtest

## Contexto do Projeto
- Site-currículo single page com foco em estudo de GSAP
- Cada seção futuramente usará uma feature diferente do GSAP

## Stack
- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS
- GSAP + @gsap/react (usar sempre useGSAP ao invés de useEffect para animações)

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
    ui/         → componentes reutilizáveis (Navbar, Footer)
    animations/ → hooks e utilitários de animação GSAP
  lib/
    data.ts     → todos os dados do currículo centralizados
  types/
    index.ts    → tipagens globais
```

## Regras de Código
- Sempre usar TypeScript, nunca JavaScript puro
- Componentes sempre com tipagem explícita nas props
- Dados do currículo sempre vindo de `src/lib/data.ts`, nunca hardcoded nos componentes
- Animações GSAP sempre usando `useGSAP` (hook oficial do `@gsap/react`)
- Estilização com Tailwind, GSAP apenas para animações
- Componentes funcionais com hooks, nunca class components

## Plano de Seções e suas features GSAP
| Seção | Feature GSAP | Status |
|---|---|---|
| Hero | `gsap.from()` + `TextPlugin` | Implementado |
| Sobre mim | `ScrollTrigger` com fade | Pendente |
| Habilidades | `stagger` nas barras de progresso | Pendente |
| Projetos | `ScrollTrigger` + `scrub` nos cards | Pendente |
| Experiência | `gsap.timeline()` na linha do tempo | Pendente |
| Contato | `gsap.from()` com ease personalizado | Pendente |

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
tipo: descrição curta em minúsculo

Corpo opcional explicando o porquê da mudança (não o que).
```

**Exemplos:**
```
feat: add About section with ScrollTrigger fade-in
fix: navbar animation firing twice on remount
chore: upgrade to Next.js 15 + React 19
```

## O que NÃO fazer
- Não usar `useEffect` para animações GSAP
- Não criar dados hardcoded nos componentes
- Não criar todas as seções de uma vez — construir uma por vez
- Não instalar bibliotecas novas sem avisar e justificar
