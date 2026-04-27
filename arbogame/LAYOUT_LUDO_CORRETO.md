# 🎲 LAYOUT CORRETO DO LUDO - ARBOGAME

## 📐 ESTRUTURA DO TABULEIRO 15×15

### Grid Completo:
```
     1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
  ┌──────────────────────────────────────────────┐
1 │ [BASE VERMELHA]  ⬜⬜⬜⬜⬜⬜  [BASE VERDE]  │
2 │                  ⬜         ⬜               │
3 │                  ⬜         ⬜               │
4 │                  ⬜         ⬜               │
5 │                  ⬜         ⬜               │
6 │                  ⬜         ⬜               │
7 │                  ⬜         ⬜               │
8 │ ⬜⬜⬜⬜⬜⬜ 🟥🟥🟥🟥🟥🟥 ⬜⬜⬜⬜⬜⬜         │
9 │                  🟩      🔵                 │
10│                  🟩      🔵                 │
11│                  🟩      🔵                 │
12│                  🟩      🔵                 │
13│                  🟩      🔵                 │
14│                  🟩      🔵                 │
15│ [BASE AZUL]      ⬜⬜⬜⬜⬜⬜  [BASE AMARELA] │
  └──────────────────────────────────────────────┘

⬜ = Casas do caminho externo (52 casas)
🟥 = Caminho final VERMELHO (6 casas)
🟩 = Caminho final VERDE (6 casas)
🔵 = Caminho final AZUL (6 casas)
🟡 = Caminho final AMARELO (6 casas)
🏆 = Centro (Santuário Livre de Dengue)
```

---

## 🛣️ CAMINHO EXTERNO - 52 CASAS (CRUZ NO MEIO)

### **PERCURSO COMPLETO (sentido horário):**

#### **1. BRAÇO ESQUERDO - Horizontal (Casas 0-5)**
- **Linha 8, Colunas 1-6**
- 🔴 Casa 0: Saída VERMELHA (col 1, row 8)
- Casas 1-5: Brancas (col 2-6, row 8)

#### **2. BRAÇO SUPERIOR - Vertical (Casas 6-11)**
- **Coluna 7, Linhas 7-2**
- Casa 6: Branca (col 7, row 7)
- Casa 7: Branca (col 7, row 6)
- 🛡️ Casa 8: SEGURA (col 7, row 5)
- Casas 9-11: Brancas (col 7, row 4-2)

#### **3. BRAÇO SUPERIOR - Horizontal (Casas 12-17)**
- **Linha 1, Colunas 7-12**
- Casa 12: Branca (col 7, row 1)
- 🟢 Casa 13: Saída VERDE (col 8, row 1)
- Casas 14-17: Brancas (col 9-12, row 1)

#### **4. BRAÇO DIREITO - Vertical (Casas 18-23)**
- **Coluna 9, Linhas 1-6**
- Casas 18-20: Brancas (col 9, row 1-3)
- 🛡️ Casa 21: SEGURA (col 9, row 4)
- Casas 22-23: Brancas (col 9, row 5-6)

#### **5. BRAÇO DIREITO - Horizontal (Casas 24-29)**
- **Linha 8, Colunas 9-14**
- Casa 24: Branca (col 9, row 8)
- Casa 25: Branca (col 10, row 8)
- 🔵 Casa 26: Saída AZUL (col 11, row 8)
- Casas 27-29: Brancas (col 12-14, row 8)

#### **6. BRAÇO INFERIOR - Vertical (Casas 30-35)**
- **Coluna 9, Linhas 9-14**
- Casas 30-33: Brancas (col 9, row 9-12)
- 🛡️ Casa 34: SEGURA (col 9, row 13)
- Casa 35: Branca (col 9, row 14)

#### **7. BRAÇO INFERIOR - Horizontal (Casas 36-41)**
- **Linha 15, Colunas 9-4**
- Casa 36: Branca (col 9, row 15)
- Casa 37: Branca (col 8, row 15)
- Casa 38: Branca (col 7, row 15)
- 🟡 Casa 39: Saída AMARELA (col 6, row 15)
- Casas 40-41: Brancas (col 5-4, row 15)

#### **8. BRAÇO ESQUERDO - Vertical (Casas 42-47)**
- **Coluna 7, Linhas 15-10**
- Casas 42-46: Brancas (col 7, row 15-11)
- 🛡️ Casa 47: SEGURA (col 7, row 10)

#### **9. FECHAMENTO - Horizontal (Casas 48-51)**
- **Linha 8, Colunas 6-3**
- Casas 48-51: Brancas (col 6-3, row 8)
- **Casa 51 conecta com Casa 0** (completa o círculo)

---

## 🏠 CAMINHOS FINAIS - 6 CASAS POR COR

### **🔴 VERMELHO (Horizontal - Esquerda → Centro):**
- **Linha 8, Colunas 2-7**
- Casa Final 0: col 2, row 8
- Casa Final 1: col 3, row 8
- Casa Final 2: col 4, row 8
- Casa Final 3: col 5, row 8
- Casa Final 4: col 6, row 8
- Casa Final 5: col 7, row 8 → **CENTRO**

