# Bolão Celeste — Design System Editorial

> **Versão:** 1.0  
> **Projeto:** Redesign da interface existente do Bolão Celeste  
> **Direção criativa:** *Cruzeiro Editorial / Sports Magazine*  
> **Objetivo:** evoluir a identidade visual e a experiência de uso sem alterar as regras de negócio, os fluxos de compra, os dados ou as funcionalidades atuais.

---

## 1. Visão da identidade

O Bolão Celeste deve transmitir a energia do Cruzeiro por meio de uma estética **editorial esportiva, contemporânea e premium**: tipografia expressiva, azul royal usado com intenção, bastante espaço em branco, fotografias/colagens em duotone azul e composição de revista esportiva.

A referência visual é o conceito de redesign gerado para a tela **“Qual vai ser o placar?”**, acompanhado de uma arte de fundo com jogador fictício à esquerda, arquibancadas e bandeiras à direita, estrelas, textura de tinta e uma área central clara para receber o conteúdo.

### Personalidade desejada

- **Torcida:** emoção, pertencimento, cinco estrelas e atmosfera de estádio.
- **Editorial:** hierarquia tipográfica forte, grids elegantes, títulos marcantes e espaços de respiro.
- **Digital premium:** controles precisos, componentes consistentes, transições sutis e alto contraste.
- **Objetividade:** apesar da identidade esportiva, palpitar e concluir o pedido devem continuar sendo tarefas rápidas e óbvias.

### Frase-guia

**“Mais revista esportiva do que dashboard; mais produto digital do que página promocional.”**

### Evitar

- Fundo azul-marinho cobrindo toda a aplicação.
- Muitas caixas azuladas com bordas fortes e sombras profundas.
- Gradientes em todos os componentes, brilho neon e efeitos de *gaming*.
- Excesso de estrelas, partículas ou imagens competindo com formulários.
- Alterar a experiência funcional apenas para imitar um mockup estático.

---

## 2. Paleta de cores

### 2.1 Tokens fundamentais

| Papel | Nome | Hex | Aplicação |
| --- | --- | --- | --- |
| Identidade | **Royal Blue** | `#1745E8` | CTA primário, links, seleção e destaques |
| Identidade | **Royal Hover** | `#123BC9` | Hover de botões e ações principais |
| Identidade | **Royal Dark** | `#0C2F9D` | Estado pressionado e detalhes mais densos |
| Identidade | **Navy Editorial** | `#081633` | Títulos principais, métricas e elementos de impacto |
| Base | **Editorial Paper** | `#F6F4EE` | Fundo neutro da página, quando não houver imagem |
| Base | **Pure White** | `#FFFFFF` | Cards, painéis e conteúdo funcional |
| Base | **Ice Blue** | `#EFF5FF` | Informações leves, superfícies selecionadas e explicações |
| Texto | **Ink** | `#17191F` | Texto principal, itens de navegação |
| Texto | **Slate** | `#636B79` | Subtítulos, metadados e textos secundários |
| Estrutura | **Hairline** | `#DFE4ED` | Bordas e divisórias discretas |
| Marca | **Celestial Light** | `#C6D2F9` | Detalhes gráficos, estrelas e ornamentação |
| Estado | **Success** | `#167B59` | Palpites abertos, confirmação e sucesso |
| Estado | **Warning** | `#A65B08` | Pedido pendente / atenção |
| Estado | **Danger** | `#BA3344` | Erro de validação, falha ou bloqueio |

> **Observação:** são escolhas de direção visual para o produto; não são especificações oficiais de identidade do clube.

### 2.2 Proporção de uso

- **70%** neutros claros: branco, papel editorial e superfícies muito suaves.
- **20%** texto escuro, elementos estruturais e fotografias/colagens.
- **10%** azul royal e acentos visuais.

O azul deve indicar **onde clicar, onde prestar atenção e o que está selecionado**. Não deve ser aplicado indiscriminadamente em todos os cards.

### 2.3 Variáveis CSS prontas

