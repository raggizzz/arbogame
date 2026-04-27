# 🎯 COORDENADAS LINEARES DO LUDO - ARBOGAME

## 📐 SISTEMA DE GRID 15×15

### **Movimento 100% LINEAR (sem curvas)**
Cada casa tem coordenadas fixas (col, row) no grid.
As peças se movem sequencialmente pelo índice do array.

---

## 🛣️ CAMINHO EXTERNO - 52 CASAS (ARRAY LINEAR)

### **Índice → Coordenadas (col, row)**

```javascript
const pathCoordinates = [
  // VERMELHO - Saída (casa 0)
  { col: 2, row: 9, color: 0, isStart: true },
  
  // Braço esquerdo horizontal (1-5)
  { col: 3, row: 9 },
  { col: 4, row: 9 },
  { col: 5, row: 9 },
  { col: 6, row: 9 },
  { col: 7, row: 9 },
  
  // Coluna esquerda subindo (6-11)
  { col: 7, row: 8 },
  { col: 7, row: 7, isSafe: true }, // Casa segura
  { col: 7, row: 6 },
  { col: 7, row: 5 },
  { col: 7, row: 4 },
  { col: 7, row: 3 },
  
  // VERDE - Saída (casa 12)
  { col: 7, row: 2, color: 1, isStart: true },
  
  // Braço superior horizontal (13-17)
  { col: 6, row: 2 },
  { col: 5, row: 2 },
  { col: 4, row: 2 },
  { col: 3, row: 2 },
  { col: 2, row: 2 },
  
  // Coluna esquerda descendo (18-23)
  { col: 2, row: 3 },
  { col: 2, row: 4 },
  { col: 2, row: 5, isSafe: true }, // Casa segura
  { col: 2, row: 6 },
  { col: 2, row: 7 },
  { col: 2, row: 8 },
  
  // AMARELO - Saída (casa 24)
  { col: 2, row: 9, color: 3, isStart: true },
  
  // Braço superior horizontal (25-29)
  { col: 3, row: 9 },
  { col: 4, row: 9 },
  { col: 5, row: 9 },
  { col: 6, row: 9 },
  { col: 7, row: 9 },
  
  // Coluna direita descendo (30-35)
  { col: 9, row: 3 },
  { col: 9, row: 4 },
  { col: 9, row: 5, isSafe: true }, // Casa segura
  { col: 9, row: 6 },
  { col: 9, row: 7 },
  { col: 9, row: 8 },
  
  // AZUL - Saída (casa 36)
  { col: 9, row: 9, color: 2, isStart: true },
  
  // Braço direito horizontal (37-41)
  { col: 10, row: 9 },
  { col: 11, row: 9 },
  { col: 12, row: 9 },
  { col: 13, row: 9 },
  { col: 14, row: 9 },
  
  // Coluna direita subindo (42-47)
  { col: 9, row: 10 },
  { col: 9, row: 11 },
  { col: 9, row: 12, isSafe: true }, // Casa segura
  { col: 9, row: 13 },
  { col: 9, row: 14 },
  { col: 9, row: 15 },
  
  // Fechamento (48-51)
  { col: 8, row: 9 },
  { col: 7, row: 9 },
  { col: 6, row: 9 },
  { col: 5, row: 9 }
];
```

---

## 🏁 CAMINHOS FINAIS - 6 CASAS POR COR

### **🔴 VERMELHO (Horizontal - Esquerda → Centro)**
```javascript
[
  { col: 3, row: 8 }, // Final 0
  { col: 4, row: 8 }, // Final 1
  { col: 5, row: 8 }, // Final 2
  { col: 6, row: 8 }, // Final 3
  { col: 7, row: 8 }, // Final 4
  { col: 8, row: 8 }  // Final 5 → CENTRO
]
```

### **🟢 VERDE (Vertical - Cima → Centro)**
```javascript
[
  { col: 8, row: 3 }, // Final 0
  { col: 8, row: 4 }, // Final 1
  { col: 8, row: 5 }, // Final 2
  { col: 8, row: 6 }, // Final 3
  { col: 8, row: 7 }, // Final 4
  { col: 8, row: 8 }  // Final 5 → CENTRO
]
```

