# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Torcedores do Cruzeiro que querem palpitar o placar dos jogos do clube. Usam principalmente pelo celular, muitas vezes perto do horário da partida, e precisam escolher um placar, pagar via PIX e acompanhar resultado e ranking sem fricção. Administradores usam a área `/admin`, separada e fora do escopo do redesign do cliente.

## Product Purpose

Bolão por partida: cada bilhete registra um placar e passa a valer após a confirmação do pagamento PIX. Uma parte da arrecadação vai para quem cravar o placar exato, dividida entre os bilhetes vencedores. Torcedores com conta acumulam pontos num ranking geral (placar exato vale a pontuação máxima; acertar só o vencedor ou o empate vale pontos parciais). Sucesso: o torcedor escolhe o placar e conclui o pedido em segundos e volta para acompanhar.

## Positioning

Uma comunidade cruzeirense em torno do placar: o bolão mostra ao vivo quem confirmou palpites, quanto o bolão da partida acumula, o placar mais escolhido e quem cravou resultados anteriores.

## Operating Context

- Rotas do cliente: Início (`/`, escolha do placar da próxima partida), Jogos (`/matches`), Ranking (`/leaderboard`), Meus palpites (`/my-bets`).
- Checkout em modal com três etapas (Palpite, Dados, Pagamento); o pagamento é PIX (QR code no desktop, copia e cola no celular).
- Pedidos podem ser feitos sem conta; ficam salvos no navegador e não entram no ranking.
- Faixa de atividade ao vivo com palpites confirmados recentemente.

## Capabilities and Constraints

- Next.js 16 (App Router), React 19, Tailwind v4; o visual do cliente vive em `src/app/globals.css` sob `.client-shell`; o admin usa shadcn/ui e não deve ser afetado.
- Não alterar contratos de API, regras de palpite (0 a 20 gols, 1 a 50 bilhetes por placar, até 20 placares), precificação, autenticação, fluxo de pedido/pagamento nem a persistência do pedido no navegador.
- Interface em português do Brasil, horário de Brasília.

## Brand Commitments

- Nome: Bolão Celeste. Identidade inspirada no Cruzeiro (azul, cinco estrelas do Cruzeiro do Sul), sem usar marcas oficiais do clube.
- Direção visual vinculante: `docs/DESIGN_SYSTEM_BOLAO_CELESTE_EDITORIAL.md` (Cruzeiro Editorial / Sports Magazine), tema somente claro no cliente.
- Arte de fundo: original em `docs/assets/bolao-celeste-editorial-background.png` (jogador fictício, torcida e bandeiras), servida como WebP em `public/images/`; decorativa.
- Marca: arquivos oficiais do projeto em `public/brand/` — `icon.svg`/`icon.png` (ícone), `logo-light`/`logo-dark` (logo empilhado para fundo claro/escuro), `navbar-light` (logo horizontal). Favicon e ícones do app em `src/app/` (`favicon.ico`, `icon.svg`, `apple-icon.png`).

## Evidence on Hand

Dados reais vêm da API (partidas, estatísticas do bolão, ranking, feed de atividade). Não há depoimentos, números de usuários ou prêmios históricos para exibir além do que a API fornece; nada disso deve ser inventado.

## Product Principles

1. Palpitar e pagar continuam sendo as tarefas mais rápidas e óbvias da tela.
2. Mais revista esportiva do que dashboard; mais produto digital do que página promocional.
3. Estados de pedido e partida sempre com texto, nunca só cor.
4. Celular primeiro: alvos de toque grandes, nada cortado a 375px.

## Accessibility & Inclusion

WCAG 2.2 AA: contraste 4,5:1 em texto normal, foco visível, `prefers-reduced-motion` respeitado (ticker pausável), controles de placar com nomes acessíveis.
