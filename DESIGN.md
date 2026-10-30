---
name: Bolão Celeste
description: Revista esportiva cruzeirense para palpitar o placar, pagar via PIX e acompanhar o ranking (área do cliente).
colors:
  brand-primary: "#1745e8"
  brand-primary-hover: "#123bc9"
  brand-primary-active: "#0c2f9d"
  brand-navy: "#081633"
  brand-light: "#c6d2f9"
  page-bg: "#f6f4ee"
  surface: "#ffffff"
  surface-soft: "#eff5ff"
  surface-hover: "#f3f6fc"
  surface-sunken: "#eef2f8"
  text-primary: "#17191f"
  text-muted: "#636b79"
  border: "#dfe4ed"
  border-strong: "#c9d1de"
  success: "#167b59"
  success-soft: "#e5f3ec"
  warning: "#a65b08"
  warning-soft: "#fbf0e1"
  danger: "#ba3344"
  danger-soft: "#fbe9eb"
typography:
  display:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(42px, 6vw, 92px)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(38px, 4.6vw, 60px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.015em"
  headline-dialog:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  score:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "56px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  figure:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(38px, 3.6vw, 52px)"
    fontWeight: 750
    lineHeight: 1.05
    letterSpacing: "-0.035em"
    fontFeature: "tnum"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  title-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.4
  eyebrow:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.32em"
rounded:
  chip: "6px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  gutter-desktop: "40px"
  gutter-tablet: "24px"
  gutter-mobile: "16px"
  content-max-width: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.brand-primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.brand-primary-active}"
  button-primary-hero:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    height: "54px"
    width: "100%"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.brand-navy}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
    height: "48px"
  button-secondary-hover:
    textColor: "{colors.brand-primary}"
  icon-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.brand-navy}"
    rounded: "{rounded.sm}"
    size: "44px"
  score-value:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.brand-navy}"
    typography: "{typography.score}"
    rounded: "{rounded.sm}"
    height: "72px"
    width: "156px"
  score-value-club:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.surface}"
    typography: "{typography.score}"
    rounded: "{rounded.sm}"
    height: "72px"
    width: "156px"
  score-adjust:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.brand-navy}"
    rounded: "{rounded.sm}"
    width: "56px"
    height: "44px"
  score-adjust-hover:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.brand-primary}"
  match-card:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.brand-navy}"
    rounded: "{rounded.md}"
    padding: "12px 40px 12px 16px"
    height: "86px"
  match-card-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.brand-primary}"
  chip-neutral:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.chip}"
    padding: "2px 8px"
  chip-draft:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.brand-primary}"
    rounded: "{rounded.chip}"
    padding: "2px 8px"
  chip-pending:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    rounded: "{rounded.chip}"
    padding: "3px 10px"
  chip-confirmed:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    rounded: "{rounded.chip}"
    padding: "3px 10px"
  chip-cancelled:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.chip}"
    padding: "3px 10px"
  card-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "28px"
  pool-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.brand-navy}"
    rounded: "{rounded.lg}"
    padding: "32px 30px 26px"
  order-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "20px 22px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
    height: "48px"
  header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    height: "72px"
  activity-ticker:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    height: "40px"
  mobile-nav-action:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    size: "56px"
  avatar:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    size: "40px"
---

# Design System: Bolão Celeste

> Escopo: somente a área do cliente (tudo sob `.client-shell`, rotas `/`, `/matches`, `/leaderboard`, `/my-bets`, shell e modais). A área `/admin` usa shadcn/ui e Manrope e está fora deste documento.
>
> Fonte da direção: `docs/DESIGN_SYSTEM_BOLAO_CELESTE_EDITORIAL.md` (Cruzeiro Editorial / Sports Magazine, briefing vinculante do usuário). Este arquivo registra o que foi **construído** em `src/app/globals.css` (seção "Client: Cruzeiro Editorial") e em `src/components`; onde o build adapta o briefing, isso está dito no texto.

## Overview

**Creative North Star: "O Placar é a Manchete"**

O Bolão Celeste é uma revista esportiva cruzeirense, não um painel escuro. A página é papel editorial claro (`page-bg`), o conteúdo funcional vive em cartões brancos com fio fino e sombra quase imperceptível, os títulos de página falam em serif de revista (DM Serif Display) e todo o resto é Inter, preciso e tabular. O azul royal aparece só onde se clica, onde algo está selecionado ou onde está o número do Cruzeiro. A frase-guia do briefing vale como teste: "mais revista esportiva do que dashboard; mais produto digital do que página promocional".

