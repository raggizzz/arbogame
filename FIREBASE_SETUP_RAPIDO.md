# 🔥 CONFIGURAÇÃO RÁPIDA DO FIREBASE

## ⚠️ ERRO: `auth/configuration-not-found`

Este erro significa que você precisa **ativar o Authentication no Firebase Console**.

---

## 🚀 SOLUÇÃO RÁPIDA (5 minutos)

### 1. Acesse o Firebase Console
👉 https://console.firebase.google.com/project/arbogame-6e1b7

### 2. Ativar Authentication

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Começar"** (Get Started)
3. Aguarde alguns segundos

### 3. Ativar Login Anônimo

1. Vá na aba **"Sign-in method"**
2. Clique em **"Anonymous"** (Anônimo)
3. **Ative o toggle** (switch para ON)
4. Clique em **"Salvar"**

### 4. Ativar Login com Google (Opcional)

1. Na mesma aba, clique em **"Google"**
2. **Ative o toggle**
3. Selecione um **email de suporte** (seu email)
4. Clique em **"Salvar"**

### 5. Criar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione **"Iniciar no modo de produção"**
4. Escolha localização: **`southamerica-east1` (São Paulo)**
5. Clique em **"Ativar"**
6. Aguarde 1-2 minutos

### 6. Aplicar Regras de Segurança

1. No Firestore, vá na aba **"Regras"**
2. **Apague todo o conteúdo**
3. **Cole** o código abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Salas multiplayer
    match /rooms/{roomId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Ranking global
    match /ranking/{userId} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    
    // Ranking escolar
    match /schoolRanking/{schoolId}/players/{userId} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    
    // Progresso do jogador
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Estatísticas globais
    match /stats/global {
      allow read: if true;
      allow write: if false;
    }
    
    // Configurações
    match /config/{doc} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

4. Clique em **"Publicar"**

---

## ✅ PRONTO!

Agora reinicie o servidor:

```bash
# Pare o servidor (Ctrl+C)
# Limpe o cache
rm -rf node_modules/.vite

# Inicie novamente
npm run dev
```

---

## 🧪 TESTAR

1. Acesse `http://localhost:3000`
2. Clique em **"JOGAR"**
3. Digite seu nome
4. Clique em **"JOGAR SOLO"** ou **"MULTIPLAYER ONLINE"**
5. Deve funcionar! ✅

---

## 🐛 SE AINDA DER ERRO

### Limpar Cache Completo

```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules\.vite
npm run dev

# Ou simplesmente
npm run dev -- --force
```

### Verificar Configuração

1. Vá em Firebase Console → **Configurações do Projeto** (ícone de engrenagem)
2. Role até **"Seus apps"**
3. Verifique se o **Web App** está criado
4. Copie as credenciais e compare com `src/firebase/config.js`

---

## 📊 INICIALIZAR BANCO DE DADOS

Depois que tudo funcionar, execute:

```bash
node scripts/initFirebase.js
```

Isso cria:
- ✅ Estatísticas globais
- ✅ Exemplos de ranking
- ✅ Sala demo
- ✅ Configurações

---

## 🎮 ESTRUTURA CRIADA

Após configurar, você terá:

```
Firebase Project: arbogame-6e1b7
├── Authentication
│   ├── ✅ Anonymous (Anônimo)
│   └── ✅ Google
├── Firestore Database
│   ├── rooms/          (Salas multiplayer)
│   ├── ranking/        (Ranking global)
│   ├── schoolRanking/  (Ranking escolar)
│   ├── progress/       (Progresso dos jogadores)
│   ├── stats/          (Estatísticas)
│   └── config/         (Configurações)
└── Hosting (opcional)
```

---

## 🔒 SEGURANÇA

As regras aplicadas garantem:
- ✅ Qualquer um pode ler rankings
- ✅ Apenas usuários autenticados podem escrever
- ✅ Usuários só editam seus próprios dados
- ✅ Configurações são read-only

---

## 💡 DICAS

### Monitorar em Tempo Real

1. Firebase Console → Firestore Database
2. Você verá os dados sendo criados em tempo real
3. Clique em uma coleção para ver documentos

### Ver Usuários Logados

1. Firebase Console → Authentication
2. Aba **"Users"**
3. Verá todos os usuários (anônimos e Google)

### Limpar Dados de Teste

```javascript
// No console do navegador (F12)
// Limpar localStorage
localStorage.clear();

// Recarregar
location.reload();
```

---

## 🎉 CHECKLIST

- [ ] Authentication ativado
- [ ] Login Anônimo ativado
- [ ] Login Google ativado (opcional)
- [ ] Firestore Database criado
- [ ] Regras de segurança aplicadas
- [ ] Cache limpo (`rm -rf node_modules/.vite`)
- [ ] Servidor reiniciado (`npm run dev`)
- [ ] Teste de login funcionando
- [ ] Script de inicialização executado

---

## 📞 AINDA COM PROBLEMAS?

### Erro Persiste?

1. **Feche TODAS as abas do navegador**
2. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
3. **Reinicie o VS Code**
4. **Execute:**
   ```bash
   npm run dev -- --force
   ```

### Verificar Console

Abra o Console do navegador (F12) e procure por:
- ✅ Sem erros vermelhos
- ✅ "Firebase initialized" ou similar
- ✅ Sem erros de CORS

---

**🔥 Após seguir estes passos, tudo deve funcionar perfeitamente!**

**Tempo estimado: 5-10 minutos**
