<template>
  <div class="y-toast-container">
    <transition-group name="toast" tag="div" class="y-toast-list">
      <div v-for="toast in toasts" :key="toast.id" :class="['y-toast', `y-toast--${toast.type}`]" @mouseenter="pause(toast.id)" @mouseleave="resume(toast.id)">
        <div class="y-toast__icon">
          <component :is="iconMap[toast.type]" />
        </div>
        <div class="y-toast__content">{{ toast.message }}</div>
        <button class="y-toast__close" @click="remove(toast.id)">
          <Close />
        </button>
        <div class="y-toast__progress" :style="{ width: toast.progress + '%' }" />
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { CheckCircle, AlertCircle, AlertTriangle, Info, Close } from 'lucide-vue-next'
import { Close, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'

const props = defineProps({
  toasts: { type: Array, required: true },
  remove: { type: Function, required: true }
})

const iconMap = { success: CheckCircle, error: AlertCircle, warning: AlertTriangle, info: Info }

const timers = new Map()

const pause = (id) => {
  const toast = props.toasts.find(t => t.id === id)
  if (toast && toast.timer) clearTimeout(toast.timer)
}

const resume = (id) => {
  const toast = props.toasts.find(t => t.id === id)
  if (toast && toast.duration > 0) {
    toast.timer = setTimeout(() => props.remove(toast.id), 100)
  }
}

const startTimer = (toast) => {
  if (toast.duration > 0) {
    toast.timer = setTimeout(() => props.remove(toast.id), toast.duration)
  }
}

onMounted(() => {
  props.toasts.forEach(t => startTimer(t))
})

onUnmounted(() => {
  props.toasts.forEach(t => t.timer && clearTimeout(t.timer))
})
</template>

<style scoped>
.y-toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  pointer-events: none;
}

.y-toast-list { display: flex; flex-direction: column; gap: 8px; }

.y-toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  min-width: 300px;
  max-width: 420px;
  background: var(--yacd-card);
  border: 1px solid var(--yacd-border);
  border-radius: var(--yacd-radius);
  box-shadow: var(--yacd-shadow-hover);
  pointer-events: auto;
  animation: slideIn 0.3s ease-out;
}

.y-toast--success { border-left: 4px solid var(--yacd-success); }
.y-toast--error { border-left: 4px solid var(--yacd-danger); }
.y-toast--warning { border-left: 4px solid var(--yacd-warning); }
.y-toast--info { border-left: 4px solid var(--yacd-info); }

.y-toast__icon {
  width: 20px; height: 20px; flex-shrink: 0; margin-top: 2px;
}
.y-toast--success .y-toast__icon { color: var(--yacd-success); }
.y-toast--error .y-toast__icon { color: var(--yacd-danger); }
.y-toast--warning .y-toast__icon { color: var(--yacd-warning); }
.y-toast--info .y-toast__icon { color: var(--yacd-info); }

.y-toast__content { flex: 1; font-size: 14px; line-height: 1.5; color: var(--yacd-text); word-break: break-word; }

.y-toast__close {
  width: 24px; height: 24px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border: none; background: transparent; color: var(--yacd-text-placeholder);
  border-radius: var(--yacd-radius-sm); cursor: pointer;
  transition: var(--yacd-transition-fast);
}
.y-toast__close:hover { background: var(--yacd-bg); color: var(--yacd-text); }

.y-toast__progress {
  position: absolute; bottom: 0; left: 0; height: 3px;
  background: currentColor; border-radius: 0 0 var(--yacd-radius) var(--yacd-radius);
  opacity: 0.3; transition: width linear;
}

@keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

.y-toast-list-move { transition: transform 0.3s ease; }
.y-toast-leave-active { position: absolute; width: 100%; }
</style>