O gesto de assinatura é o placar lido como manchete: o número do Cruzeiro é um bloco royal sólido com algarismo branco grande, ao lado do número do adversário em bloco neutro afundado, separados por um `×` leve. Tudo em volta (abas de partida, resumo, CTA, painel do bolão) existe para que ajustar os gols e seguir para o pedido seja a tarefa mais óbvia da tela.

A atmosfera de estádio entra por dois canais controlados: a arte esportiva de fundo, apenas na Início, atenuada e recortada para que a figura do jogador nunca fique atrás de conteúdo; e as cinco estrelas do Cruzeiro do Sul: no ícone da marca (`public/brand/icon.svg`, usado no header, no login e no admin) e, como `Constellation`, no painel do bolão e na confirmação de pagamento. Tema somente claro. A densidade é média: respiro editorial no topo, listas com fios finos em vez de pilhas de cartões.

**Key Characteristics:**

- Papel editorial claro, cartões brancos com hairline e sombra mínima.
- Serif DM Serif Display só em títulos de página e de diálogo; Inter para todo o resto, com algarismos tabulares em números.
- Royal `#1745e8` reservado para ação, seleção e o número do Cruzeiro.
- Estados de pedido e partida sempre com texto e marcador, nunca só cor.
- Cinco estrelas do Cruzeiro do Sul como ornamento único e discreto.
- Movimento curto (160ms) e ticker pausável, parado sob `prefers-reduced-motion`.

## Colors

Paleta clara de papel e branco, com navy para tinta de títulos e um único azul royal saturado como voz de ação; verde, âmbar e vermelho existem só como estados.

### Primary

- **Royal Blue** (`brand-primary`): CTA primário, links de texto, item ativo da navegação (sublinhado de 2px), card de partida selecionado, número do Cruzeiro no placar, avatar, botão central da nav mobile, foco (`--focus-ring`). É a cor de "onde clicar e o que está escolhido".
- **Royal Hover** (`brand-primary-hover`): hover do CTA primário, do número do Cruzeiro e de links de texto.
- **Royal Dark** (`brand-primary-active`): estado pressionado do CTA primário.
- **Celestial Light** (`brand-light`): seleção de texto (`::selection`), estado pressionado dos botões `−`/`+`, e (a 70%) o fio da faixa dos 80% no painel do bolão.

### Secondary

- **Navy Editorial** (`brand-navy`): cor de todos os `h1`–`h4`, números grandes (valor do bolão, totais, pontos, placares em listas), nomes em linhas de lista, texto do botão secundário. Também é a base de todas as sombras (`rgb(8 22 51 / …)`) e do backdrop dos modais (42%).

### Tertiary

- **Success** (`success` / `success-soft`): "Palpites abertos", chips "Palpite confirmado" e "Pago", placares cravados no ranking, etapa concluída do checkout, ponto verde do ticker.
- **Warning** (`warning` / `warning-soft`): "Pedido aguardando pagamento", lembrete de pedido pendente, aviso de pagamento indisponível, notices.
- **Danger** (`danger` / `danger-soft`): erro de campo, `form-error`, chip "Cancelado", confirmação de cancelamento e botão destrutivo.

### Neutral

- **Editorial Paper** (`page-bg`): fundo de todas as páginas do cliente (também aplicado ao `body` quando há `.client-shell`).
- **Pure White** (`surface`): cartões, painéis, header (94% opaco), ticker (90%), nav mobile (96%), drawer de checkout, diálogos.
- **Ice Blue** (`surface-soft`): faixa dos 80% no painel do bolão (`#e8efff`, clicável, abre "Como funciona o bolão"), linha "você" no ranking, chip de rascunho, ofertas e blocos informativos dentro do checkout, ícones circulares da atividade.
- **Surface Hover** (`surface-hover`): fundo de cards de partida não selecionados, hover de linhas expansíveis, rodapé do checkout, resumo do pedido, campo do PIX copia e cola.
- **Surface Sunken** (`surface-sunken`): número do adversário no placar, monograma do adversário, chip neutro "Sem palpite", base do skeleton. Adicionado pelo build (não está no briefing).
- **Ink** (`text-primary`): texto corrido e itens de navegação.
- **Slate** (`text-muted`): subtítulos, metadados, datas, rótulos de indicadores.
- **Hairline** (`border`): bordas de cartões e divisórias de lista.
- **Hairline Strong** (`border-strong`): bordas de controles (inputs, número do placar, botão secundário), separadores do ticker, fio acima do rodapé e da seção de atividade. Adicionado pelo build.

