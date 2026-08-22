# 🤖 Diretrizes de Governança para Agentes de IA

Este repositório é governado por regras estritas de engenharia de software e evolução gradual (YAGNI).

## Regras Inegociáveis:
1. **Estágio Atual (Estágio 1):** O projeto opera no modo sem backend. É terminantemente proibido sugerir ou criar bancos de dados (Prisma/TypeORM/Postgres) ou APIs NestJS nesta fase.
2. **Estrutura Front-end:** Todas as pastas do Nuxt 3 residem na raiz (sem pasta `src/`).
3. **Validação:** Toda leitura de dados deve passar pelos schemas Zod em `types/tenant.ts`.
4. **Carregamento de Dados:** Utilizar `import.meta.glob('~/data/*.json', { eager: true })` para garantir compatibilidade com SSR na Vercel.
5. **Ícones & Design:** Utilizar `lucide-vue-next` e paleta Slate/Emerald.

## Mapa de Documentação:
- Dúvidas de Arquitetura e Roadmap $\rightarrow$ Consulte `docs/architecture/ROADMAP.md`
- Dúvidas Comerciais e Scripts $\rightarrow$ Consulte `docs/commercial/PITCH_SCRIPTS.md`
- Procedimentos Operacionais de Demos $\rightarrow$ Consulte `docs/operations/RUNBOOK_DEMOS.md`