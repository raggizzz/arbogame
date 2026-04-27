# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.0.0] - 2024-11-04

### 🎉 Lançamento Inicial

#### ✨ Adicionado

**Gameplay:**
- Tabuleiro estilo Ludo com 40 casas
- Sistema de dado animado
- Movimento de peões
- 5 tipos de casas especiais:
  - Casa Inicial
  - Casa Normal
  - Casa do Criadouro (volta 3 casas)
  - Casa do Mutirão (avança 2 casas)
  - Casa do Quiz (pergunta educativa)
  - Casa Final (vitória)

**Sistema de Quiz:**
- 50 perguntas sobre dengue
- 4 alternativas por pergunta
- Curiosidades educativas após cada resposta
- Sistema de pontuação (+10 por acerto)
- Controle de perguntas já respondidas

**Multiplayer Local:**
- Suporte para 1-4 jogadores
- IA para jogadores 2-4
- Cores distintas para cada jogador
- Turnos alternados

**Firebase Integration:**
- Autenticação anônima
- Login com Google
- Ranking global no Firestore
- Ranking por escola
- Salvamento de progresso
- Persistência offline (fallback localStorage)

**Interface:**
- Menu principal animado
- Tela de login com opções
- HUD com pontuação e estatísticas
- Painel de jogadores
- Modal de quiz interativo
- Mensagens animadas de feedback
- Tela de Game Over com estatísticas
- Certificado digital para impressão
- Ranking global e escolar
- Telas informativas (Como Jogar, Sobre a Dengue)

**Animações:**
- Framer Motion para transições suaves
- Dado com animação de rolagem
- Peões com movimento animado
- Mosquitos animados de fundo
- Confetes na tela de vitória
- Efeitos de hover e tap

**Responsividade:**
- Layout adaptativo para desktop
- Suporte para tablet
- Otimizado para mobile
- Touch-friendly

**Acessibilidade:**
- Foco visível em elementos interativos
- Cores de alto contraste
- Mensagens claras e descritivas

#### 🎨 Design

- Paleta de cores vibrantes (verde-limão, azul, amarelo, roxo)
- Tipografia amigável (Comic Sans MS)
- Ícones Lucide React
- Gradientes modernos
- Sombras e profundidade
- Animações suaves

#### 📚 Documentação

- README.md completo
- Guia de configuração Firebase (SETUP_FIREBASE.md)
- Guia de desenvolvimento (DESENVOLVIMENTO.md)
- Changelog
- Licença MIT

#### 🔧 Configuração

- Vite como build tool
- Tailwind CSS para estilização
- Zustand para gerenciamento de estado
- Firebase SDK 10.13.0
- ESLint e Prettier configurados
- Git ignore configurado

#### 🌐 Deploy

- Firebase Hosting configurado
- Regras de segurança Firestore
- Índices otimizados
- Build otimizado com code splitting

---

## [Unreleased]

### 🚀 Planejado para v1.1

- [ ] Sistema de sons e música
- [ ] Mais animações de personagens
- [ ] Modo campanha (múltiplas fases)
- [ ] Sistema de conquistas
- [ ] PWA (Progressive Web App)
- [ ] Modo escuro
- [ ] Mais idiomas (inglês, espanhol)

### 🔮 Planejado para v2.0

- [ ] Multiplayer online em tempo real
- [ ] Chat entre jogadores
- [ ] Torneios escolares
- [ ] Modo cooperativo
- [ ] Versão mobile nativa
- [ ] Sistema de níveis e XP
- [ ] Loja de customizações

---

## Tipos de Mudanças

- `✨ Adicionado` - Novas funcionalidades
- `🔄 Modificado` - Mudanças em funcionalidades existentes
- `🗑️ Removido` - Funcionalidades removidas
- `🐛 Corrigido` - Correção de bugs
- `🔒 Segurança` - Correções de segurança
- `📚 Documentação` - Mudanças na documentação
- `🎨 Design` - Mudanças visuais
- `⚡ Performance` - Melhorias de performance

---

**Legenda de Versões:**
- **Major** (X.0.0) - Mudanças incompatíveis
- **Minor** (0.X.0) - Novas funcionalidades compatíveis
- **Patch** (0.0.X) - Correções de bugs

---

Para ver todas as mudanças, visite: [GitHub Releases](https://github.com/seu-usuario/ludo-da-dengue/releases)
