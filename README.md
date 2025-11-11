# 🦟 LUDO DA DENGUE - Jogo Educativo

![Version](https://img.shields.io/badge/version-1.0.0-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.13.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

**Jogo educativo interativo sobre prevenção e combate à dengue, desenvolvido com React + Firebase**

---

## 🎮 Sobre o Jogo

O **Ludo da Dengue** é um jogo digital 2D que combina diversão e aprendizado sobre prevenção da dengue. Inspirado no clássico jogo de tabuleiro Ludo, os jogadores movem peões pelo tabuleiro, respondem perguntas educativas e aprendem sobre como combater o mosquito Aedes aegypti.

### ✨ Características Principais

- 🎲 **Gameplay Clássico**: Mecânica de Ludo com dado animado e movimento de peões
- ❓ **50 Perguntas Educativas**: Quiz completo sobre dengue, sintomas e prevenção
- 🏆 **Ranking Global**: Sistema de pontuação com Firebase Firestore
- 🏫 **Ranking Escolar**: Competição entre escolas (opcional)
- 🎨 **Visual Vibrante**: Interface colorida e animações suaves com Framer Motion
- 📱 **Responsivo**: Funciona em desktop, tablet e mobile
- 🔥 **Firebase Integration**: Auth, Firestore e Hosting
- 🎖️ **Certificado Digital**: Gere e compartilhe seu certificado
- 👥 **Multiplayer Local**: Até 4 jogadores (com IA)

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca UI
- **Vite 5.3.3** - Build tool e dev server
- **Framer Motion 11.3.0** - Animações
- **Zustand 4.5.4** - Gerenciamento de estado
- **Tailwind CSS 3.4.4** - Estilização
- **Lucide React 0.400.0** - Ícones

### Backend
- **Firebase 10.13.0**
  - Authentication (Google + Anônimo)
  - Firestore (Banco de dados)
  - Hosting (Deploy)

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Firebase (gratuita)

### Passo 1: Clone o Repositório

```bash
git clone https://github.com/seu-usuario/ludo-da-dengue.git
cd ludo-da-dengue
```

### Passo 2: Instale as Dependências

```bash
npm install
```

### Passo 3: Configure o Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative **Authentication** (Google e Anônimo)
4. Ative **Firestore Database**
5. Copie as credenciais do projeto

### Passo 4: Configure as Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Firebase:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Passo 5: Configure as Regras do Firestore

No Firebase Console, vá em **Firestore Database > Regras** e cole o conteúdo de `firestore.rules`.

### Passo 6: Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

O jogo estará disponível em `http://localhost:3000`

---

## 🎯 Como Jogar

### 1. **Tela Inicial**
- Escolha entre Jogar, Ranking, Como Jogar ou Sobre

### 2. **Login**
- Digite seu nome
- Escolha número de jogadores (1-4)
- Opcional: Digite o nome da sua escola
- Faça login com Google ou modo visitante

### 3. **Gameplay**

#### Tipos de Casas:
- 🏁 **Início**: Casa de partida
- ⬜ **Normal**: Casa comum, sem efeitos
- 💧 **Criadouro**: Água parada! Volte 3 casas
- 💪 **Mutirão**: Limpeza comunitária! Avance 2 casas
- ❓ **Quiz**: Responda e ganhe +10 pontos
- 🏆 **Fim**: Chegue aqui para vencer!

#### Controles:
- Clique em **"Rolar Dado"** para jogar
- Responda as perguntas do quiz
- Leia as curiosidades após cada resposta
- Chegue ao fim antes dos outros jogadores!

### 4. **Pontuação**
- **+10 pontos** por resposta correta
- **0 pontos** por resposta errada
- Quanto mais acertos, melhor sua posição no ranking!

### 5. **Final do Jogo**
- Veja suas estatísticas
- Confira sua posição no ranking
- Baixe seu certificado
- Compartilhe nas redes sociais

---

## 🏗️ Estrutura do Projeto

```
ludo-da-dengue/
├── public/
│   └── mosquito-icon.svg
├── src/
│   ├── components/
│   │   ├── About.jsx          # Tela sobre a dengue
│   │   ├── Board.jsx           # Tabuleiro do jogo
│   │   ├── Dice.jsx            # Dado animado
│   │   ├── Game.jsx            # Tela principal do jogo
│   │   ├── GameOver.jsx        # Tela de fim de jogo
│   │   ├── HowToPlay.jsx       # Instruções
│   │   ├── HUD.jsx             # Interface do jogo
│   │   ├── Login.jsx           # Tela de login
│   │   ├── Menu.jsx            # Menu principal
│   │   ├── MessageOverlay.jsx  # Mensagens do jogo
│   │   ├── QuizModal.jsx       # Modal de perguntas
│   │   └── Ranking.jsx         # Ranking global/escolar
│   ├── data/
│   │   └── perguntas.json      # 50 perguntas sobre dengue
│   ├── firebase/
│   │   ├── config.js           # Configuração Firebase
│   │   └── rankingService.js   # Serviços de ranking
│   ├── store/
│   │   └── gameStore.js        # Estado global (Zustand)
│   ├── App.jsx                 # Componente raiz
│   ├── main.jsx                # Entry point
│   └── index.css               # Estilos globais
├── .env.example                # Exemplo de variáveis
├── firebase.json               # Config Firebase Hosting
├── firestore.rules             # Regras de segurança
├── firestore.indexes.json      # Índices do Firestore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🔥 Deploy no Firebase Hosting

### 1. Instale o Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Faça Login no Firebase

```bash
firebase login
```

### 3. Inicialize o Projeto

```bash
firebase init
```

Selecione:
- ✅ Hosting
- ✅ Firestore

### 4. Build e Deploy

```bash
npm run build
firebase deploy
```

Seu jogo estará online em: `https://seu-projeto.web.app`

---

## 📊 Banco de Perguntas

O jogo inclui **50 perguntas** sobre:
- ✅ Transmissão da dengue
- ✅ Sintomas e tratamento
- ✅ Prevenção e criadouros
- ✅ Ciclo de vida do mosquito
- ✅ Medidas de proteção
- ✅ Importância da comunidade

Todas as perguntas incluem **curiosidades educativas** após a resposta!

---

## 🎨 Personalização

### Cores do Tema

Edite `tailwind.config.js`:

```js
colors: {
  'dengue-green': '#7CFC00',
  'dengue-blue': '#00BFFF',
  'dengue-yellow': '#FFD700',
  'dengue-red': '#FF4444',
  'dengue-purple': '#9B59B6'
}
```

### Adicionar Perguntas

Edite `src/data/perguntas.json`:

```json
{
  "id": 51,
  "pergunta": "Sua pergunta aqui?",
  "alternativas": ["Opção A", "Opção B", "Opção C", "Opção D"],
  "resposta": 1,
  "curiosidade": "Informação educativa aqui!"
}
```

### Modificar Tabuleiro

Edite `src/store/gameStore.js`:

```js
const BOARD_CONFIG = {
  totalCells: 40,  // Número de casas
  cellTypes: {
    // Tipos de casas
  }
};
```

---

## 🐛 Troubleshooting

### Erro de Autenticação Firebase

```bash
# Verifique se as credenciais estão corretas no .env
# Certifique-se de que Auth está ativado no Firebase Console
```

### Erro de Permissão Firestore

```bash
# Verifique se as regras em firestore.rules estão aplicadas
# No Firebase Console: Firestore > Regras
```

### Build Falha

```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📱 Modo Offline

O jogo inclui suporte offline básico:
- ✅ Perguntas carregadas localmente
- ✅ Progresso salvo no localStorage (fallback)
- ✅ Ranking local quando Firebase está offline

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com 💚 para educação em saúde pública

---

## 🙏 Agradecimentos

- Ministério da Saúde - Informações sobre dengue
- Comunidade React - Ferramentas incríveis
- Firebase - Infraestrutura gratuita
- Todos os educadores e agentes de saúde no combate à dengue

---

## 📞 Suporte

- 📧 Email: suporte@ludodadengue.com
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/ludo-da-dengue/issues)
- 💬 Discussões: [GitHub Discussions](https://github.com/seu-usuario/ludo-da-dengue/discussions)

---

## 🎯 Roadmap

### Versão 1.1 (Próxima)
- [ ] Sons e efeitos sonoros
- [ ] Mais animações de personagens
- [ ] Modo campanha (múltiplas fases)
- [ ] Conquistas e badges
- [ ] PWA (Progressive Web App)

### Versão 2.0 (Futuro)
- [ ] Multiplayer online em tempo real
- [ ] Chat entre jogadores
- [ ] Torneios escolares
- [ ] Modo cooperativo
- [ ] Versão mobile nativa (React Native)

---

## 📸 Screenshots

### Menu Principal
![Menu](docs/screenshots/menu.png)

### Gameplay
![Gameplay](docs/screenshots/gameplay.png)

### Quiz
![Quiz](docs/screenshots/quiz.png)

### Ranking
![Ranking](docs/screenshots/ranking.png)

---

## 🌟 Estrelas

Se este projeto foi útil para você, considere dar uma ⭐ no GitHub!

---

**🦟 Juntos contra a dengue! 💪**
