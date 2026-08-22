# **Plano Executivo & Arquitetural Unificado: Alaska Local (V3)**

Documento consolidado integrando a modelagem multi-tenant de domínio único com resolução dinâmica, a estratégia comercial de fluxo de caixa rápido (14 a 30 dias), scripts de prospecção e o roadmap de engenharia desacoplada (Nuxt 3 \+ NestJS).

## **1\. Proposta de Valor & Naming do Produto**

* **Identidade Comercial:** **Alaska Local** (Submódulos: *Alaska Menu* para restaurantes/delivery e *Alaska Hub* para prestadores de serviços).  
* **Posicionamento:** Plataforma *Done-for-You* (Feito para Você) onde o lojista adquire presença orgânica no Google Maps, catálogo digital com domínio próprio (pizzariadoze.com.br) e pedidos diretos no WhatsApp sem pagar comissões por transação.

| Pilar da Oferta MD | Escopo da Solução MD | Diferencial vs. Concorrentes MD+ 1 |
| :---- | :---- | :---- |
| **Hub de Links & Vitrine Mobile**  | Página mobile-first em Nuxt 3, identidade visual da marca, botões de atendimento direto e catálogo integrado. | Sem custos em moeda estrangeira (vs. Linktree) e com semântica otimizada para SEO local. |
| **Otimização de Perfil no Google**  | Auditoria e SEO local no Google Maps/Busca, padronização NAP (Nome, Endereço e Telefone), fotos e link direto. | Captação ativa do tráfego de alta intenção comercial imediata ("aberto perto de mim"). |
| **Cardápio no WhatsApp**  | Vitrine interativa com adicionais, carrinho, taxa de entrega e despacho formatado via URL Scheme (wa.me). | Risco zero de banimento de número (vs. Cardápio Web) e sem robôs travados (vs. Anota AI). |

## **2\. Arquitetura de Multi-tenancy & Resolução de Domínios**

A plataforma adota o princípio de **código único para múltiplos domínios**, evitando repositórios isolados e simplificando a manutenção:

