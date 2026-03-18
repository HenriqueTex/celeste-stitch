---
description: Workflow completo para desenvolvimento frontend com React, Next.js, Tailwind CSS v4 e design premium. Ativar quando estiver criando ou refinando componentes, páginas ou layouts.
---

# React Frontend Development Workflow

Workflow que combina as melhores skills de UI/UX, React, Next.js, Tailwind e design para garantir que todo desenvolvimento frontend siga padrões de excelência.

---

## 📋 Skills Ativadas Automaticamente

Ao usar este workflow, as seguintes skills devem ser consultadas em cada etapa:

| Skill | Papel no Workflow |
|-------|-------------------|
| `react-patterns` | Composição, hooks, state management, TypeScript patterns |
| `react-best-practices` | 45 regras de performance (Vercel Engineering) |
| `nextjs-best-practices` | App Router, Server/Client Components, caching, metadata |
| `tailwind-patterns` | Tailwind CSS v4, `@theme`, container queries, design tokens |
| `frontend-design` | Estética intencional, DFII scoring, identidade visual única |
| `design-spells` | Micro-interações e detalhes que adicionam "magia" à UI |
| `fixing-accessibility` | WCAG compliance, ARIA, keyboard navigation, focus management |

---

## 🔄 Etapas do Workflow

### 1. Análise e Planejamento
// turbo-all

Antes de escrever código:

1. Leia a skill `frontend-design` (SKILL.md) para definir a **direção estética**
2. Defina: propósito da UI, tom visual (máx. 2 direções), e **âncora de diferenciação**
3. Calcule o **DFII** (Design Feasibility & Impact Index) — mínimo de 8 para prosseguir
4. Leia a skill `nextjs-best-practices` para decidir **Server vs Client Components**
5. Leia a skill `react-patterns` para escolher o **pattern de estado** adequado

**Output esperado:**
- Direção estética nomeada
- DFII score ≥ 8
- Mapa de componentes (Server vs Client)
- Estratégia de estado (useState, Context, Zustand, React Query)

---

### 2. Design System & Tokens

1. Leia a skill `tailwind-patterns` para configurar o `@theme` com tokens semânticos
2. Defina no CSS (não em JS):
   - Paleta de cores (OKLCH preferido) — 1 dominante, 1 accent, 1 neutral
   - Tipografia — 1 display font + 1 body font (evitar Inter/Roboto/Arial)
   - Escala de espaçamento
   - Variáveis CSS para dark mode
3. Verifique contraste com a skill `fixing-accessibility`

**Regras:**
- Usar `@theme {}` do Tailwind v4 (CSS-first, sem tailwind.config.js)
- Preferir container queries (`@container`) para componentes reutilizáveis
- Mobile-first: estilos base sem prefixo, overrides com `sm:`, `md:`, `lg:`

---

### 3. Construção dos Componentes

1. Leia a skill `react-patterns` para definir tipos de componentes:
   - **Server Components** → data fetching, layout, conteúdo estático
   - **Client Components** → interatividade, forms, event handlers
2. Leia a skill `react-best-practices` e aplique as regras por prioridade:
   - **CRITICAL:** Eliminar waterfalls (`Promise.all`, Suspense boundaries)
   - **CRITICAL:** Otimizar bundle (imports diretos, dynamic imports, defer third-party)
   - **HIGH:** Server-side performance (React.cache, parallel fetching)
   - **MEDIUM:** Re-render optimization (useMemo, useCallback — somente se necessário)
3. Para cada componente, consulte `fixing-accessibility`:
   - Nomes acessíveis em todos os controles interativos
   - Navegação por teclado funcional
   - Focus management em modais/dialogs
   - `aria-label` em botões com ícones

**Anti-patterns a evitar:**
- ❌ `'use client'` em tudo → Server Component por padrão
- ❌ Prop drilling profundo → usar Context
- ❌ Componentes gigantes → dividir em componentes menores
- ❌ `useEffect` para tudo → preferir Server Components
- ❌ Index como key → usar ID único e estável

---

### 4. Polish & Micro-Interações

1. Leia a skill `design-spells` para adicionar "magia":
   - Identifique partes "standard" da interface
   - Adicione hover states criativos, transições surpreendentes, loaders únicos
   - Use CSS-first para animações; Framer Motion somente quando justificado
2. Aplique motion com propósito (skill `frontend-design`):
   - Uma sequência de entrada forte
   - Poucos hover states significativos
   - Respeitar `prefers-reduced-motion`
3. Texturas quando apropriado: noise/grain, gradientes mesh, translucência em camadas

**Regra de ouro:** Se a UI pode ser confundida com um template → refazer.

---

### 5. Verificação Final

Checklist obrigatório antes de finalizar:

**Design (skill `frontend-design`):**
- [ ] Direção estética clara e declarada
- [ ] DFII ≥ 8
- [ ] Uma âncora de design memorável
- [ ] Sem fontes/cores/layouts genéricos
- [ ] Código combina com a ambição do design

**React (skills `react-patterns` + `react-best-practices`):**
- [ ] Server Components por padrão
- [ ] Sem waterfalls de fetch
- [ ] Bundle otimizado (imports diretos, dynamic imports)
- [ ] Estado no nível correto (local vs shared vs global)
- [ ] TypeScript strict em todos os componentes

**Tailwind (skill `tailwind-patterns`):**
- [ ] Tokens via `@theme {}` (CSS-first)
- [ ] Mobile-first responsive
- [ ] Container queries em componentes reutilizáveis
- [ ] Dark mode funcional
- [ ] Sem valores arbitrários desnecessários

**Acessibilidade (skill `fixing-accessibility`):**
- [ ] Todos os controles com nomes acessíveis
- [ ] Navegação por teclado funcional
- [ ] Contraste suficiente
- [ ] Focus visível para keyboard users
- [ ] Elementos semânticos nativos preferidos

**Performance:**
- [ ] Build sem erros
- [ ] Sem console warnings/errors
- [ ] Verificação visual no browser
- [ ] Responsividade testada (mobile → desktop)

---

## 🚀 Comando Rápido

Para ativar o workflow completo em uma tarefa:

```
/react-frontend
```

Isso carrega automaticamente todas as 7 skills e aplica o workflow passo a passo.

---

## 📝 Notas

- Este workflow é **iterativo** — volte para etapas anteriores se descobrir problemas
- As skills `react-best-practices` e `fixing-accessibility` devem ser consultadas **continuamente**, não apenas no final
- Para projetos com Next.js, a skill `nextjs-best-practices` tem prioridade sobre `react-patterns` em decisões de data fetching e routing