### Named Rules

**The Royal-Means-Act Rule.** O royal marca só ação, seleção ou o número do Cruzeiro. Cartões, painéis e fundos nunca são royal; se uma área inteira ficar azul, ela está errada. (O painel do bolão é branco; só a faixa dos 80% é Ice Blue.)

**The Text-With-Tone Rule.** Verde, âmbar e vermelho nunca aparecem sozinhos: todo estado carrega rótulo textual ("Pedido aguardando pagamento", "Palpite confirmado", "Pago", "Não pontuou") e, em badges, um ponto `currentColor` de 6–7px.

**The Navy-Ink Rule.** Títulos e números de destaque são navy, nunca preto e nunca royal; o royal em número é exclusivo do Cruzeiro no placar, do ranking dos três primeiros e da sua própria posição.

## Typography

**Display Font:** DM Serif Display (com Georgia, serif), via `--font-editorial`
**Body Font:** Inter (com ui-sans-serif, system-ui, sans-serif), via `--font-ui`
**Label/Mono Font:** Inter para rótulos; `ui-monospace` apenas no código PIX copia e cola

**Character:** Um serif de manchete, alto e condensado no ritmo, contra uma sans neutra e técnica. O serif dá a voz de revista; a Inter garante que placar, preço e formulário sejam lidos sem ambiguidade. Manrope continua carregada em `layout.tsx` apenas para o admin.

### Hierarchy

- **Display** (DM Serif 400, `clamp(42px, 6vw, 92px)`, lh 0.92, -0.02em): só o título da Início, "Qual vai ser o placar?". No celular `clamp(36px, 10.4vw, 46px)`, em duas linhas.
- **Headline** (DM Serif 400, `clamp(38px, 4.6vw, 60px)`, lh 1): `h1` das demais páginas (Jogos do Cruzeiro, Ranking geral, Meus palpites); 36px no celular. Subtítulo em Slate 17px (15px no celular), `max-width: 56ch`.
- **Headline Dialog** (DM Serif 400, 30px, lh 1.05): títulos dos diálogos de login/cadastro e perfil; 34px na tela de pagamento confirmado.
- **Score** (Inter 800, 56px, lh 1, -0.03em, tabular): números do placar. 40px dentro do checkout, 44px no celular, 42px abaixo de 360px.
- **Figure** (Inter 750, `clamp(38px, 3.6vw, 52px)`, -0.035em, tabular): valor do bolão. A mesma família de peso 750 cobre totais (22–26px), resumo do ranking (40px / 28px no celular), valor do PIX (40px) e o líder do ranking (40px).
- **Title** (Inter 700, 22px, -0.025em): `h2` de seção ("Últimos resultados", "Ranking da comunidade"), cabeçalho do checkout; 19px no celular. Empty/error states usam 24px.
- **Title SM** (Inter 700, 18px, -0.02em): `h3` de cartão de pedido; nomes de times no placar a 20px (16px no celular).
- **Body** (Inter 400, 16px, lh 1.5): texto base do shell; listas e linhas a 15px.
- **Body SM** (Inter 400, 14px): metadados, notas de prazo, corpo do checkout.
- **Label** (Inter 600, 13px): ticker, status "Palpites abertos", rótulos de indicadores; chips e badges a 12px/500–600. Nada funcional abaixo de 12px, exceto a tag "Você" (11px, uppercase).
- **Eyebrow** (Inter 700, 12px, 0.32em, uppercase, royal): restrito a duas ocorrências pedidas pelo briefing — "Bolão Celeste" acima do título da Início (com fio `border-strong` à direita) e "Bolão desta partida" no painel do bolão (11px, 0.3em).

### Named Rules

**The Serif-Is-For-Headlines Rule.** DM Serif Display aparece só em `h1` de página, título de diálogo e na confirmação de pagamento, sempre peso 400. Placar, preço, menu, formulário e estatística são sempre Inter.

