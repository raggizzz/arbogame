# 🎨 DESIGN SYSTEM AAA - ARBOGAME

Design System profissional de nível internacional para o ArboGame.

---

## 🎯 Filosofia de Design

**"Qualidade AAA com identidade única"**

Inspirado em jogos de agências internacionais como:
- **The Last of Us** - Narrativa e emoção
- **Horizon Zero Dawn** - Cores vibrantes e natureza
- **Ghost of Tsushima** - Minimalismo elegante
- **Spider-Man PS4** - UI moderna e dinâmica

---

## 🎨 Paleta de Cores

### Primary (Verde ArboGame)
```css
primary-50:  #E8FFF0  /* Muito claro */
primary-100: #C2FFD9
primary-200: #8CFFB8
primary-300: #4DFF94
primary-400: #1FFF75
primary-500: #00E65C  /* Cor principal */
primary-600: #00CC52
primary-700: #00A844
primary-800: #008538
primary-900: #006B2E
primary-950: #003D1A  /* Muito escuro */
```

**Uso**: Botões principais, highlights, sucesso, natureza

### Secondary (Azul Vibrante)
```css
secondary-50:  #F0F9FF
secondary-100: #E0F2FE
secondary-200: #B9E6FE
secondary-300: #7CD4FD
secondary-400: #36BFFA
secondary-500: #0BA5E9  /* Cor principal */
secondary-600: #0284C7
secondary-700: #0369A1
secondary-800: #075985
secondary-900: #0C4A6E
secondary-950: #082F49
```

**Uso**: Links, informações, água, céu

### Accent (Amarelo Energia)
```css
accent-50:  #FFFBEB
accent-100: #FEF3C7
accent-200: #FDE68A
accent-300: #FCD34D
accent-400: #FBBF24
accent-500: #F59E0B  /* Cor principal */
accent-600: #D97706
accent-700: #B45309
accent-800: #92400E
accent-900: #78350F
accent-950: #451A03
```

**Uso**: Alertas positivos, energia, sol, vitória

### Danger (Vermelho Alerta)
```css
danger-50:  #FEF2F2
danger-100: #FEE2E2
danger-200: #FECACA
danger-300: #FCA5A5
danger-400: #F87171
danger-500: #EF4444  /* Cor principal */
danger-600: #DC2626
danger-700: #B91C1C
danger-800: #991B1B
danger-900: #7F1D1D
danger-950: #450A0A
```

**Uso**: Erros, perigos, criadouros, mosquito

### Dark (Tons Escuros)
```css
dark-50:  #F8FAFC
dark-100: #F1F5F9
dark-200: #E2E8F0
dark-300: #CBD5E1
dark-400: #94A3B8
dark-500: #64748B
dark-600: #475569
dark-700: #334155
dark-800: #1E293B  /* Background principal */
dark-900: #0F172A  /* Background escuro */
dark-950: #020617  /* Muito escuro */
```

**Uso**: Backgrounds, textos, sombras

### Cores Especiais do Jogo
```css
mosquito:   #2D3748  /* Cinza escuro */
criadouro:  #3B82F6  /* Azul água */
mutirao:    #10B981  /* Verde ação */
quiz:       #8B5CF6  /* Roxo conhecimento */
victory:    #F59E0B  /* Dourado vitória */
```

---

## 🔤 Tipografia

### Fontes

**Display (Títulos e Logos)**
```css
font-display: 'Poppins', 'Inter', sans-serif
```
- Peso: 400, 500, 600, 700, 800, 900
- Uso: Títulos grandes, logos, CTAs

**Game (Interface)**
```css
font-game: 'Inter', system-ui, sans-serif
```
- Peso: 300, 400, 500, 600, 700, 800, 900
- Uso: Textos gerais, botões, labels

**Mono (Código)**
```css
font-mono: 'JetBrains Mono', 'Fira Code', monospace
```
- Peso: 400, 500, 600, 700
- Uso: Estatísticas, números, código

### Escala de Tamanhos
```css
text-xs:   0.75rem  (12px)
text-sm:   0.875rem (14px)
text-base: 1rem     (16px)
text-lg:   1.125rem (18px)
text-xl:   1.25rem  (20px)
text-2xl:  1.5rem   (24px)
text-3xl:  1.875rem (30px)
text-4xl:  2.25rem  (36px)
text-5xl:  3rem     (48px)
text-6xl:  3.75rem  (60px)
text-7xl:  4.5rem   (72px)
text-8xl:  6rem     (96px)
text-9xl:  8rem     (128px)
```

---

## 🎭 Efeitos Visuais

### Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-dark {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Neon Glow
```css
.neon-green {
  text-shadow: 
    0 0 10px rgba(0, 230, 92, 0.8),
    0 0 20px rgba(0, 230, 92, 0.6),
    0 0 30px rgba(0, 230, 92, 0.4);
}

.neon-blue {
  text-shadow: 
    0 0 10px rgba(11, 165, 233, 0.8),
    0 0 20px rgba(11, 165, 233, 0.6),
    0 0 30px rgba(11, 165, 233, 0.4);
}
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, #00E65C 0%, #0BA5E9 50%, #F59E0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Sombras
```css
shadow-glow:          0 0 20px rgba(0, 230, 92, 0.5)
shadow-glow-lg:       0 0 40px rgba(0, 230, 92, 0.6)
shadow-glow-blue:     0 0 20px rgba(11, 165, 233, 0.5)
shadow-glow-yellow:   0 0 20px rgba(245, 158, 11, 0.5)
shadow-neumorphic:    12px 12px 24px rgba(0,0,0,0.2), -12px -12px 24px rgba(255,255,255,0.05)
```

---

## 🎬 Animações

### Keyframes Customizados
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes glow {
  0%, 100% { opacity: 1; filter: brightness(1); }
  50% { opacity: 0.8; filter: brightness(1.2); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

### Classes de Animação
```css
animate-float:      float 3s ease-in-out infinite
animate-glow:       glow 2s ease-in-out infinite
animate-wiggle:     wiggle 1s ease-in-out infinite
animate-shimmer:    shimmer 2s linear infinite
animate-slide-up:   slideUp 0.5s ease-out
animate-fade-in:    fadeIn 0.5s ease-out
animate-scale-in:   scaleIn 0.3s ease-out
```

---

## 🎯 Componentes

### Botões

**Primary**
```jsx
<button className="btn-primary">
  Botão Principal
</button>
```
- Gradiente verde
- Glow effect no hover
- Scale animation

**Secondary**
```jsx
<button className="btn-secondary">
  Botão Secundário
</button>
```
- Gradiente azul
- Glow azul no hover

**Accent**
```jsx
<button className="btn-accent">
  Botão Destaque
</button>
```
- Gradiente amarelo
- Glow amarelo no hover

### Cards

**Glass Card**
```jsx
<div className="card-glass">
  Conteúdo
</div>
```
- Glassmorphism effect
- Glow no hover

**Neumorphic Card**
```jsx
<div className="card-neumorphic">
  Conteúdo
</div>
```
- Sombras neumórficas
- Background escuro

---

## 📐 Espaçamento

### Escala Customizada
```css
spacing-18:  4.5rem  (72px)
spacing-88:  22rem   (352px)
spacing-100: 25rem   (400px)
spacing-112: 28rem   (448px)
spacing-128: 32rem   (512px)
```

### Border Radius
```css
rounded-4xl: 2rem    (32px)
rounded-5xl: 2.5rem  (40px)
rounded-6xl: 3rem    (48px)
```

---

## 🎨 Gradientes

### Mesh Gradient
```css
bg-mesh-gradient: linear-gradient(135deg, #00E65C 0%, #0BA5E9 50%, #F59E0B 100%)
```

### Radial Gradient
```css
bg-gradient-radial: radial-gradient(var(--tw-gradient-stops))
```

### Conic Gradient
```css
bg-gradient-conic: conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))
```

---

## 🎯 Uso Prático

### Menu Principal
```jsx
<div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
  <div className="glass-dark rounded-4xl p-8">
    <h1 className="text-7xl font-display font-black gradient-text">
      ARBOGAME
    </h1>
    <button className="btn-primary">
      JOGAR AGORA
    </button>
  </div>
</div>
```

### Card de Estatística
```jsx
<div className="card-glass">
  <div className="text-5xl font-bold text-primary-500 neon-green">
    1250
  </div>
  <p className="text-white/70">Pontos</p>
</div>
```

### Botão com Glow
```jsx
<motion.button
  className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl px-8 py-4 shadow-glow hover:shadow-glow-lg"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Clique Aqui
</motion.button>
```

---

## 📱 Responsividade

### Breakpoints
```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Mobile First
Sempre desenvolva mobile-first e adicione breakpoints:
```jsx
<div className="text-4xl md:text-6xl lg:text-8xl">
  Título Responsivo
</div>
```

---

## ♿ Acessibilidade

### Contraste
- Texto sobre fundo escuro: mínimo 4.5:1
- Títulos grandes: mínimo 3:1
- Elementos interativos: foco visível

### Foco
```css
button:focus-visible {
  outline: 3px solid #00E65C;
  outline-offset: 2px;
}
```

---

## 🎬 Motion Design

### Princípios
1. **Suave**: Transições de 300-500ms
2. **Natural**: Easing curves realistas
3. **Significativo**: Animações com propósito
4. **Performático**: GPU-accelerated

### Framer Motion
```jsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
>
  Conteúdo
</motion.div>
```

---

## 🎨 Exemplos de Uso

### Hero Section
```jsx
<section className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 relative overflow-hidden">
  <div className="absolute inset-0 bg-mesh-gradient opacity-20" />
  <div className="relative z-10 flex items-center justify-center min-h-screen">
    <h1 className="text-9xl font-display font-black gradient-text neon-green">
      ARBOGAME
    </h1>
  </div>
</section>
```

### Feature Card
```jsx
<div className="card-glass group hover:shadow-glow transition-all duration-300">
  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow mb-4" />
  <h3 className="text-2xl font-display font-bold text-white mb-2">
    Feature Title
  </h3>
  <p className="text-white/70">
    Description here
  </p>
</div>
```

---

## 🚀 Performance

### Otimizações
- ✅ GPU-accelerated animations (transform, opacity)
- ✅ Lazy loading de imagens
- ✅ Code splitting
- ✅ Purge CSS não utilizado
- ✅ Minificação automática

### Lighthouse Score Target
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## 📚 Referências

- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Material Design](https://material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/)
- [PlayStation Design System](https://www.playstation.com/design/)

---

**🎨 Design System criado para qualidade AAA internacional**

*Versão 1.0.0 - ArboGame 2024*
