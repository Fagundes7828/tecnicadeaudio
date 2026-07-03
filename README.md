# Sistema Técnico — Mesa / Medusa / Equipamentos

Sistema de gerenciamento técnico para sonorização ao vivo. Interface visual escura estilo broadcast / painel de áudio profissional.

## Estrutura de Arquivos

```
├── sistema_tecnico.html   → Página principal (HTML estrutural)
├── styles.css             → Estilos visuais (tema escuro broadcast)
├── app.js                 → Lógica completa (dados, renderização, persistência)
└── README.md              → Este arquivo
```

## Módulos

| Aba | Descrição |
|-----|-----------|
| **Dashboard** | Visão geral com contadores de equipamentos, status de manutenção e próximas revisões |
| **Canais** | Mapa Mesa ↔ Medusa (32 canais) com toggle Modo Mesa / Modo Medusa, tipo, equipamento vinculado e observações |
| **Equipamentos** | Cadastro por categoria (Instrumentos, Microfones, Cabos, Mesas, Processadores, Monitores, Caixas, Computadores) |
| **Manutenção** | Tabela com última/próxima manutenção e status automático (Ok · Atenção ≤30 dias · Vencido) |
| **Calendário** | Calendário mensal com eventos manuais + manutenções previstas (puxadas automaticamente do cadastro) |
| **Roteamento** | Cadeia visual: Canal → Medusa/Local → Equipamento → Nome do canal |

## Persistência

Os dados são salvos automaticamente no `localStorage` do navegador. Nenhum backend é necessário.

## Como usar

1. Abra `sistema_tecnico.html` em qualquer navegador moderno
2. Ou publique via GitHub Pages (Settings → Pages → Branch: main)

## Tecnologias

- HTML5 + CSS3 + JavaScript vanilla (sem dependências)
- Fontes: Oswald · Space Mono · Inter (Google Fonts)
- Persistência: localStorage