```css
:root {
  color-scheme: light;

  /* Identidade */
  --brand-primary: #1745E8;
  --brand-primary-hover: #123BC9;
  --brand-primary-active: #0C2F9D;
  --brand-navy: #081633;
  --brand-light: #C6D2F9;

  /* Superfícies */
  --page-bg: #F6F4EE;
  --surface: #FFFFFF;
  --surface-soft: #EFF5FF;
  --surface-hover: #F3F6FC;

  /* Conteúdo */
  --text-primary: #17191F;
  --text-heading: #081633;
  --text-muted: #636B79;
  --text-on-primary: #FFFFFF;
  --border: #DFE4ED;

  /* Estados */
  --success: #167B59;
  --warning: #A65B08;
  --danger: #BA3344;
  --focus-ring: #1745E8;

  /* Raio e sombra */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --shadow-card: 0 8px 30px rgb(8 22 51 / 5%);

  /* Layout */
  --content-max-width: 1200px;
  --header-height: 72px;
}
```

---

## 3. Tipografia

A tipografia é um dos diferenciais centrais do estilo editorial.

### Fontes recomendadas

| Uso | Preferência | Alternativa |
| --- | --- | --- |
| Títulos de destaque (*hero*) | **DM Serif Display** | Fraunces ou Playfair Display |
| Interface, formulários e botões | **Inter** | Geist ou Plus Jakarta Sans |
| Selos editoriais, números e pequenas chamadas | **Inter SemiBold** | Geist SemiBold |

Usar o serifado **apenas em títulos de impacto**. Para placares, valores em reais, formulários, menus e estatísticas, manter sans-serif: leitura e precisão são prioritárias.

### Escala sugerida

| Elemento | Desktop | Mobile | Peso / característica |
| --- | --- | --- | --- |
| Hero `h1` | 64–76px | 38–48px | Serif, line-height ~0.98 |
| Título de seção `h2` | 30–36px | 25–30px | Sans 700 ou serif editorial |
| Título de card `h3` | 18–22px | 17–20px | Sans 650–700 |
| Valor principal do bolão | 44–54px | 36–44px | Sans 750, algarismos tabulares |
| Número do placar | 64–80px | 54–64px | Sans 800, algarismos tabulares |
| Texto padrão | 15–16px | 15–16px | Sans 400 |
| Texto auxiliar | 13–14px | 13–14px | Sans 400–500 |
| *Eyebrow* editorial | 11–12px | 11–12px | Sans 700, uppercase, tracking alto |

**Regras:** manter títulos com alto contraste; evitar texto funcional em tamanho inferior a 12px; usar `font-variant-numeric: tabular-nums` para placares, preços e estatísticas.

---

## 4. Composição e layout

### Desktop (largura ≥ 1024px)

- **Header:** logo e nome à esquerda; navegação no centro; perfil à direita.
- **Ticker:** faixa informativa fina abaixo do header, sem dominar a interface.
- **Hero:** título editorial com um pequeno selo acima e subtítulo abaixo.
- **Conteúdo principal:** grid com aproximadamente **minmax(0, 1.65fr) minmax(300px, 1fr)**, gap de 24–32px.
- **Coluna esquerda:** seleção da partida, placar e resumo do pedido.
- **Coluna direita:** premiação, informações, indicadores e regras do bolão.
- **Container:** centralizado, largura máxima de 1200px e margens laterais fluidas.

### Tablet (768–1023px)

- Reduzir dimensões tipográficas e espaçamentos.
- Priorizar um grid de uma coluna se dois painéis começarem a comprimir o placar.
- Transferir painel de informações para depois do conteúdo principal.

### Mobile (até 767px)

- Header compacto: identidade, menu e avatar.
- Ticker opcionalmente pausável, ocultável ou horizontalmente rolável.
- Título de impacto com no máximo 2–3 linhas.
- Partidas em abas horizontais roláveis, com seleção claramente identificada.
- Controles de placar lado a lado, sem corte e com alvos de toque ≥ 44×44px.
- Resumo + CTA posicionados depois do placar; barra fixa inferior só se não atrapalhar teclado/navegação.
- Painel de premiação depois da ação principal.
- Evitar figura do jogador atrás de texto ou de controles.