**The Tabular Numbers Rule.** Todo número que se compara ou se soma (placar, valor, pontos, posição, bilhetes) usa `font-variant-numeric: tabular-nums`.

## Layout

Contêiner centralizado de 1200px de conteúdo mais gutter lateral fluido (`--gutter`: 40px desktop, 24px até 1023px, 16px até 767px). Header sticky (72 / 64 / 56px) e ticker sticky logo abaixo (40px; 38px no celular); `scroll-margin-top` compensa os dois. O `main` tem 40px de respiro no topo (18px no celular); o rodapé fica 64px abaixo do conteúdo (48px no tablet), separado por um fio `border-strong`.

**Início (≥1024px):** grid `minmax(0, 1.65fr) minmax(300px, 1fr)` com 32px entre colunas e 24px entre linhas. O título ocupa a primeira linha, à esquerda (a arte de fundo aparece à direita); na segunda linha, card do placar e painel do bolão ficam lado a lado, com o mesmo topo e a mesma altura: o painel estica até o fim do card com os indicadores compactos e, logo abaixo, a seção "Como funciona o bolão", sempre aberta, ocupando o espaço restante. Abaixo, grade de apoio em 2 colunas (resultados e ranking da comunidade, gap 32px) e a seção "Atividade recente" em lista de 2 colunas com gap de 48px.

**Páginas internas:** coluna estreita `max-width: 880px` (Ranking, Meus palpites).

**Tablet (≤1023px):** tudo vira uma coluna; o painel do bolão vem depois do placar; nav desktop some e aparece a nav inferior fixa de 5 posições (2 links, botão central de ação, 2 links); o rodapé ganha 112px de folga inferior para a nav.

**Celular (≤767px):** cards de partida viram abas horizontais roláveis com `scroll-snap` (largura `min(76%, 260px)`, sem barra de rolagem, sem nome do campeonato); placar continua lado a lado com coluna central de 28px; escudos caem para 40px; painéis com 22px × 18px de padding; listas em uma coluna; lembrete de pedido pendente sobe acima da nav inferior.

**Estreito (≤359px):** escudos do placar somem, coluna do `×` cai para 18px, placares do checkout empilham, rodapé empilha.

**Ritmo:** escala 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px, com valores intermediários de componente (14, 18, 20, 22, 28px). Áreas se separam por espaço e fios de 1px, não por caixas aninhadas.

**Arte de fundo (só na Início):** camada decorativa `.editorial-art`, `aria-hidden`, absoluta atrás do conteúdo, `height: min(1080px, 120vh)`, máscara linear que some a partir de 72% da altura. Desktop: `background-size: max(2100px, 112vw) auto` e `background-position: -528px top`, recortando a figura do jogador para fora do quadro de modo que o gutter mostre torcida e bandeiras (≥1920px a posição volta para `-40px`). Tablet: altura 760px, opacidade 0.7. Celular: versão `-mobile.webp`, 400px de altura, opacidade 0.22, ancorada à direita. Assets em `public/images/bolao-celeste-editorial-background(.webp | -mobile.webp)`, derivados do PNG fornecido pelo usuário, guardado em `docs/assets/bolao-celeste-editorial-background.png` (proveniência em `.webp.json`). O mockup de referência do usuário fica em `docs/assets/referencia-home.png` e não é servido pela UI.

### Named Rules

**The Player-Never-Behind-Content Rule.** A arte esportiva só existe na rota `/` e é sempre enquadrada por `background-position` para que o jogador fique fora da área de leitura; nenhum texto ou controle se apoia sobre rosto, bandeira ou área contrastada da arte. Outras rotas usam só o papel editorial.

## Elevation & Depth

Híbrido discreto: superfícies se separam principalmente por tom (papel → branco → Ice Blue / sunken) e por fios de 1px; a sombra é ambiente e baixa, tingida de navy. Elevação real só existe em camadas sobrepostas (menu da conta, diálogos, drawer de checkout, lembrete de pedido). A única sombra colorida é royal e marca ação: CTA primário, número do Cruzeiro, ícone da marca (via `drop-shadow`) e botão central da nav mobile.

### Shadow Vocabulary