| Estágio do Lead/Cliente MD | Formato da URL MD | Comportamento Técnico MD |
| :---- | :---- | :---- |
| **1\. Demonstração (Lead)**  | alaska-websites.com.br/pizzaria-do-ze  | Rota dinâmica no Nuxt 3 (pages/\[slug\].vue) que renderiza os dados públicos do lead. |
| **2\. Cliente Padrão**  | pizzariadoze.alaska.app  | Subdomínio wildcard (\*.alaska.app) com certificado SSL automático. |
| **3\. Cliente com Domínio Próprio**  | \[www.pizzariadoze.com\](https://www.pizzariadoze.com).br  | Apontamento CNAME (cname.vercel-dns.com). O middleware do Nuxt identifica o cabeçalho host da requisição e carrega os dados do lojista sem alterar a URL exibida. |

### **Resolução de Domínio no Nuxt 3 (Server Middleware)**

TypeScript  
// server/middleware/tenant.ts  
export default defineEventHandler((event) \=\> {  
  const host \= getRequestHost(event) // ex: "www.pizzariadoze.com.br" ou "alaska-websites.com.br"  
    
  if (\!host.includes('alaska-websites.com.br') && \!host.includes('localhost')) {  
    // Mapeia o domínio customizado para o slug correspondente  
    event.context.tenantSlug \= getSlugByCustomDomain(host) // ex: "pizzariadoze"  
  }  
})

## **3\. Plano de Negócio: Estratégia de Caixa Rápido (14 a 30 Dias)**

Meta de faturamento inicial: **R$ 2.000 a R$ 5.000** através de fechamentos diretos.

### **3.1. Arquitetura de Precificação**

| Modalidade MD | Preço Sugerido MD | Alavanca de Fechamento / Aplicação MD+ 1 |
| :---- | :---- | :---- |
| **Plano Mensal Padrão**  | R$ 300 a R$ 450 (Setup) \+ R$ 60 a R$ 90/mês | Entrada para remunerar o trabalho manual de cadastro e SEO; recorrência automatizada via Asaas (Pix D+0). |
| **Plano Anual Antecipado**  | R$ 720 à vista (ou até 12x no cartão) | **"Setup Gratuito \+ Domínio Incluso no 1º Ano"**. Injeção de caixa imediata e churn zero no primeiro ano. |

### **3.2. Playbook de Abordagem, Scripts & Objeções**

#### **Scripts Prontos para Prospecção via WhatsApp**

* Alimentação (Food Service):"Olá, \[Nome do Responsável\]. Acompanhando o trabalho da \[Nome do Estabelecimento\], vi que a qualidade é excelente, mas o recebimento de pedidos no WhatsApp em dias movimentados é bem corrido. Para ajudar a organizar os pedidos e evitar erros no horário de pico, montei uma versão demonstrativa do Cardápio Digital de vocês com fotos do Instagram. O cliente escolhe e o pedido cai somado e formatado no WhatsApp: \[link-demo\]. Se fizer sentido colocar no ar hoje para testar no movimento de logo mais, me avise\!"  
* Serviços (Barbearias / Salões / Clínicas):"Olá, \[Nome\]. Buscando serviços de \[Especialidade\] no Google Maps aqui na região, vi que o perfil de vocês está com pouca visibilidade nas buscas locais. Estruturei uma prévia de um Hub de Links profissional integrado ao perfil do Google para facilitar o agendamento de novos clientes: \[link-demo\]. Quer ver como colocar vocês no topo das pesquisas locais esta semana?"

#### **Práticas contra Bloqueios no WhatsApp**

* Evitar termos agressivos como "grátis" e "promoção" na mensagem de abertura.  
* Praticar *pacing* (envios manuais e espaçados, sem automações de disparo em massa).  
* Entregar o link como resultado de uma consultoria personalizada.

#### **Contorno Analítico de Objeções**

> 1. "Já uso o Instagram e WhatsApp, não preciso":  
   * *Argumento:* O Instagram retém quem já te segue, mas quem busca "pizzaria aberta perto de mim" no Google Maps quer consumir na hora. O cardápio digital organiza o pedido e impede desistências causadas por demora na resposta manual.  
> 2. "Achei caro / Sem verba agora":  
   * *Argumento:* Plataformas como iFood cobram até 27% sobre cada pedido. Ao direcionar 3 a 4 pedidos mensais para o seu canal próprio, a economia nas taxas já paga integralmente os R$ 60 da assinatura.  
> 3. "Não entendo de tecnologia, não saberei mexer":  
   * *Argumento:* Nosso modelo é *Done-for-You* (Feito para Você). Toda a configuração, fotos e produtos são cadastrados por nós. Sua equipe só recebe os pedidos prontos e somados no WhatsApp como já faz no dia a dia.

#### **Vendas Presenciais (Field Sales)**

* Visitas a bares, restaurantes e confeitarias devem ocorrer estritamente entre **15h00 e 17h00** (vale operacional).  
* O consultor entrega o celular na mão do dono com a demonstração aberta, convidando-o a simular um pedido.

## **4\. Plano de Engenharia de Software (Evolução Técnica Gradual)**

Desenvolvimento dividido em 3 estágios para garantir caixa antes de investir tempo em recursos complexos:

### **Estágio 1: Modo Sem Backend (0 a 5 Clientes Pagantes)**

* **Front-end Estático (Nuxt 3 \+ Tailwind):** Template modular responsivo populado por arquivos JSON estáticos.  
* **Despacho Direto:** Carrinho processa itens, opcionais, taxa de entrega e gera o payload formatado na URL wa.me/55....  
* **Infraestrutura:** Hospedagem na Vercel ou Cloudflare Pages com custo de infraestrutura inicial de R$ 0\.

### **Estágio 2: Fundação Multi-tenant & Backend NestJS (6 a 15 Clientes Pagantes)**

* **Core Domain:** Entidades desacopladas (Merchant, Product, Category, Order) e Value Objects (Money, Slug, PhoneNumber).  
* **Core Application:** Use cases isolados por Ports (CreateMerchantUseCase, GetPublicMenuUseCase, UpdateMenuUseCase).  
* **Infrastructure:** Validação Fail-Fast via Zod, persistência em PostgreSQL/Supabase com Row-Level Security (RLS), testes automatizados com Vitest e governança via ADRs.  
* **Painel Administrativo (Nuxt Admin):** Interface simplificada para o lojista alterar preços, pausar itens em falta e ajustar horários de funcionamento.

### **Estágio 3: Micro-SaaS Completo & Automações Avançadas (15+ Clientes Pagantes)**

* **Liquidação Instantânea de Pix:** Integração via Webhooks (OpenPix/Asaas) para confirmação de pagamento em até 1,5 segundos.  
* **Impressão Térmica de Cupom:** Disparo de comandos ESC/POS para impressoras térmicas (58mm/80mm) via Web Bluetooth API direto do navegador móvel do caixa.  
* **Módulo de Agendamento Online:** Gestão de horários integrada ao Google Calendar para barbearias, salões e clínicas.

## **5\. Checklist Operacional de Execução (14 Dias)**

| Período MD | Foco Operacional MD | Entregáveis & Ações Práticas MD |
| :---- | :---- | :---- |
| **Dias 1 a 3**  | Setup do Template & Mapeamento | Finalizar template base modular no Nuxt 3 com rota dinâmica \[slug\].vue. Homologar conta no gateway Asaas. Mapear 30 a 50 comércios no Google Maps/Instagram e gerar 5 a 10 demos personalizadas. |
| **Dias 4 a 7**  | Prospecção Ativa (Remoto \+ Campo) | Iniciar cadência no WhatsApp enviando os links de demonstração. Realizar visitas presenciais no horário das 15h00 às 17h00. |
| **Dias 8 a 10**  | Negociação & Fechamentos | Apresentar a oferta do Plano Anual (R$ 720 com Setup Isento) ou Plano Padrão (Setup R$ 350 \+ R$ 60/mês). Enviar links de cobrança e fechar os primeiros contratos. |
| **Dias 11 a 14**  | Onboarding & SEO Local | Configurar o cadastro dos produtos e otimização da ficha do Google Meu Negócio. Coletar depoimentos em áudio no WhatsApp para servir de prova social no ciclo seguinte. |

