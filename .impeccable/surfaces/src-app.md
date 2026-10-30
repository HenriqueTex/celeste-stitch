---
version: 1
slug: "src-app"
primary_target: "src/app"
related_targets: ["src/components"]
---

# Área do cliente — Bolão Celeste

Scope: todas as rotas do cliente (`/`, `/matches`, `/leaderboard`, `/my-bets`), shell (header, ticker, nav mobile, rodapé) e modais (checkout/PIX, login/cadastro, perfil). Admin fora do escopo.
Mode: Operate (a Início tem um hero editorial, mas o trabalho é palpitar e pagar). Build path: code-led.
Audience/job: torcedor do Cruzeiro, no celular, escolhendo um placar e pagando via PIX; depois acompanhando resultados e ranking.
Constraints: sem mudanças de API, regras, preço, fluxos ou persistência; tema somente claro; celular primeiro.
Direção: pinada pelo usuário em `docs/DESIGN_SYSTEM_BOLAO_CELESTE_EDITORIAL.md` (sem rolagem de conceitos).

## Direction contract

THESIS: Revista esportiva cruzeirense, não dashboard escuro: o placar é a manchete. Recusa o padrão "painel navy com vidro e estrelas" do incumbente e o dashboard de cards iguais.
OWN-WORLD: Papel editorial #F6F4EE, cards brancos com hairline #DFE4ED e sombra mínima, navy #081633 nos títulos, royal #1745E8 só onde se clica ou está selecionado. DM Serif Display só nos títulos de página; Inter para tudo o mais, algarismos tabulares. Cinco estrelas do Cruzeiro do Sul como marca discreta.
STORY: O torcedor vê a pergunta, a partida e o placar, ajusta os gols, vê o total e segue para o pedido; ao lado entende quanto o bolão acumula e como ganha.
FIRST VIEWPORT: Header branco (marca à esquerda, nav central com sublinhado royal, conta à direita); ticker fino branco; título serif "Qual vai ser o placar?" com subtítulo cinza sobre a arte esportiva atenuada nas bordas; abaixo, grid 1.65fr/1fr: card do placar (abas de partidas, escudos, números grandes, Cruzeiro em royal, adversário neutro, CTA royal 52px) e painel do bolão (valor grande, faixa Ice Blue dos 80%, indicadores em linhas). No celular: título em 2 linhas, placar lado a lado, CTA logo abaixo, painel depois.
FORM: Cruzeiro Editorial / Sports Magazine, direção pinada pelo usuário (posição 1 de 1). seed: none (unavailable)
SIGNATURE: O número do Cruzeiro como bloco royal sólido com algarismo branco grande ao lado do número neutro do adversário — o placar lido como manchete. Movimento: transições de 160ms em hover/seleção; ticker pausável e parado sob reduced-motion.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
