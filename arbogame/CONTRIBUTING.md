# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o **Ludo da Dengue**! 🦟

Este documento fornece diretrizes para contribuir com o projeto.

---

## 📋 Código de Conduta

Ao participar deste projeto, você concorda em manter um ambiente respeitoso e inclusivo para todos.

### Comportamentos Esperados

✅ Seja respeitoso e inclusivo
✅ Aceite críticas construtivas
✅ Foque no que é melhor para a comunidade
✅ Mostre empatia com outros membros

### Comportamentos Inaceitáveis

❌ Linguagem ou imagens ofensivas
❌ Assédio público ou privado
❌ Publicar informações privadas de outros
❌ Conduta não profissional

---

## 🚀 Como Contribuir

### 1. Reportar Bugs

Encontrou um bug? Ajude-nos a corrigi-lo!

**Antes de reportar:**
- Verifique se o bug já foi reportado nas [Issues](https://github.com/seu-usuario/ludo-da-dengue/issues)
- Teste na versão mais recente
- Colete informações sobre o ambiente (navegador, OS, etc.)

**Como reportar:**
1. Abra uma [nova Issue](https://github.com/seu-usuario/ludo-da-dengue/issues/new)
2. Use o template de Bug Report
3. Inclua:
   - Descrição clara do bug
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Ambiente (navegador, OS, versão)

### 2. Sugerir Melhorias

Tem uma ideia para melhorar o jogo?

**Como sugerir:**
1. Abra uma [nova Issue](https://github.com/seu-usuario/ludo-da-dengue/issues/new)
2. Use o template de Feature Request
3. Inclua:
   - Descrição da funcionalidade
   - Motivação (por que é útil?)
   - Exemplos de uso
   - Alternativas consideradas

### 3. Contribuir com Código

Quer implementar uma funcionalidade ou correção?

#### Passo a Passo

**1. Fork o Repositório**

```bash
# Clique em "Fork" no GitHub
```

**2. Clone seu Fork**

```bash
git clone https://github.com/seu-usuario/ludo-da-dengue.git
cd ludo-da-dengue
```

**3. Crie uma Branch**

```bash
# Para nova funcionalidade
git checkout -b feature/nome-da-feature

# Para correção de bug
git checkout -b fix/nome-do-bug

# Para documentação
git checkout -b docs/nome-da-doc
```

**4. Instale Dependências**

```bash
npm install
```

**5. Faça suas Mudanças**

- Siga os padrões de código
- Adicione comentários quando necessário
- Teste suas mudanças

**6. Teste Localmente**

```bash
npm run dev
```

**7. Commit suas Mudanças**

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
```

Use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

**8. Push para seu Fork**

```bash
git push origin feature/nome-da-feature
```

**9. Abra um Pull Request**

1. Vá para o repositório original no GitHub
2. Clique em "New Pull Request"
3. Selecione sua branch
4. Preencha o template de PR
5. Aguarde revisão

---

## 📝 Padrões de Código

### JavaScript/React

```javascript
// ✅ BOM
const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  const handleClick = () => {
    // Lógica aqui
  };
  
  return (
    <div className="container">
      {/* Conteúdo */}
    </div>
  );
};

// ❌ EVITE
function mycomponent(props) {
  var x = props.prop1;
  return <div>{x}</div>
}
```

### Nomenclatura

- **Componentes**: PascalCase (`MyComponent.jsx`)
- **Funções**: camelCase (`handleClick`)
- **Constantes**: UPPER_CASE (`MAX_PLAYERS`)
- **Arquivos**: kebab-case para não-componentes (`ranking-service.js`)

### Estrutura de Componente

```javascript
// 1. Imports
import { useState } from 'react';
import { motion } from 'framer-motion';

// 2. Componente
const MyComponent = ({ prop1, prop2 }) => {
  // 3. Hooks
  const [state, setState] = useState();
  const store = useGameStore();
  
  // 4. Funções
  const handleAction = () => {
    // ...
  };
  
  // 5. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 7. Export
export default MyComponent;
```

### CSS/Tailwind

```javascript
// ✅ BOM - Classes organizadas
<div className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg shadow-md">

// ❌ EVITE - Classes desorganizadas
<div className="p-4 flex bg-white gap-4 shadow-md items-center rounded-lg justify-center">
```

---

## 🧪 Testes

### Checklist de Testes

Antes de submeter um PR, teste:

- [ ] Funcionalidade funciona como esperado
- [ ] Não quebra funcionalidades existentes
- [ ] Responsivo em mobile
- [ ] Sem erros no console
- [ ] Build passa (`npm run build`)
- [ ] Código formatado (`npm run format`)

### Teste Manual

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm run preview
```

---

## 📚 Documentação

### Quando Documentar

- Novas funcionalidades
- Mudanças em APIs
- Configurações complexas
- Decisões de arquitetura

### Onde Documentar

- **README.md** - Visão geral e quick start
- **DESENVOLVIMENTO.md** - Detalhes técnicos
- **Comentários no código** - Lógica complexa
- **JSDoc** - Funções públicas

### Exemplo de JSDoc

```javascript
/**
 * Salva a pontuação do jogador no Firestore
 * @param {string} userId - ID do usuário
 * @param {Object} playerData - Dados do jogador
 * @param {string} playerData.playerName - Nome do jogador
 * @param {number} playerData.score - Pontuação
 * @returns {Promise<boolean>} - True se salvou com sucesso
 */
export const saveScore = async (userId, playerData) => {
  // ...
};
```

---

## 🎨 Design

### Princípios

- **Simplicidade** - Interface clara e intuitiva
- **Consistência** - Padrões visuais consistentes
- **Feedback** - Resposta visual a ações
- **Acessibilidade** - Usável por todos

### Cores

Use as cores do tema definidas em `tailwind.config.js`:

```javascript
'dengue-green': '#7CFC00',
'dengue-blue': '#00BFFF',
'dengue-yellow': '#FFD700',
'dengue-red': '#FF4444',
'dengue-purple': '#9B59B6'
```

### Animações

Use Framer Motion para animações:

```javascript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
/>
```

---

## 🔍 Revisão de Código

### O que Revisamos

- ✅ Funcionalidade correta
- ✅ Código limpo e legível
- ✅ Sem bugs óbvios
- ✅ Performance adequada
- ✅ Documentação atualizada
- ✅ Testes passando

### Tempo de Resposta

- Revisões iniciais: 1-3 dias
- Feedback adicional: 1-2 dias
- Aprovação final: 1 dia

---

## 🏆 Reconhecimento

Contribuidores são reconhecidos:

- 📝 Listados no README.md
- 🎖️ Badge de contribuidor
- 💬 Menção em releases
- ⭐ Agradecimento especial

---

## 📞 Contato

Dúvidas sobre contribuição?

- 💬 [GitHub Discussions](https://github.com/seu-usuario/ludo-da-dengue/discussions)
- 🐛 [GitHub Issues](https://github.com/seu-usuario/ludo-da-dengue/issues)
- 📧 Email: contribuicoes@ludodadengue.com

---

## 📖 Recursos Úteis

- [React Docs](https://react.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**🙏 Obrigado por contribuir! Juntos fazemos a diferença na educação sobre dengue!**
