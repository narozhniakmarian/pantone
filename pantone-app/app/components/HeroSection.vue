<template>
  <section class="hero" role="main">
    <div class="hero__light" aria-hidden="true" />
    <div class="hero__orbit" aria-hidden="true">
      <span class="orbit-shape orbit-shape--tile orbit-shape--one" />
      <span class="orbit-shape orbit-shape--bubble orbit-shape--dark orbit-shape--two" />
      <span class="orbit-shape orbit-shape--tile orbit-shape--three" />
      <span class="orbit-shape orbit-shape--bubble orbit-shape--four" />
      <span class="orbit-shape orbit-shape--tile orbit-shape--dark orbit-shape--five" />
      <span class="orbit-shape orbit-shape--bubble orbit-shape--six" />
      <span class="orbit-shape orbit-shape--tile orbit-shape--seven" />
      <span class="orbit-shape orbit-shape--bubble orbit-shape--eight" />
      <span class="orbit-shape orbit-shape--bubble orbit-shape--nine" />
      <span class="orbit-shape orbit-shape--tile orbit-shape--ten" />
      <span class="orbit-shape orbit-shape--bubble orbit-shape--dark orbit-shape--eleven" />
      <span class="orbit-shape orbit-shape--tile orbit-shape--dark orbit-shape--twelve" />
      <span class="orbit-shape orbit-shape--bubble orbit-shape--thirteen" />
      <span class="orbit-shape orbit-shape--tile orbit-shape--fourteen" />
      <span class="orbit-shape orbit-shape--bubble orbit-shape--fifteen" />
      <span class="orbit-shape orbit-shape--tile orbit-shape--sixteen" />
      <span class="orbit-shape orbit-shape--bubble orbit-shape--seventeen" />
      <span class="orbit-shape orbit-shape--tile orbit-shape--dark orbit-shape--eighteen" />
      <span class="orbit-shape orbit-shape--bubble orbit-shape--dark orbit-shape--nineteen" />
      <span class="orbit-shape orbit-shape--tile orbit-shape--twenty" />
      <span class="orbit-shape orbit-shape--bubble orbit-shape--twenty-one" />
      <span class="orbit-shape orbit-shape--tile orbit-shape--twenty-two" />
      <span class="orbit-shape orbit-shape--bubble orbit-shape--dark orbit-shape--twenty-three" />
      <span class="orbit-shape orbit-shape--tile orbit-shape--dark orbit-shape--twenty-four" />
    </div>
    <header class="hero__top-bar">
      <div class="hero__logo-wrapper" aria-label="Drukarnia Opolgraf S.A.">
        <img src="/logo.svg" alt="Opolgraf S.A." class="hero__logo-img" />
      </div>
      <ThemeToggle />
    </header>

    <div class="hero__content">
      <div class="hero__header">
        <h1 class="hero__title">PANTONE</h1>
        <p class="hero__subtitle">System zarządzania wzornikami Pantone</p>
      </div>

      <nav class="hero__nav" aria-label="Główne funkcje systemu">
        <button class="hero__btn" type="button" @click="handleOpenSearch">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span>Wyszukiwarka Pantonu</span>
        </button>

        <button class="hero__btn" type="button" @click="handleOpenPlace">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
          <span>Umiejscowienie Pantonu</span>
        </button>

        <button class="hero__btn" type="button" @click="handleOpenInventory">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M3 15h18" />
            <path d="M9 3v18" />
            <path d="M15 3v18" />
          </svg>
          <span>Wykaz Pantonów</span>
        </button>
      </nav>
    </div>
  </section>
</template>

<script setup>
import ThemeToggle from '~/components/ThemeToggle.vue'

const emit = defineEmits([
  'openSearch',
  'openPlace',
  'openInventory',
  'open-search',
  'open-place',
  'open-inventory',
])

const handleOpenSearch = () => {
  emit('openSearch')
  emit('open-search')
}

const handleOpenPlace = () => {
  emit('openPlace')
  emit('open-place')
}

const handleOpenInventory = () => {
  emit('openInventory')
  emit('open-inventory')
}
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

@keyframes hero-light-orbit {
  0%, 100% { opacity: 0.2; transform: translate3d(0, 0, 0) scale(0.96); }
  50% { opacity: 0.52; transform: translate3d(-2%, 1%, 0) scale(1.06); }
}

@keyframes swatch-orbit {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.hero::before {
  content: '';
  position: absolute;
  inset: -5%;
  background: url('/hero-bg.png') center / cover no-repeat;
  z-index: 0;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to right,
    rgba(10, 5, 8, 0.78) 0%,
    rgba(15, 8, 12, 0.55) 50%,
    rgba(20, 10, 15, 0.15) 100%
  );
  z-index: 1;
}

.hero__light {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(ellipse at 72% 48%, rgba(255, 91, 133, 0.2), transparent 42%);
  mix-blend-mode: screen;
  animation: hero-light-orbit 12s ease-in-out infinite;
}