- **Card** (`box-shadow: 0 8px 30px rgb(8 22 51 / 5%)`): todos os cartões e painéis em repouso, linhas de palpite no checkout, QR code.
- **Raised** (`box-shadow: 0 18px 48px rgb(8 22 51 / 12%)`): menu da conta, diálogos, lembrete de pedido pendente.
- **Drawer** (`box-shadow: -18px 0 48px rgb(8 22 51 / 18%)`): painel lateral de checkout.
- **Royal Action** (`box-shadow: 0 6px 16px rgb(23 69 232 / 22%)`): CTA primário em repouso; some no `:active` e no disabled.
- **Club Score** (`box-shadow: 0 8px 20px rgb(23 69 232 / 24%)`): bloco do número do Cruzeiro.
- **Selected Match** (`box-shadow: inset 0 0 0 1px #1745e8, 0 6px 18px rgb(23 69 232 / 10%)`): card de partida selecionado (o inset dobra a borda para 2px visuais).
- **Mobile Nav** (`box-shadow: 0 -8px 24px rgb(8 22 51 / 6%)`) e **FAB** (`0 8px 20px rgb(23 69 232 / 32%)`).

### Named Rules

**The Quiet Paper Rule.** Em repouso, nenhum cartão passa da sombra Card. Sombra mais forte é reservada a camadas flutuantes ou à ação royal; se uma tela pesar, a correção é remover borda e decoração, não somar sombra.

## Shapes

Cantos suavemente arredondados e hierárquicos: o raio cresce com o tamanho da superfície. Controles (botões, inputs, números do placar, botões `−`/`+`) usam 8px (`sm`); cards de partida, caixas internas e a seção "Como funciona" usam 12px (`md`); cartões e painéis de página e diálogos usam 18px (`lg`); chips, badges e a tag "Você" usam 6px (`chip`); avatar, monogramas, pontos de status, passos do checkout e o FAB são círculos. O ícone da marca é o arquivo `public/brand/icon.svg` (quadrado com gradiente royal, raio de ~20%), exibido a 44px no header (36px no celular). Bordas são sempre 1px, exceto o sublinhado ativo da nav (2px royal) e o fio de abertura dos resumos de ranking e de "Meus palpites" (2px navy no topo). O monograma do Cruzeiro é um círculo royal; o do adversário, um círculo sunken com fio `border-strong`.

## Components

### Buttons

Diretos e confiantes, sem gradiente.

- **Shape:** cantos suaves (8px), altura mínima 48px, padding 12px × 20px, Inter 600 15px, ícone com gap de 10px.
- **Primary:** fundo royal, texto branco, sombra Royal Action. É o único CTA dominante por tela. No card do placar ocupa a largura toda, 54px de altura, 17px ("Revisar palpite" sem pedido, "Ver meu pedido" com pedido, "Palpites encerrados" desabilitado); no checkout, 52px.
- **Hover / Active:** hover vai a Royal Hover e a seta desliza 3px para a direita; active vai a Royal Dark sem sombra. Transição de 160ms em cor, borda e sombra.
- **Disabled:** cinza sólido (`#c3cad6` com texto `#4a5260`), sem sombra, cursor `not-allowed`, não depende só de opacidade.
- **Secondary:** fundo branco, texto navy, fio `border-strong`; hover troca borda e texto para royal. Usado em "Entrar", "Tentar novamente", "Adicionar outro placar".
- **Danger:** fundo `danger`, texto branco, hover `#9e2836`; só em confirmação de cancelamento.
- **Text link:** royal 14px/600, sublinhado no hover com offset de 4px.
- **Icon button:** 44×44px, branco, hairline, ícone navy; hover royal.

### Chips

- **Style:** raio 6px, 12px de texto, fundo suave + texto forte do mesmo tom.
- **Seletor de partida (adaptação do briefing):** "Sem palpite" neutro (sunken/slate), "Rascunho 2 × 1" Ice Blue/royal, "Pedido aguardando pagamento" em `warning-soft`/`warning`, "Palpite confirmado" em `success-soft`/`success`. O briefing pede estado com texto; o build usa os tons de warning/success para que o estado do pedido seja legível também nos cards.
- **Status badge (pedidos):** padding 3px × 10px, ponto `currentColor` de 6px antes do texto (só no status do pedido); tons `is-pending` ("Aguardando pagamento"), `is-confirmed` ("Pago"), `is-cancelled`. Badges de resultado reutilizam os tons: `is-confirmed` para "Placar exato", `is-partial` (Ice Blue/royal) para "Acertou o resultado", `is-muted` (sunken/slate) para "Não pontuou" e "Aguardando o jogo".
- **Placar cravado:** pílula `success-soft` com placar 16px/750 tabular.

