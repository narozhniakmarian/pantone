<template>
  <ClientOnly>
    <Teleport to="body">
      <div class="toast-container" aria-live="polite" aria-atomic="true">
        <TransitionGroup name="toast">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            class="toast-item"
            :class="`toast-${toast.type}`"
            role="alert"
          >
            <span class="toast-icon">
              <svg
                v-if="toast.type === 'success'"
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>

              <!-- X  -->
              <svg
                v-else-if="toast.type === 'error'"
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>

              <svg
                v-else-if="toast.type === 'warning'"
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>

              <!-- Info -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </span>

            <span class="toast-message">{{ toast.message }}</span>

            <button
              class="toast-close"
              type="button"
              aria-label="Zamknij"
              @click="removeToast(toast.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import { useToast } from '~/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 90%;
  max-width: 360px;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  line-height: 1.4;
}

.toast-close {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  padding: 0.2rem;
  transition: opacity 0.15s ease;
}

.toast-close:hover {
  opacity: 1;
}

.toast-success {
  background: rgba(15, 23, 42, 0.94);
  color: #f8fafc;
  border-color: rgba(34, 197, 94, 0.4);
}
.toast-success .toast-icon {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.toast-error {
  background: rgba(15, 23, 42, 0.94);
  color: #f8fafc;
  border-color: rgba(239, 68, 68, 0.4);
}
.toast-error .toast-icon {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.toast-warning {
  background: rgba(15, 23, 42, 0.94);
  color: #f8fafc;
  border-color: rgba(245, 158, 11, 0.4);
}
.toast-warning .toast-icon {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.toast-info {
  background: rgba(15, 23, 42, 0.94);
  color: #f8fafc;
  border-color: rgba(59, 130, 246, 0.4);
}
.toast-info .toast-icon {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(25px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.95);
}
</style>