### Ritmo espacial

Usar escala de **4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px**. Separar áreas com espaçamento, e não só com bordas.

---

## 5. Diretrizes de componentes

### 5.1 Header e navegação

- Fundo branco ou branco levemente translúcido sobre a arte.
- Logo compacta com as cinco estrelas como referência visual.
- Item ativo: sublinhado azul fino e texto escuro semibold.
- Demais links: neutros, com hover azul.
- Divisória inferior de 1px discreta.
- Manter avatar, nome do usuário e interações de conta.

### 5.2 Faixa de atividade ao vivo

- Faixa horizontal de **36–44px**.
- Ponto verde + “Confirmados agora”, seguido por eventos curtos.
- Fundo branco; separadores suaves; tipografia de 12–13px.
- Respeitar `prefers-reduced-motion`; oferecer pausa quando houver animação.
- Não transformar o ticker em uma segunda barra de navegação.

### 5.3 Hero editorial

- Selo superior: `BOLÃO CELESTE` em caixa alta, azul royal, com *letter-spacing*.
- Título: **“Qual vai ser o placar?”** em serif de destaque, navy.
- Descrição em sans-serif cinza/azulado.
- Conteúdo alinhado a uma grade consistente com os cards inferiores.
- Usar o fundo esportivo apenas como cenário, não como elemento de leitura obrigatória.

### 5.4 Cards de partidas

- Superfícies brancas, borda fina cinza, cantos de 12–14px.
- Selecionado: borda azul 2px, fundo muito levemente azul e indicador de foco visível.
- Exibir claramente: adversários, data/hora, campeonato e situação do palpite/pedido.
- Não identificar estado **somente por cor**: manter rótulos textuais.
- Navegáveis por teclado; no mobile, usar rolagem horizontal se necessário.

### 5.5 Seletor de placar (principal ponto de atenção)

- Escudos ou monogramas visualmente equilibrados, com nomes das equipes legíveis.
- Número do Cruzeiro em fundo royal blue com texto branco; adversário em fundo neutro, texto navy.
- Controles `−` e `+` simétricos, grandes e acessíveis.
- Exibir `×` entre os valores, mantendo espaçamento suficiente.
- Estados de hover, foco, pressionado e desabilitado.
- Nunca permitir valores negativos ou não permitidos pela regra de negócio.
- Manter o comportamento atual de salvamento do pedido no navegador.

### 5.6 Resumo e ação principal

- Resumo claro: quantidade de bilhetes, quantidade de placares e preço total.
- **CTA primário único e dominante:** “Ver meu pedido”.
- Botão royal blue, texto branco, altura 48–56px.
- Explicar prazo do palpite e a condição de confirmação do pagamento em texto secundário.
- Preservar exatamente o cálculo real de preço, fluxo de pagamento e situações de pedido.

### 5.7 Painel de premiação

- Superfície branca ou Ice Blue, sem gradiente excessivo.
- `BOLÃO DESTA PARTIDA` como pequeno selo editorial.
- Prêmio/valor em tipografia sans grande, com maior destaque que os indicadores.
- Benefício “80% vai para quem cravar o placar” em box informativo suave.
- Participantes, bilhetes confirmados e placar mais escolhido em linhas separadas.
- Estrelas apenas como decoração discreta no canto superior.
- Acordeão “Como funciona o bolão” acessível por teclado, com estado aberto/fechado.

---

## 6. Arte de fundo esportiva

**Arquivo visual de referência:** `bolao-celeste-editorial-background.png` (arte gerada separadamente).

### Direção artística

- Jogador **fictício** em azul no lado esquerdo.
- Torcida, arquibancadas e bandeiras predominantemente nas bordas.
- Área central clara e livre para a leitura dos componentes.
- Paleta azul/cinza/branco, texturas suaves de tinta e estrelas.
- Expressão “A NOSSA HISTÓRIA SEGUE” como detalhe ilustrativo, e não texto essencial de interface.