### Cards / Containers

- **Corner Style:** 18px para cartões de página; 12px para caixas internas.
- **Background:** branco sobre o papel. O painel do bolão também é branco, com sombra mais profunda (`0 18px 50px` navy 8%) e as cinco estrelas royal (120px, 84px no celular) no canto superior direito; dentro dele, a faixa dos 80% em Ice Blue `#e8efff` com fio Celestial Light a 70%, troféu royal preenchido a 18%, texto royal em duas linhas (frase em negrito, depois a divisão); a faixa é informativa, sem ação. Abaixo dos indicadores, "Como funciona o bolão" é uma seção sempre aberta (caixa branca com fio, título royal com ícone, texto 13px).
- **Shadow Strategy:** sombra Card em repouso (ver Elevation & Depth).
- **Border:** hairline 1px.
- **Internal Padding:** 28px padrão; card do placar 20px × 24px; painel do bolão 32px × 30px; cartões de pedido 20px × 22px; 16–22px no celular.
- **Listas:** dentro dos cartões, linhas separadas por hairline, sem cartões aninhados. As linhas têm 68px de altura mínima e hover `surface-hover`. Em "Últimos resultados", a linha expande no lugar: chevron gira 180° e fica royal, e o painel abre por `grid-template-rows` (280ms). No ranking, a linha abre um diálogo (`.ranking-dialog`, chevron para a direita): cabeçalho com posição e nome, resumo de pontos e placares exatos fixos, e só a lista de placares cravados rola (`overscroll-behavior: contain`), porque essa lista cresce sem limite ao longo da temporada.

### Inputs / Fields

- **Style:** fundo branco, fio `border-strong`, raio 8px, altura 48px, padding 10px × 14px, 16px (evita zoom no iOS); rótulo navy 14px/600 acima, ajuda em Slate 13px abaixo.
- **Focus:** borda royal + halo `0 0 0 3px rgb(23 69 232 / 18%)` em vez do outline global.
- **Error / Disabled:** `aria-invalid` troca a borda para `danger` e a mensagem aparece logo abaixo em `danger` 500. Placeholder `#7c8493`.
- **Foco global:** todo elemento interativo do cliente recebe `outline: 3px solid` royal com `outline-offset: 3px` em `:focus-visible`.

### Navigation

- **Header:** branco 94% com hairline inferior, grid de três colunas: marca à esquerda (quadrado royal com constelação branca + "Bolão **Celeste**" com "Celeste" royal 700), links ao centro (15px/500, gap 36px), conta à direita. Ativo: navy 600 com sublinhado royal de 2px encostado na base do header; hover: royal. Conta: avatar royal circular com inicial, nome 15px/600 e chevron que gira; menu suspenso branco com sombra Raised, itens de 44px.
- **Ticker de atividade:** faixa branca de 40px, ponto verde com halo + "Confirmados agora" em royal 13px/600, eventos em Slate com nome em Ink, separados por fios verticais de 14px; rolagem contínua de 60s com botão de pausa; máscara de fade nas bordas. No celular o rótulo de texto some.
- **Nav mobile (≤1023px):** barra branca fixa na base, 5 colunas; links com ícone 22px e rótulo 12px em Slate, ativo em royal 650; botão central circular royal de 56px, elevado 14px, com borda branca de 4px — abre o pedido existente ou leva ao placar.
- **Skip link:** "Ir para o conteúdo", royal, aparece no foco.

### Score Picker (assinatura)

O placar como manchete, dentro do **card de bilhete** (`.prediction-panel`, raio 22px): torcida com bandeiras na borda esquerda e arquibancada na direita (`public/images/ticket-*.webp`, recortes da arte do dono), 40% de opacidade (28% no celular) e máscara radial que as dissolve antes do placar, que fica sempre sobre branco limpo.

