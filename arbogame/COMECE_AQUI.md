# 🎮 COMECE AQUI - ARBOGAME LUDO DA DENGUE

## ⚡ INÍCIO RÁPIDO (2 PASSOS)

### 1️⃣ CONFIGURAR FIREBASE (5 minutos)

**⚠️ IMPORTANTE:** O jogo precisa do Firebase configurado para funcionar!

👉 **Siga o guia:** `FIREBASE_SETUP_RAPIDO.md`

**Resumo:**
1. Acesse: https://console.firebase.google.com/project/arbogame-6e1b7
2. Ative **Authentication** → **Anonymous**
3. Crie **Firestore Database**
4. Aplique as **Regras de Segurança** (copie do guia)

### 2️⃣ JOGAR

```bash
# O servidor já está rodando em:
http://localhost:3001
```

**Se não estiver rodando:**
```bash
npm run dev
```

---

## 🎯 O QUE VOCÊ TEM

### ✅ JOGO COMPLETO
- 🎲 Tabuleiro Ludo com 40 casas
- ❓ 50 perguntas sobre dengue
- 🎮 Solo (1-4 jogadores com IA)
- 👥 Multiplayer Online (até 4 jogadores reais)
- 🏆 Sistema de ranking global e escolar
- 🎨 Design AAA profissional
- 📱 Responsivo (desktop + mobile)

### ✅ FIREBASE INTEGRADO
- 🔥 Authentication (Anônimo + Google)
- 📊 Firestore Database estruturado
- 👥 Salas multiplayer em tempo real
- 🏆 Rankings online
- 📈 Estatísticas globais

### ✅ DESIGN PROFISSIONAL
- 🎨 Paleta de cores AAA
- ✨ Animações cinematográficas
- 💎 Glassmorphism effects
- 🌈 Gradientes modernos
- 🎯 UX de alto nível

---

## 📁 ESTRUTURA DO PROJETO

```
ArboGame/
├── 📄 COMECE_AQUI.md              ← VOCÊ ESTÁ AQUI
├── 📄 FIREBASE_SETUP_RAPIDO.md    ← Configure primeiro!
├── 📄 MULTIPLAYER_GUIDE.md        ← Guia de multiplayer
├── 📄 DESIGN_SYSTEM.md            ← Design system AAA
├── 📄 README.md                   ← Documentação completa
│
├── src/
│   ├── components/
│   │   ├── MenuAAA.jsx            ← Menu profissional
│   │   ├── Login.jsx              ← Login (Solo/Multiplayer)
│   │   ├── MultiplayerLobby.jsx   ← Lobby multiplayer
│   │   ├── Game.jsx               ← Gameplay
│   │   ├── Board.jsx              ← Tabuleiro
│   │   ├── Dice.jsx               ← Dado animado
│   │   ├── QuizModal.jsx          ← Quiz de perguntas
│   │   ├── HUD.jsx                ← Interface do jogo
│   │   ├── GameOver.jsx           ← Tela final
│   │   ├── Ranking.jsx            ← Rankings
│   │   ├── HowToPlay.jsx          ← Como jogar
│   │   └── About.jsx              ← Sobre a dengue
│   │
│   ├── firebase/
│   │   ├── config.js              ← Configuração Firebase
│   │   ├── rankingService.js      ← Serviços de ranking
│   │   └── multiplayerService.js  ← Serviços multiplayer
│   │
│   ├── store/
│   │   └── gameStore.js           ← Estado global (Zustand)
│   │
│   ├── data/
│   │   └── perguntas.json         ← 50 perguntas sobre dengue
│   │
│   ├── App.jsx                    ← Componente raiz
│   ├── main.jsx                   ← Entry point
│   └── index.css                  ← Estilos globais
│
├── scripts/
│   └── initFirebase.js            ← Inicializar banco de dados
│
└── public/
    └── mosquito-icon.svg          ← Ícone do jogo
```

---

## 🎮 COMO JOGAR

### MODO SOLO (com IA)

1. Abra: http://localhost:3001
2. Clique em **"JOGAR"**
3. Digite seu nome
4. Escolha número de jogadores (1-4)
5. Clique em **"JOGAR SOLO"**
6. Role o dado e jogue!

### MODO MULTIPLAYER ONLINE

**Criar Sala:**
1. Clique em **"JOGAR"**
2. Digite seu nome
3. Clique em **"MULTIPLAYER ONLINE"**
4. Clique em **"CRIAR SALA"**
5. Compartilhe o código com amigos
6. Aguarde todos entrarem
7. Todos marcam **"PRONTO"**
8. Host clica **"INICIAR JOGO"**

**Entrar em Sala:**
1. Clique em **"JOGAR"**
2. Digite seu nome
3. Clique em **"MULTIPLAYER ONLINE"**
4. Clique em **"ENTRAR"**
5. Digite o código da sala
6. Marque **"PRONTO"**
7. Aguarde o host iniciar

---

## 🎯 MECÂNICAS DO JOGO

### Tipos de Casas

| Casa | Efeito | Emoji |
|------|--------|-------|
| **Início** | Casa de partida | 🏁 |
| **Normal** | Sem efeito | ⬜ |
| **Criadouro** | Volta 3 casas | 💧 |
| **Mutirão** | Avança 2 casas | 💪 |
| **Quiz** | Pergunta (+10 pts) | ❓ |
| **Fim** | Vitória! | 🏆 |

### Pontuação

