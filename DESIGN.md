---
name: Portfólio Caio Vinicius
description: Portfólio-laboratório de GSAP/three.js — pontilhismo espacial com rigor editorial
colors:
  coral-nebulosa: "#d55d63"
  teal-anel: "#548c82"
  creme-solar: "#fcfade"
  vinho-eclipse: "#452d3d"
  malva-apagada: "#7a6070"
  poeira-de-estrela: "#f0eed4"
  ouro-palido: "#d1ce95"
  meia-noite-sideral: "#12122b"
  salvia-lunar: "#aaaa91"
  cinza-poeira: "#848478"
  cinza-cratera: "#383845"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(3.5rem, 12vw, 8rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.1em"
rounded:
  sm: "4px"
  md: "8px"
  full: "9999px"
spacing:
  gutter: "24px"
  block: "48px"
  section: "128px"
  section-lg: "160px"
components:
  button-primary:
    backgroundColor: "{colors.coral-nebulosa}"
    textColor: "{colors.creme-solar}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.coral-nebulosa}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.poeira-de-estrela}"
    textColor: "{colors.vinho-eclipse}"
    rounded: "{rounded.md}"
    padding: "20px"
  input:
    backgroundColor: "{colors.poeira-de-estrela}"
    textColor: "{colors.vinho-eclipse}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.malva-apagada}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
---

# Design System: Portfólio Caio Vinicius

## 1. Overview

**Creative North Star: "O Planetário Pontilhista"**

Um planetário é uma sala onde o cosmos vira espetáculo coreografado — e é isso que este site é. A matéria-prima visual é o **ponto**: o planeta do Hero, os anéis, as estrelas, a nuvem morfante do Contact são todos nuvens de pontos nas cores do tema, nunca superfícies sólidas. O projetor desse planetário é o **GSAP**: o motion não decora, ele é a assinatura — typewriter, SplitText com máscara, pin + scrub horizontal, timeline desenhada, morph 3D. Cada seção existe para demonstrar uma capacidade diferente da biblioteca; repetir o mesmo efeito em dois lugares é falha de repertório.

Ao redor do espetáculo, rigor editorial: tipografia display pesada e apertada, prosa contida em colunas legíveis, voz "code" em mono para tudo que é meta (navegação, tags, datas). A separação entre seções é só respiro — sem linhas, sem alternância de cor, sem divisores (já testados e descartados). O sistema rejeita explicitamente o template de portfólio dev genérico: grids de cards uniformes, pills de skills, hero-metric.

**Key Characteristics:**
- Pontilhismo WebGL nas cores do tema — decoração lê tokens em runtime e sobrevive à troca claro/escuro
- Motion GSAP como assinatura, com branch `REDUCED` funcional em todo `useGSAP`
- Editorial: display Bricolage forte + prosa Instrument + voz mono JetBrains
- Plano por doutrina: profundidade vem de cor e borda, não de sombra
- Dois céus (claro solar, escuro sideral) trocados por CSS custom properties com View Transition circular

## 2. Colors

Dois céus para o mesmo planetário: o claro é papel quente sob luz de dia; o escuro é o espaço de verdade — os mesmos pontos brilham diferente em cada um.

### Primary
- **Coral de Nebulosa** (#d55d63): o accent do tema claro — CTAs, sublinhados, o ponto final do nome, seleção de texto. É a cor que assina.
- **Teal de Anel** (#548c82): primary do tema claro e accent do tema escuro — segunda voz dos pontos WebGL, hovers e CTAs no escuro.

### Secondary
- **Sálvia Lunar** (#aaaa91): primary do tema escuro — segunda voz dos pontos sobre o navy.
- **Ouro Pálido** (#d1ce95): borda e secondary do tema claro — hairlines de 1px, divisórias de grid.

### Neutral
- **Creme Solar** (#fcfade): fundo do tema claro e texto do tema escuro.
- **Meia-Noite Sideral** (#12122b): fundo do tema escuro — o céu profundo do planetário.
- **Vinho de Eclipse** (#452d3d): texto principal do tema claro.
- **Malva Apagada** (#7a6070): texto secundário do claro. **Cinza-Poeira** (#848478): texto secundário e secondary do escuro.
- **Poeira de Estrela** (#f0eed4): surface do claro (cards, inputs, mídia). **Cinza de Cratera** (#383845): surface e borda do escuro.

### Named Rules
**A Regra do Token Único.** Toda cor entra por token Tailwind mapeado para `var(--color-*)` — nunca hex hardcoded em componente. Decoração WebGL/JS lê os tokens via `getComputedStyle` e observa a classe do `<html>` (MutationObserver) para retween na troca de tema.

**A Regra da Opacidade Honesta.** Modificadores de alpha do Tailwind (`text-accent/70`, `bg-x/[0.07]`) são **silenciosamente ignorados** neste projeto (tokens sem `<alpha-value>`) — a classe gera cor 100% opaca. Transparência se faz com `opacity-*` em elemento dedicado, sempre.

## 3. Typography

**Display Font:** Bricolage Grotesque (sans-serif)
**Body Font:** Instrument Sans (sans-serif)
**Label/Mono Font:** JetBrains Mono (monospace)

**Character:** display grotesca com personalidade e peso máximo contra prosa humanista discreta — e a terceira voz, mono, que dá o sotaque de código do site (typewriter do Hero, navegação numerada, tags, datas).

### Hierarchy
- **Display** (700, `clamp(3.5rem, 12vw, 8rem)`, lh 0.95, ls -0.03em): só o nome no Hero. Uma vez por página.
- **Headline** (700, 3rem → 4.5rem no desktop, ls -0.02em): título de cada seção; o do Contact sobe para 6rem como finale.
- **Title** (700, 1.5rem–3rem): títulos de projeto, cargos da timeline, valores dos stats.
- **Body** (400, 1rem–1.25rem, lh 1.625): prosa, sempre com trava de medida (`max-w-[45ch]`–`[60ch]`).
- **Label** (400, 0.75rem–0.875rem, tracking 0.1em, uppercase quando rótulo): tudo que é mono — nav, tags, labels de form, datas, contextos.

### Named Rules
**A Regra das Três Vozes.** Display fala manchete, Instrument fala prosa, mono fala código. Um elemento nunca troca de voz: se é meta-informação (rótulo, data, tag, nav), é mono; se é leitura, é Instrument; se é impacto, é Bricolage.

**A Regra do SplitText Inteiro.** Todo `SplitText.create` de headline que pode quebrar linha usa `type: "chars, words"` — só `"chars"` deixa o navegador quebrar no meio da palavra.

## 4. Elevation

Plano por doutrina. A profundidade vem de **camadas de cor** (surface sobre background), **hairlines de 1px** (`border-border`) e **oclusão pontilhista** (decoração WebGL atrás do conteúdo com `-z-10`). Sombra existe em exatamente dois lugares, ambos com justificativa física: a navbar ganha `shadow-lg` quando flutua sobre conteúdo rolado, e a forma 3D do Contact projeta uma sombra elíptica estática no "chão" para parecer que flutua. Qualquer sombra nova precisa de uma justificativa física equivalente.

### Named Rules
**A Regra do Plano.** Superfícies são planas em repouso. Se um elemento parece precisar de sombra para se destacar, o problema é de cor ou de espaço — resolva lá.

**A Regra do Isolate.** Filho decorativo com `-z-10` dentro de elemento com `bg-*` exige `relative isolate` no pai — sem stacking context próprio, o filho é pintado atrás do fundo do pai e some.

## 5. Components

Refinados e contidos: cantos discretos, bordas de 1px, hovers de cor — a personalidade fica com o motion GSAP, não com o chrome. Nenhum componente grita.

### Buttons
- **Shape:** cantos levemente arredondados (4px)
- **Primary:** fundo Coral de Nebulosa, texto Creme Solar, mono semibold, `12px 24px`; hover baixa opacity para 0.8
- **Outline (Currículo):** borda 1px accent, texto accent, mono; hover preenche com accent via GSAP (`scaleX` da esquerda) e inverte o texto — a versão CSS equivalente é background-fill com transição
- **Ghost (nav/menu):** só texto mono com sublinhado de 1px que cresce da esquerda no hover

### Chips (tags de tecnologia)
- **Style:** mono 0.75rem, borda 1px `border`, texto muted, `2px 8px`, cantos 4px — sem fundo
- **State:** estáticas; nunca viram "pills" coloridas

### Cards / Containers
- **Corner Style:** 8px
- **Background:** surface (Poeira de Estrela / Cinza de Cratera) sobre background — o contraste das camadas é a elevação
- **Shadow Strategy:** nenhuma (Regra do Plano)
- **Border:** 1px `border`; hover troca para accent junto com o texto
- **Internal Padding:** 20px

### Inputs / Fields
- **Style:** fundo surface, borda 1px `border`, 8px de raio, `12px 16px`; label mono uppercase 0.75rem acima
- **Focus:** borda vira accent (`focus:border-accent`), sem ring nem glow
- **Honeypot:** campo `company` invisível fora da tela — parte do contrato do form, não remover

### Navigation
- Links mono 0.875rem com prefixo numerado em accent (`01.`–`05.`), sublinhado de 1px que persiste no link ativo (IntersectionObserver) e cresce no hover; navbar transparente no topo, `bg-background` + blur + hairline quando rolada; menu mobile é overlay **sólido** (nunca translúcido com blur — ghosting no Chromium)

### Pontilhismo WebGL (componente-assinatura)
Nuvens de `THREE.Points` com shader próprio: planeta+anel+estrelas do Hero (com fluido de mouse via flowmap) e forma morfante do Contact. Contrato de higiene obrigatório: cores dos tokens + MutationObserver, pausa fora de vista, DPR cap 1.5, disposal no unmount, não montar em reduced-motion, guard de tamanho zero.

## 6. Do's and Don'ts

### Do:
- **Do** usar os tokens do tema para toda cor — inclusive em shaders, via `getComputedStyle` + MutationObserver.
- **Do** dar a todo `useGSAP` os dois branches (`MOTION_OK` completo, `REDUCED` com `gsap.set` para o estado final) e disparar eventos de contrato (`hero:ready`) nos dois.
- **Do** restringir scrub/parallax/pin a desktop (≥768px); mobile ganha reveals simples.
- **Do** dar fallback `motion-reduce:` em Tailwind a qualquer layout responsivo que dependa de JS/GSAP para funcionar (ex.: galeria horizontal de Projects).
- **Do** manter cada seção demonstrando uma feature GSAP diferente — o site é a prova do skill.

### Don't:
- **Don't** reproduzir o "template de portfólio dev genérico": grids de cards uniformes, pills de skills, hero-metric (anti-referência do PRODUCT.md).
- **Don't** reintroduzir divisores visuais entre seções — linha condutora SVG (ScrollThread) e alternância de cor com selos de gradiente **já foram testadas e revertidas**; a separação é espaço em branco.
- **Don't** usar modificador de alpha do Tailwind em token do tema (`/70`, `/[0.07]`) — sai 100% opaco; use `opacity-*`.
- **Don't** aplicar `transition-transform` CSS em elemento que o GSAP anima via transform — o elemento trava no meio do tween.
- **Don't** combinar `backdrop-filter` com `clip-path` animado, nem usar overlay fullscreen translúcido — ghosting no Chromium; overlay de menu é sólido.
- **Don't** adicionar efeito 3D pesado: sem novo canvas WebGL sem lazy load, DPR cap, pausa fora de vista e branch reduced-motion (anti-referência do PRODUCT.md).
- **Don't** hardcodar string visível em componente — todo texto vem de `data.ts`/`data.en.ts`, sempre nos dois idiomas.