.hero__orbit {
  position: absolute;
  z-index: 2;
  left: calc(69% + 7mm);
  top: 49%;
  width: min(90vw, 130vh);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: swatch-orbit 130s linear infinite;
}

.orbit-shape {
  position: absolute;
  display: block;
  left: 50%;
  top: 50%;
  box-shadow: 0 0 18px rgba(255, 89, 127, 0.25);
}

.orbit-shape--tile {
  width: clamp(14px, 1.5vw, 22px);
  aspect-ratio: 1;
  border: 2px solid rgba(255, 231, 235, 0.9);
  background: linear-gradient(145deg, #ff8ba1, #b7123b);
  transform: translate(-50%, -50%);
}

.orbit-shape--bubble {
  width: clamp(8px, 0.9vw, 13px);
  aspect-ratio: 1;
  border: 1px solid rgba(255, 221, 228, 0.75);
  border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, #fff4f6 0 8%, #ff536f 25%, #8c0928 78%);
  box-shadow: inset -2px -2px 4px rgba(60, 0, 20, 0.45), 0 0 12px rgba(255, 44, 83, 0.6);
  transform: translate(-50%, -50%);
}

.orbit-shape--dark.orbit-shape--tile {
  border-color: rgba(255, 205, 217, 0.95);
  background: linear-gradient(145deg, #74152f, #260714 78%);
  box-shadow: inset -3px -3px 6px rgba(12, 0, 5, 0.5), 0 0 14px rgba(255, 72, 111, 0.32);
}

.orbit-shape--dark.orbit-shape--bubble {
  border-color: rgba(255, 187, 204, 0.9);
  background: radial-gradient(circle at 30% 26%, #ffd8e0 0 7%, #9d1739 23%, #3a0617 72%);
  box-shadow: inset -3px -3px 5px rgba(12, 0, 5, 0.75), 0 0 13px rgba(255, 58, 97, 0.42);
}

.orbit-shape--one { left: 50%; top: 0%; }
.orbit-shape--two { left: 69%; top: 4%; }
.orbit-shape--three { left: 85%; top: 15%; }
.orbit-shape--four { left: 96%; top: 31%; }
.orbit-shape--five { left: 100%; top: 50%; }
.orbit-shape--six { left: 96%; top: 69%; }
.orbit-shape--seven { left: 85%; top: 85%; }
.orbit-shape--eight { left: 69%; top: 96%; }
.orbit-shape--nine { left: 50%; top: 100%; }
.orbit-shape--ten { left: 31%; top: 96%; }
.orbit-shape--eleven { left: 15%; top: 85%; }
.orbit-shape--twelve { left: 4%; top: 69%; }
.orbit-shape--thirteen { left: 0%; top: 50%; }
.orbit-shape--fourteen { left: 4%; top: 31%; }
.orbit-shape--fifteen { left: 15%; top: 15%; }
.orbit-shape--sixteen { left: 31%; top: 4%; }
.orbit-shape--seventeen { left: 60%; top: 1%; }
.orbit-shape--eighteen { left: 92%; top: 8%; }
.orbit-shape--nineteen { left: 99%; top: 40%; }
.orbit-shape--twenty { left: 92%; top: 92%; }
.orbit-shape--twenty-one { left: 60%; top: 99%; }
.orbit-shape--twenty-two { left: 8%; top: 92%; }
.orbit-shape--twenty-three { left: 1%; top: 60%; }
.orbit-shape--twenty-four { left: 8%; top: 8%; }

@media (prefers-reduced-motion: reduce) {
  .hero__orbit,
  .hero__light {
    animation: none;
  }
}

.hero__top-bar {
  position: absolute;
  top: 1.5rem;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: clamp(1.5rem, 8vw, 6rem);
  padding-right: clamp(1.5rem, 8vw, 6rem);
  z-index: 10;
}

.hero__logo-wrapper {
  display: inline-flex;
  align-items: center;
  background: #ffffff;
  height: 38px;
  padding: 0 0.875rem;
  border-radius: var(--radius);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.hero__logo-img {
  height: 22px;
  width: auto;
  display: block;
}

.hero__content {
  position: relative;
  z-index: 2;
  max-width: 440px;
  width: 100%;
  margin-left: clamp(1.5rem, 8vw, 6rem);
  padding: 2.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero__header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.hero__title {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;      
  font-size: clamp(2.75rem, 6vw, 4.25rem);
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.04em;
  line-height: 1;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.4);
}

.hero__subtitle {
  font-size: 0.95rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.hero__nav {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: 0.25rem;
}

.hero__btn {
  width: 100%;
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--radius);
  backdrop-filter: blur(10px);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.15s ease;
  letter-spacing: 0.01em;
}

.hero__btn svg {
  stroke: rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.hero__btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.45);
  transform: translateX(3px);
}

.hero__btn:hover svg {
  transform: scale(1.1);
}

.hero__btn:active {
  transform: translateX(1px);
}

@media (max-width: 600px) {
  .hero__top-bar {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }
  .hero__content {
    margin-left: 1.25rem;
    margin-right: 1.25rem;
    max-width: none;
  }
}
</style>