- ✅ **Resposta correta**: +10 pontos
- ❌ **Resposta errada**: 0 pontos
- 🏆 **Vencer o jogo**: Bônus de posição

---

## 🔥 COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Inicializar banco de dados
node scripts/initFirebase.js

# Limpar cache
rm -rf node_modules/.vite
npm run dev -- --force

# Deploy Firebase
npm run build
firebase deploy
```

---

## 🐛 PROBLEMAS COMUNS

### ❌ Erro: `auth/configuration-not-found`

**Solução:** Configure o Firebase Authentication
👉 Veja: `FIREBASE_SETUP_RAPIDO.md`

### ❌ Erro: CSS não carrega

**Solução:** Limpe o cache
```bash
rm -rf node_modules/.vite
npm run dev -- --force
```

### ❌ Erro: Porta 3000 em uso

**Solução:** Vite escolhe automaticamente outra porta (3001, 3002, etc.)
Ou mate o processo:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [número] /F
```

### ❌ Multiplayer não funciona

**Checklist:**
- [ ] Firebase Authentication ativado?
- [ ] Firestore Database criado?
- [ ] Regras de segurança aplicadas?
- [ ] Internet conectada?
- [ ] Ambos os jogadores logados?

---

## 📚 DOCUMENTAÇÃO

### Guias Disponíveis

1. **FIREBASE_SETUP_RAPIDO.md** - Configure o Firebase (LEIA PRIMEIRO!)
2. **MULTIPLAYER_GUIDE.md** - Guia completo de multiplayer
3. **DESIGN_SYSTEM.md** - Sistema de design AAA
4. **README.md** - Documentação técnica completa
5. **DESENVOLVIMENTO.md** - Guia para desenvolvedores
6. **SETUP_FIREBASE.md** - Configuração detalhada Firebase

### Tecnologias

- **React 18.3.1** - UI Framework
- **Vite 5.3.3** - Build Tool
- **Firebase 10.13.0** - Backend
- **Framer Motion 11.3.0** - Animações
- **Zustand 4.5.4** - Estado Global
- **Tailwind CSS 3.4.4** - Estilização
- **Lucide React** - Ícones

---

## 🎓 CONTEÚDO EDUCATIVO

### 50 Perguntas Sobre:

1. **Transmissão da Dengue** (10 perguntas)
   - Mosquito Aedes aegypti
   - Ciclo de vida
   - Horários de picada

2. **Sintomas e Tratamento** (10 perguntas)
   - Sintomas comuns
   - Dengue hemorrágica
   - Medicamentos

3. **Prevenção** (15 perguntas)
   - Criadouros
   - Medidas de proteção
   - Limpeza

4. **Comunidade** (8 perguntas)
   - Papel da comunidade
   - Agentes de saúde
   - Mutirões

5. **Conhecimento Geral** (7 perguntas)
   - Tipos de vírus
   - Vacinas
   - Estatísticas

Cada pergunta inclui **curiosidade educativa**!

---

## 🎨 DESIGN HIGHLIGHTS

### Cores Principais

- **Primary (Verde)**: `#00E65C` - Natureza, saúde
- **Secondary (Azul)**: `#0BA5E9` - Água, informação
- **Accent (Amarelo)**: `#F59E0B` - Energia, vitória
- **Danger (Vermelho)**: `#EF4444` - Alerta, criadouro

### Efeitos Especiais

- ✨ Glassmorphism (vidro fosco)
- 🌟 Neon Glow (brilho neon)
- 🌈 Gradient Text (texto gradiente)
- 💫 Smooth Animations (animações suaves)

---

## 🚀 PRÓXIMOS PASSOS

### Agora:
1. ✅ Configure o Firebase (5 min)
2. ✅ Jogue e teste (10 min)
3. ✅ Convide amigos para multiplayer

### Depois:
- [ ] Customize cores (veja DESIGN_SYSTEM.md)
- [ ] Adicione mais perguntas (edite perguntas.json)
- [ ] Deploy no Firebase Hosting
- [ ] Compartilhe com escolas

---

## 🎉 PRONTO PARA JOGAR!

### Checklist Final

- [ ] Firebase configurado
- [ ] Servidor rodando (`npm run dev`)
- [ ] Navegador aberto (http://localhost:3001)
- [ ] Nome digitado
- [ ] Modo escolhido (Solo ou Multiplayer)
- [ ] Diversão garantida! 🎮

---

## 💡 DICAS

### Para Professores

- Use o **ranking escolar** para competições entre turmas
- Acompanhe estatísticas no Firebase Console
- Crie torneios com códigos de sala específicos
- Use as curiosidades como material didático

### Para Desenvolvedores

- Código bem documentado e organizado
- Fácil de customizar e expandir
- Design system profissional
- Pronto para produção

### Para Jogadores

- Jogue com amigos online
- Aprenda sobre dengue de forma divertida
- Compete no ranking global
- Ganhe certificado digital

---

## 📞 SUPORTE

### Problemas?

1. Leia `FIREBASE_SETUP_RAPIDO.md`
2. Verifique o console do navegador (F12)
3. Limpe o cache (`rm -rf node_modules/.vite`)
4. Reinicie o servidor

### Quer Contribuir?

Veja `CONTRIBUTING.md` para diretrizes.

---

**🎮 BOM JOGO! VAMOS COMBATER A DENGUE JUNTOS! 🦟💪**

---

*ArboGame - Ludo da Dengue v1.0.0*
*Desenvolvido com 💚 para educação em saúde pública*