### Regras de utilização

1. Usar preferencialmente em **hero / página inicial**, e não obrigatoriamente em todas as telas.
2. Sobre a arte, manter cartões funcionais em superfícies brancas com boa legibilidade.
3. Não posicionar informações críticas sobre o rosto do jogador, bandeiras ou áreas contrastadas.
4. Em telas menores, reduzir a opacidade da composição, alterar o enquadramento ou omitir a arte — sem quebrar layout.
5. O background é decorativo: não deve receber texto alternativo redundante se implementado por CSS.
6. Otimizar em WebP/AVIF, com versões responsivas se possível; evitar carregar uma imagem grande desnecessariamente no mobile.
7. O conteúdo da interface deve continuar legível caso a imagem falhe em carregar.

### CSS de referência

```css
.editorial-page {
  position: relative;
  isolation: isolate;
  background-color: var(--page-bg);
  min-height: 100vh;
}

.editorial-page::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  z-index: -1;
  height: min(950px, 100vh);
  background-image: url('/images/bolao-celeste-editorial-background.webp');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center top;
  opacity: 0.60;
  pointer-events: none;
}

.editorial-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

@media (max-width: 767px) {
  .editorial-page::before {
    height: 440px;
    opacity: 0.18;
    background-position: center top;
  }
}
```

> Ajustar posição/opacidade conforme o conteúdo real. O caminho acima é **sugestão**: mover o arquivo para esse endereço (ou adaptar a URL) antes de usar. Se a arte for usada com baixa opacidade, a versão final pode ficar ainda mais leve.

---

## 7. Estados, movimento e feedback

- **Hover:** transição de 140–180ms, mudanças sutis de cor/borda.
- **Focus:** contorno azul visível com `:focus-visible`.
- **Loading:** indicadores pequenos, sem alterar drasticamente a posição dos elementos.
- **Success:** cor verde acompanhada de mensagem textual.
- **Warning:** cor âmbar + rótulo explícito (“Aguardando pagamento”).
- **Error:** mensagem próxima ao componente que causou o erro, legível e objetiva.
- **Disabled:** aparência claramente inativa, sem depender só de opacidade.
- **Reduced motion:** desabilitar efeitos de deslocamento e ticker animado quando solicitado pelo sistema.