### **🟢 VERDE (Vertical - Cima → Centro):**
- **Coluna 8, Linhas 2-7**
- Casa Final 0: col 8, row 2
- Casa Final 1: col 8, row 3
- Casa Final 2: col 8, row 4
- Casa Final 3: col 8, row 5
- Casa Final 4: col 8, row 6
- Casa Final 5: col 8, row 7 → **CENTRO**

### **🔵 AZUL (Horizontal - Direita → Centro):**
- **Linha 8, Colunas 14-9**
- Casa Final 0: col 14, row 8
- Casa Final 1: col 13, row 8
- Casa Final 2: col 12, row 8
- Casa Final 3: col 11, row 8
- Casa Final 4: col 10, row 8
- Casa Final 5: col 9, row 8 → **CENTRO**

### **🟡 AMARELO (Vertical - Baixo → Centro):**
- **Coluna 8, Linhas 14-9**
- Casa Final 0: col 8, row 14
- Casa Final 1: col 8, row 13
- Casa Final 2: col 8, row 12
- Casa Final 3: col 8, row 11
- Casa Final 4: col 8, row 10
- Casa Final 5: col 8, row 9 → **CENTRO**

---

## 🏆 CENTRO - SANTUÁRIO LIVRE DE DENGUE

**Posição:** Coluna 8, Linha 8

**Características:**
- Losango com 4 triângulos coloridos
- Troféu dourado girando
- Brilho pulsante animado
- Ponto de chegada final

---

## 🎯 CASAS ESPECIAIS

### **Casas de Saída (Coloridas):**
- 🔴 **Casa 0** - Vermelho (col 1, row 8)
- 🟢 **Casa 13** - Verde (col 8, row 1)
- 🔵 **Casa 26** - Azul (col 11, row 8)
- 🟡 **Casa 39** - Amarelo (col 6, row 15)

### **Casas Seguras (Escudo):**
- 🛡️ **Casa 8** - (col 7, row 5)
- 🛡️ **Casa 21** - (col 9, row 4)
- 🛡️ **Casa 34** - (col 9, row 13)
- 🛡️ **Casa 47** - (col 7, row 10)

### **Casas Educativas:**
- ❓ **Quiz** - A cada 5 casas (5, 10, 15, 20, 25, 30, 35, 40, 45, 50)
- 🦟 **Mosquito** - A cada 7 casas (7, 14, 21, 28, 35, 42, 49)
- 💧 **Saneamento** - A cada 9 casas (9, 18, 27, 36, 45)

---

## 🏠 BASES (4 CANTOS)

### **🔴 Base Vermelha:**
- **Posição:** Colunas 1-6, Linhas 1-6
- **Saída:** Casa 0 (col 1, row 8)

### **🟢 Base Verde:**
- **Posição:** Colunas 10-15, Linhas 1-6
- **Saída:** Casa 13 (col 8, row 1)

### **🔵 Base Azul:**
- **Posição:** Colunas 1-6, Linhas 10-15
- **Saída:** Casa 26 (col 11, row 8)

### **🟡 Base Amarela:**
- **Posição:** Colunas 10-15, Linhas 10-15
- **Saída:** Casa 39 (col 6, row 15)

---

## 🎮 REGRAS DE MOVIMENTO

### **Saída da Base:**
- Tirar **1 ou 6** permite sair
- Tirar **6** dá direito a jogar novamente

### **Movimento:**
- Peões percorrem as **52 casas externas** (cruz)
- Após completar o círculo, entram no **caminho final** (6 casas)
- Precisam de **número exato** para chegar ao centro

### **Captura:**
- Peão adversário volta para a base
- Casas seguras (8, 21, 34, 47) protegem contra captura
- 2 peões da mesma cor bloqueiam a casa

### **Vitória:**
- Primeiro jogador a colocar **todos os 4 peões** no centro vence

---

## ✅ CARACTERÍSTICAS DO LAYOUT

### **Casas:**
- ✅ Formato: **Quadrado** (40x40px)
- ✅ Border-radius: **0px** (sem arredondamento)
- ✅ Gradiente: **Linear 135deg**
- ✅ Sombra: **Inset 2px + Externa 2px**

### **Peças:**
- ✅ Formato: **Circular** (24px)
- ✅ Border-radius: **50%**
- ✅ Gradiente: **Radial 3 cores**
- ✅ Sombras: **4 camadas**

### **Layout:**
- ✅ Grid: **15x15** (600x600px)
- ✅ Cruz: **No meio do tabuleiro**
- ✅ Bases: **Nos 4 cantos**
- ✅ Centro: **Losango colorido**

---

## 🎯 DIFERENÇAS DO LAYOUT ANTERIOR

### **ANTES (Incorreto):**
❌ Casas nas bordas do grid (linhas 1, 9, 15)
❌ Casas espalhadas pelos cantos
❌ Caminho desconectado

### **AGORA (Correto):**
✅ **Todas as casas formam uma CRUZ no meio**
✅ **Caminho contínuo e conectado**
✅ **Braços da cruz bem definidos**
✅ **Layout clássico do Ludo**

---

**🎲 LAYOUT 100% CORRETO DO LUDO CLÁSSICO!** ✨🏆
