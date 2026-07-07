# Product

## Register

brand

## Users
Recrutadores e desenvolvedores avaliando o Caio Vinicius (front-end, Fortaleza/CE). Visita curta, desktop ou mobile, muitas vezes vindo do GitHub/LinkedIn. O trabalho deles: decidir em poucos minutos se vale a pena chamar para conversar.

## Product Purpose
Site-currículo single page que também é o laboratório público de estudos de GSAP/three.js do Caio — cada seção explora uma feature diferente da biblioteca. Sucesso = o recrutador pensar "esse cara é diferente" e mandar mensagem pelo formulário (Resend). Conteúdo 100% em `src/lib/data.ts`/`data.en.ts` (pt-BR/en), nunca hardcoded.

## Brand Personality
Editorial, tecnicamente vivo, caloroso. Tipografia display forte (Bricolage Grotesque) com voz "code" em mono (JetBrains) para navegação/tags/typewriter. Motion é assinatura, não enfeite.

## Anti-references
- Template de portfólio dev genérico: grids de cards uniformes, pills de skills, hero-metric.
- Decoração que vira ruído ou compete com a leitura — já foram testadas e revertidas: linha condutora SVG entre seções (ScrollThread) e divisores de cor/gradiente.
- Efeitos 3D pesados que degradam performance ou não respeitam reduced-motion.

## Design Principles
- Cada seção demonstra uma capacidade diferente (o site é a prova do skill) — sem repetir o mesmo efeito em dois lugares.
- Motion com propósito e `prefers-reduced-motion` como cidadão de primeira classe: todo `useGSAP` tem branch `REDUCED` funcional.
- Paleta própria mantida (cream/coral no claro, navy/teal no escuro) via tokens CSS — decoração lê cores dos tokens, nunca hardcoded.
- Performance disciplinada: three.js lazy em chunk async, DPR cap 1.5, pausa fora de vista, disposal no remount de idioma.

## Accessibility & Inclusion
Reduced-motion completo (conteúdo íntegro e acessível sem pin/scrub/WebGL), layout mobile-first sem overflow horizontal, contraste garantido pelos tokens nos dois temas, form com labels e estados de erro/sucesso anunciados (`role="status"`/`alert`).