```css
:where(button, a, input, select, textarea):focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Acessibilidade mínima

- Almejar WCAG 2.2 nível AA.
- Contraste de texto normal ≥ **4,5:1** e texto grande ≥ **3:1**.
- Controles de placar com nomes acessíveis (`Aumentar gols do Cruzeiro`, por exemplo).
- Todos os estados de partida e pagamento devem ser entendidos sem depender das cores.
- Ordem de foco compatível com a ordem visual e sem armadilhas de teclado.
- Não tornar a arte de fundo um obstáculo para leitura.

---

## 8. Checklist de aplicação por tela

### Tela inicial / palpites

- [ ] Atualizar cores globais para a paleta editorial.
- [ ] Aplicar novo header + faixa de atividade.
- [ ] Criar hero tipográfico sem perder o texto original.
- [ ] Integrar a arte esportiva de fundo com responsividade.
- [ ] Atualizar cards de partidas e seleção ativa.
- [ ] Refinar o seletor de placar mantendo regras atuais.
- [ ] Destacar corretamente o botão “Ver meu pedido”.
- [ ] Reformular o painel lateral de premiação e indicadores.
- [ ] Garantir legibilidade e navegação em mobile.

### Jogos

- [ ] Criar cards editoriais de partidas com hierarquia de campeonato, horário e status.
- [ ] Usar filtros com estilos claros de ativo/inativo.
- [ ] Priorizar informações reais da partida sobre elementos decorativos.

### Ranking

- [ ] Destaque editorial para líderes, sem transformar todas as linhas em cards.
- [ ] Tabelas legíveis com linhas finas, números alinhados e cabeçalho claro.
- [ ] Usar acentos azuis pontuais em posições e ações relevantes.

### Meus palpites / pedidos

- [ ] Exibir status com texto e marcadores consistentes.
- [ ] Informar partida, placar escolhido, valor, data e confirmação de forma objetiva.
- [ ] Preservar histórico e ações atuais.
- [ ] Garantir que a experiência transacional continue mais discreta que a página inicial.

---

## 9. Plano de implementação (baixo risco)

**Fase 1 — Fundamentos**  
Criar tokens CSS, fontes, estilos globais, container, espaçamentos e componentes de botão/card. Não modificar lógica de negócio.

**Fase 2 — Shell da aplicação**  
Atualizar header, navegação, ticker, background e responsividade geral.

**Fase 3 — Tela de palpites**  
Redesenhar seleção de partidas, placar, resumo e painel lateral, preservando props, estado, validação e funções atuais.

**Fase 4 — Demais páginas**  
Propagar o design system para Jogos, Ranking e Meus palpites, evitando estilos isolados e inconsistentes.

**Fase 5 — Qualidade**  
Validar desktop/tablet/mobile, foco e teclado, contraste, carregamento, fluxo de pedido, feedback de pagamento, cenários de erro, tempo de carregamento da arte e regressões funcionais.

### Critérios de aceitação

1. A página tem estética editorial clara e é reconhecivelmente inspirada no Cruzeiro.
2. Header, seleção de partidas, controle de gols e CTA continuam imediatamente compreensíveis.
3. A arte de fundo não compromete legibilidade ou performance.
4. As telas funcionam bem em larguras de 375px, 768px, 1024px e 1440px.
5. Nenhuma regra de aposta/palpite, precificação, pedido, autenticação ou pagamento foi alterada pelo redesign.
6. O mesmo sistema de tokens é reutilizado nas demais rotas.

---

## 10. Prompt pronto para o Codex / agente de implementação

Copie o texto abaixo para o agente que trabalhará no repositório:

> Faça um redesign visual do projeto **Bolão Celeste** com base no arquivo `DESIGN_SYSTEM_BOLAO_CELESTE_EDITORIAL.md` e na imagem de referência editorial fornecida.
>
> **Objetivo:** transformar a interface atual em um produto de estética editorial esportiva premium, inspirado no Cruzeiro: fundo predominantemente claro, azul royal como cor de ação, títulos expressivos, layout arejado, cards brancos discretos, indicadores legíveis e background com arte esportiva nas bordas.
>
> **Prioridades:** (1) criar tokens e tipografia globais; (2) redesenhar header e ticker; (3) redesenhar a tela “Qual vai ser o placar?”; (4) aplicar a mesma linguagem visual a Jogos, Ranking e Meus palpites; (5) revisar responsividade, estados e acessibilidade.
>
> **Restrições obrigatórias:** antes de editar, inspecione a estrutura e o framework reais do repositório. Reutilize os componentes e padrões existentes. Não reescreva a aplicação, não altere contratos de API, modelos de dados, regras de negócio, valores, endpoints, autenticação, fluxos de pedido ou de pagamento. Não substitua dados reais por dados fictícios. Preserve os mecanismos de persistência do pedido e os estados existentes. Não adicione dependências sem necessidade.
>
> **Execução:** implemente por etapas pequenas e verificáveis. Centralize tokens. Use semântica HTML e acessibilidade. Garanta experiência mobile. Se a imagem de fundo não estiver no repositório, deixe um caminho de asset documentado ou use um fallback neutro, sem inventar um arquivo.
>
> **Validação:** rode lint, testes e build conforme os scripts existentes. Informe quais arquivos foram alterados, quais rotas foram tratadas, o que foi validado e quaisquer limitações restantes. Não declare o redesign concluído sem revisar os estados transacionais e a responsividade.

---

## 11. Resumo rápido para novas telas

**Fundo claro + títulos navy + azul royal nos pontos de ação + tipografia editorial + fotos/colagens esportivas apenas como decoração + interface funcional limpa.**

Se uma nova tela ficar visualmente carregada, a primeira solução deve ser **remover decoração e reduzir bordas**, não adicionar novas cores ou efeitos.