Duas colunas simétricas com escudo ou monograma (104px; 40px no celular), nome do time em `h2` 23px/800, o número e, abaixo, os botões `−` e `+` separados por um fio vertical; no meio, um `×` navy fino (44px/200). O número do Cruzeiro (196×84px, 64px/850) é um bloco royal em gradiente vertical com um único brilho diagonal, borda `#3f7bff` de 2px, halo royal de 3px e sombra profunda; o do adversário é um bloco claro (branco → `#edf1f7`) com fio `border-strong`, sombra interna leve e algarismo navy. Botões `−`/`+` de 64×46px (44px de altura no celular), brancos com hairline e sombra baixa, ícone royal de 22px com traço 2.6; hover Ice Blue, pressionado Celestial Light, desabilitado em cinza `#a7aebb` sobre `surface-hover`. Valores limitados a 0–20, com nomes acessíveis ("Aumentar gols de Cruzeiro"). **Regra de negócio:** só vale vitória do Cruzeiro (qualquer placar) ou empate; os limites dos botões e do campo acompanham o outro placar (o `−` do Cruzeiro trava no empate, o `+` do adversário trava ao alcançar o Cruzeiro), a linha "Vale vitória do Cruzeiro ou empate." fica sob o placar e a API recusa pedidos com derrota do Cruzeiro.

Abaixo, separado por hairline: o resumo ("Seu palpite: …" ou "Acompanhe seu pedido" em navy 17px/650, bilhetes e placares em Slate, total navy 30px/800) e o **CTA do bilhete**, de largura total, 58px, raio 12px, gradiente royal profundo com a arquibancada surgindo à direita em `soft-light`; desabilitado volta ao cinza liso. Fecha com a nota de prazo, uma linha centralizada em Slate ("Palpites até …, horário de Brasília."). O preço fica alinhado à base do resumo, logo acima do CTA.

### Match Chooser

Cards de partida em grade `auto-fit` (mín. 220px; abas roláveis no celular): fundo branco, hairline, sombra de card, raio 14px, 92px de altura mínima, confronto em navy 17px/700, data e campeonato em Slate 14px, chip de estado em pílula e chevron à direita que desliza 2px no hover. Selecionado (`aria-pressed`): fundo Ice Blue em gradiente suave, borda royal reforçada por inset de 1px, título e chevron em royal. Chips: rascunho e pedido aguardando pagamento em azul (`#dce7ff` / royal), palpite confirmado em `success`, sem palpite em `surface-sunken`. Sempre com texto, nunca só cor.

### Jogos (agenda e resultados)

A rota `/matches` tem duas abas (`role="tablist"`, setas/Home/End no teclado, contagem em pílula): **Próximos jogos** e **Resultados**; `#historico` abre direto em Resultados (é o destino do "Ver histórico" da Início).

- **Próximos jogos:** grade de 2 colunas (1 no celular) de `.fixture-card` brancos. O próximo jogo é o card de destaque, em largura total, com a mesma textura de estádio do card de bilhete, restrita à faixa dos times. Cada card: competição com troféu e status ("Palpites abertos"/"encerrados"); contagem regressiva em royal ("Hoje", "Amanhã", "Em 3 dias") seguida do dia da semana e hora; confronto com escudos (32px nos cards, 80px no destaque); três números (bolão, bilhetes, participantes) entre fios; chip do palpite do visitante (o mesmo `.prediction-chip` dos cards de partida da Início); "Fazer palpite" abre o checkout já na revisão, "Ver meu pedido" abre o pedido existente; prazo em Slate.
- **Resultados:** lista em painel único, uma linha por jogo: bloco de data (dia navy 22px sobre o mês royal em caixa alta, fundo Ice Blue), confronto com o placar final num bloco `surface-sunken` (ou "Cancelado"/"A apurar" menores), data e competição em Slate e fatos em pílulas: quem cravou (verde, `success-soft`) ou "Ninguém cravou o placar", placar mais escolhido e bilhetes confirmados.

**Botão "+" da nav mobile:** abre o checkout direto na etapa "Confira seu placar" — a mesma tela de "Revisar palpite" — para a partida em tela (Início) ou, nas outras rotas, a próxima partida aberta; com pedido existente, abre o pedido. Sem partida aberta, leva para Jogos.

### Checkout Drawer

Painel lateral direito de até 480px, altura total, sobre backdrop navy 42%, entrando com deslize de 24px em 220ms. Cabeçalho com título 22px e botão fechar; passos numerados (círculos de 26px: atual royal sólido, concluído `success-soft` com texto verde); corpo rolável com linhas de palpite em cartões de 12px (placar reduzido a 40px); rodapé `surface-hover` com total navy 26px/750, CTA de 52px e nota em Slate. PIX: QR code em moldura branca no desktop com ponteiro fino, copia e cola com passos numerados em círculos Ice Blue no celular. Pagamento confirmado: círculo royal de 96px com as cinco estrelas acendendo em sequência (560ms, 120ms de intervalo), título em serif 34px, placares confirmados em blocos Ice Blue com número royal 34px/800.