### **🔵 AZUL (Horizontal - Direita → Centro)**
```javascript
[
  { col: 13, row: 8 }, // Final 0
  { col: 12, row: 8 }, // Final 1
  { col: 11, row: 8 }, // Final 2
  { col: 10, row: 8 }, // Final 3
  { col: 9, row: 8 },  // Final 4
  { col: 8, row: 8 }   // Final 5 → CENTRO
]
```

### **🟡 AMARELO (Vertical - Baixo → Centro)**
```javascript
[
  { col: 8, row: 13 }, // Final 0
  { col: 8, row: 12 }, // Final 1
  { col: 8, row: 11 }, // Final 2
  { col: 8, row: 10 }, // Final 3
  { col: 8, row: 9 },  // Final 4
  { col: 8, row: 8 }   // Final 5 → CENTRO
]
```

---

## 🏠 BASES (Grid Areas)

### **🟢 VERDE - Superior Esquerdo:**
```css
gridArea: "1 / 1 / 7 / 7"
```

### **🟡 AMARELO - Superior Direito:**
```css
gridArea: "1 / 10 / 7 / 16"
```

### **🔴 VERMELHO - Inferior Esquerdo:**
```css
gridArea: "10 / 1 / 16 / 7"
```

### **🔵 AZUL - Inferior Direito:**
```css
gridArea: "10 / 10 / 16 / 16"
```

---

## 🎯 CASAS ESPECIAIS

### **Casas de Saída (isStart: true):**
- 🔴 Casa 0: `{ col: 2, row: 9 }`
- 🟢 Casa 12: `{ col: 7, row: 2 }`
- 🟡 Casa 24: `{ col: 2, row: 9 }`
- 🔵 Casa 36: `{ col: 9, row: 9 }`

### **Casas Seguras (isSafe: true):**
- Casa 7: `{ col: 7, row: 7 }`
- Casa 20: `{ col: 2, row: 5 }`
- Casa 32: `{ col: 9, row: 5 }`
- Casa 44: `{ col: 9, row: 12 }`

---

## 🏆 CENTRO - Losango (col 8, row 8)

### **4 Triângulos SVG:**
```svg
<polygon points="16,4 4,16 16,28" fill="VERDE" />
<polygon points="16,4 28,16 16,28" fill="AMARELO" />
<polygon points="4,16 16,28 28,16" fill="VERMELHO" />
<polygon points="4,16 16,4 28,16" fill="AZUL" />
```

---

## 🎮 LÓGICA DE MOVIMENTO LINEAR

### **Função de Movimento:**
```javascript
const movePiece = (piece, steps) => {
  // Movimento no caminho externo (52 casas)
  if (piece.location === 'main') {
    piece.position = (piece.position + steps) % 52;
  }
  
  // Movimento no caminho final (6 casas)
  if (piece.location === 'final') {
    piece.position = Math.min(piece.position + steps, 5);
  }
};
```

### **Obter Coordenadas:**
```javascript
const getCoordinates = (piece) => {
  if (piece.location === 'main') {
    return pathCoordinates[piece.position];
  }
  if (piece.location === 'final') {
    return finalPaths[piece.playerIndex][piece.position];
  }
};
```

---

## 📊 RESUMO TÉCNICO

### **Total de Casas:**
- Caminho externo: **52 casas**
- Caminhos finais: **24 casas** (6 × 4 cores)
- Bases: **16 posições** (4 × 4 cores)
- Centro: **1 casa** (losango)
- **TOTAL: 93 posições**

### **Grid:**
- Tamanho: **15×15** (225 células)
- Casas ocupadas: **93**
- Casas vazias: **132**

### **Movimento:**
- Tipo: **Linear sequencial**
- Direção: **Horizontal ou Vertical**
- Sem curvas: **100% grid-based**

---

**🎯 SISTEMA DE COORDENADAS 100% LINEAR!** 📐✨
