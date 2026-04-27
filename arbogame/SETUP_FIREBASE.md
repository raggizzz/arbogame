# 🔥 Guia Completo de Configuração do Firebase

Este guia detalha **passo a passo** como configurar o Firebase para o Ludo da Dengue.

---

## 📋 Pré-requisitos

- Conta Google
- Node.js instalado
- Projeto clonado localmente

---

## 🚀 Passo 1: Criar Projeto no Firebase

### 1.1 Acesse o Firebase Console

Vá para: [https://console.firebase.google.com/](https://console.firebase.google.com/)

### 1.2 Criar Novo Projeto

1. Clique em **"Adicionar projeto"**
2. Nome do projeto: `ludo-da-dengue` (ou outro nome)
3. Clique em **"Continuar"**
4. **Google Analytics**: Opcional (pode desativar para começar mais rápido)
5. Clique em **"Criar projeto"**
6. Aguarde a criação (30-60 segundos)
7. Clique em **"Continuar"**

---

## 🔐 Passo 2: Configurar Authentication

### 2.1 Ativar Authentication

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Começar"**

### 2.2 Ativar Login Anônimo

1. Vá na aba **"Sign-in method"**
2. Clique em **"Anônimo"**
3. Ative o toggle
4. Clique em **"Salvar"**

### 2.3 Ativar Login com Google

1. Na mesma aba, clique em **"Google"**
2. Ative o toggle
3. Selecione um email de suporte (seu email)
4. Clique em **"Salvar"**

✅ **Authentication configurado!**

---

## 📊 Passo 3: Configurar Firestore Database

### 3.1 Criar Banco de Dados

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**

### 3.2 Escolher Modo

- Selecione: **"Iniciar no modo de produção"**
- Clique em **"Avançar"**

### 3.3 Escolher Localização

- Recomendado para Brasil: **`southamerica-east1` (São Paulo)**
- Clique em **"Ativar"**
- Aguarde a criação (1-2 minutos)

### 3.4 Configurar Regras de Segurança

1. Vá na aba **"Regras"**
2. **Apague** todo o conteúdo
3. **Cole** o conteúdo do arquivo `firestore.rules` do projeto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Ranking global - leitura pública, escrita autenticada
    match /ranking/{userId} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    
    // Ranking por escola - leitura pública, escrita autenticada
    match /schoolRanking/{schoolId}/players/{userId} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    
    // Progresso do jogador - apenas o próprio usuário
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Estatísticas globais - leitura pública
    match /stats/global {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

4. Clique em **"Publicar"**

### 3.5 Criar Índices

1. Vá na aba **"Índices"**
2. Clique em **"Adicionar índice"**

**Índice 1 - Ranking Global:**
- Coleção: `ranking`
- Campos:
  - `score` - Decrescente
  - `timestamp` - Decrescente
- Clique em **"Criar"**

**Índice 2 - Ranking Escolar:**
- Coleção: `schoolRanking`
- Campos:
  - `schoolId` - Crescente
  - `score` - Decrescente
- Clique em **"Criar"**

Aguarde a criação dos índices (5-10 minutos)

✅ **Firestore configurado!**

---

## 🔑 Passo 4: Obter Credenciais

### 4.1 Registrar App Web

1. Na página inicial do projeto, clique no ícone **`</>`** (Web)
2. Apelido do app: `Ludo da Dengue Web`
3. **NÃO** marque "Firebase Hosting" (faremos depois)
4. Clique em **"Registrar app"**

### 4.2 Copiar Configuração

Você verá um código JavaScript assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### 4.3 Criar Arquivo .env

1. No projeto, copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

2. Edite `.env` e preencha com os valores:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. **IMPORTANTE**: Adicione `.env` ao `.gitignore` (já está por padrão)

✅ **Credenciais configuradas!**

---

## 🌐 Passo 5: Configurar Firebase Hosting (Deploy)

### 5.1 Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 5.2 Fazer Login

```bash
firebase login
```

Siga as instruções no navegador para autorizar.

### 5.3 Inicializar Firebase no Projeto

```bash
firebase init
```

**Selecione:**
- ✅ Firestore
- ✅ Hosting

**Configurações:**

1. **Firestore:**
   - Rules file: `firestore.rules` (já existe)
   - Indexes file: `firestore.indexes.json` (já existe)

2. **Hosting:**
   - Public directory: `dist` (não `public`!)
   - Single-page app: **Yes**
   - GitHub deploys: **No** (por enquanto)

### 5.4 Build e Deploy

```bash
# Build do projeto
npm run build

# Deploy
firebase deploy
```

Aguarde o deploy (1-2 minutos).

Você verá:

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/seu-projeto/overview
Hosting URL: https://seu-projeto.web.app
```

✅ **Jogo online!**

---

## 🧪 Passo 6: Testar

### 6.1 Teste Local

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### 6.2 Teste de Autenticação

1. Clique em **"Jogar"**
2. Digite um nome
3. Clique em **"Jogar Agora"** (login anônimo)
4. Verifique no Firebase Console > Authentication se o usuário apareceu

### 6.3 Teste de Firestore

1. Jogue uma partida
2. Responda algumas perguntas
3. Finalize o jogo
4. Vá em Firebase Console > Firestore Database
5. Verifique se a coleção `ranking` foi criada com seus dados

### 6.4 Teste de Ranking

1. No jogo, vá em **"Ranking"**
2. Verifique se sua pontuação aparece

✅ **Tudo funcionando!**

---

## 🔒 Segurança

### Domínios Autorizados

1. Firebase Console > Authentication > Settings
2. Vá em **"Authorized domains"**
3. Adicione seu domínio customizado (se tiver)

### Limites de Uso

Firebase Free Tier inclui:
- ✅ 50,000 leituras/dia no Firestore
- ✅ 20,000 escritas/dia no Firestore
- ✅ 10GB de hosting/mês
- ✅ Autenticação ilimitada

Para jogos escolares, isso é **mais que suficiente**!

---

## 📊 Monitoramento

### Ver Estatísticas

1. Firebase Console > Analytics (se ativado)
2. Firebase Console > Firestore > Uso
3. Firebase Console > Authentication > Usuários

### Logs

```bash
# Ver logs do Firestore
firebase firestore:logs

# Ver logs do Hosting
firebase hosting:logs
```

---

## 🆘 Problemas Comuns

### Erro: "Permission denied"

**Causa:** Regras do Firestore não aplicadas

**Solução:**
1. Vá em Firestore > Regras
2. Verifique se as regras estão corretas
3. Clique em "Publicar"

### Erro: "Firebase not initialized"

**Causa:** Arquivo `.env` não configurado

**Solução:**
1. Verifique se `.env` existe
2. Verifique se todas as variáveis estão preenchidas
3. Reinicie o servidor (`npm run dev`)

### Erro: "Index not found"

**Causa:** Índices do Firestore não criados

**Solução:**
1. Firestore > Índices
2. Aguarde a criação dos índices (pode levar 10 minutos)
3. Ou clique no link de erro que o Firebase mostra no console

### Deploy falha

**Causa:** Build não foi executado

**Solução:**
```bash
npm run build
firebase deploy
```

---

## 🎓 Recursos Adicionais

- [Documentação Firebase](https://firebase.google.com/docs)
- [Firestore Quickstart](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

## ✅ Checklist Final

- [ ] Projeto Firebase criado
- [ ] Authentication ativado (Anônimo + Google)
- [ ] Firestore Database criado
- [ ] Regras de segurança aplicadas
- [ ] Índices criados
- [ ] Credenciais no arquivo `.env`
- [ ] Firebase CLI instalado
- [ ] Projeto inicializado com `firebase init`
- [ ] Build executado com sucesso
- [ ] Deploy realizado
- [ ] Jogo testado localmente
- [ ] Jogo testado online
- [ ] Ranking funcionando

---

**🎉 Parabéns! Seu Firebase está configurado e o jogo está online!**

Em caso de dúvidas, consulte a [documentação oficial do Firebase](https://firebase.google.com/docs).