### Dialogs (login, cadastro, perfil)

Centralizados, até 440px, raio 18px, sombra Raised, entrada de 220ms (10px para cima + escala 0.98). Título em serif 30px; estrelas royal de 52px no login; opções como linhas brancas com hairline que ficam Ice Blue com borda royal no hover.

## Do's and Don'ts

### Do:

- **Do** manter o fundo de página em papel editorial e o conteúdo funcional em cartões brancos com hairline 1px, raio 18px e a sombra Card (`0 8px 30px rgb(8 22 51 / 5%)`).
- **Do** usar o royal (`#1745e8`) só para ação, seleção, foco e o número do Cruzeiro; títulos e números grandes em navy.
- **Do** escrever todo estado de pedido ou partida em texto, com tom suave + texto forte do mesmo estado e ponto `currentColor` nos badges.
- **Do** usar DM Serif Display 400 apenas em `h1` de página e títulos de diálogo; Inter com `tabular-nums` para placares, valores, pontos e posições.
- **Do** separar itens de lista com fios de 1px dentro de um único cartão, como em resultados, ranking e atividade.
- **Do** manter alvos de toque ≥ 44px (botões `−`/`+`, icon buttons, itens de menu) e transições de 160ms em cor e borda.
- **Do** respeitar `prefers-reduced-motion`: ticker parado mostrando um único evento, sem botão de pausa, e transições/animações reduzidas a 0.01ms.
- **Do** restringir a arte esportiva à Início, enquadrada para que o jogador nunca fique atrás de texto ou controles, e atenuada no celular (0.22).

### Don't:

- **Don't** cobrir a aplicação com fundo azul-marinho nem voltar ao padrão "painel navy com vidro e estrelas" do incumbente.
- **Don't** pintar cartões ou painéis inteiros de royal, nem usar gradientes, brilho neon ou efeitos de gaming em componentes.
- **Don't** empilhar caixas azuladas com bordas fortes e sombras profundas; em repouso nenhum cartão passa da sombra Card.
- **Don't** identificar estado só por cor nem usar verde/âmbar/vermelho como decoração.
- **Don't** usar o serif em placares, preços, formulários, menus ou estatísticas.
- **Don't** espalhar estrelas, partículas ou imagens perto de formulários; as estrelas aparecem só no ícone da marca, no painel do bolão e na confirmação de pagamento.
- **Don't** criar novos eyebrows em caixa alta: os dois existentes ("Bolão Celeste" e "Bolão desta partida") são pedidos do briefing e não um padrão para novas telas.
- **Don't** aplicar a arte de fundo em outras rotas nem posicionar informação crítica sobre o rosto do jogador ou as bandeiras.

## Marca

Arquivos em `public/brand/` (fornecidos pelo dono do projeto; não editar à mão):

| Arquivo | Uso |
| --- | --- |
| `icon.svg` | Ícone (quadrado royal com as cinco estrelas). Header do cliente (44/36px), opções de login (56px), barra lateral e login do admin. Também copiado para `src/app/icon.svg` (favicon moderno). |
| `icon.png` | Mesmo ícone em 1024px; fonte do `src/app/apple-icon.png` (180px). |
| `logo-light.png` / `.svg` | Logo empilhado "Bolão / Celeste" para fundo claro. Rodapé do cliente (PNG, 36px de altura, `loading="lazy"`). |
| `logo-dark.png` / `.svg` | Logo empilhado para fundo escuro. Reservado (admin escuro, compartilhamentos). |
| `navbar-light.png` / `.svg` | Logo horizontal para fundo claro. Reservado. |

**The Raster-For-Wordmark Rule.** Os SVGs de logo desenham o texto com `<text>` em "Inter Display", que não carrega quando o SVG é usado como `<img>`; o visitante veria Arial. Para logos com texto, use o PNG. No header, o ícone é SVG e o nome "Bolão **Celeste**" é texto HTML em Inter 800 (`letter-spacing: -0.045em`, "Celeste" em royal), reproduzindo o logo com nitidez e acessível a leitores de tela.
