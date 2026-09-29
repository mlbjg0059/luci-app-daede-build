<template>
  <button
    class="y-btn"
    :class="[
      'y-btn',
      `y-btn--${type}`,
      `y-btn--${size}`,
      { 'y-btn--disabled': disabled || loading },
      { 'y-btn--icon-only': iconOnly },
      { 'y-btn--loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
    :style="style"
  >
    <span v-if="loading" class="y-btn__loading"><RefreshCw class="animate-spin" /></span>
    <slot name="icon"><component v-if="icon" :is="icon" /></slot>
    <span class="y-btn__text" v-if="!iconOnly"><slot>{{ label }}</slot></span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { RefreshCw } from 'lucide-vue-next'

defineProps({
  label: String,
  type: { type: String, default: 'primary', validator: v => ['primary', 'success', 'warning', 'danger', 'info', 'default'].includes(v) },
  size: { type: String, default: 'default', validator: v => ['small', 'default', 'large'].includes(v) },
  disabled: Boolean,
  loading: Boolean,
  icon: Object,
  iconOnly: Boolean,
  nativeType: { type: String, default: 'button' },
  style: { type: [String, Object], default: '' }
})

defineEmits(['click'])

const handleClick = (e) => { if (!props.disabled && !props.loading) emit('click', e) }
</script>

<style scoped>
.y-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-weight: 500; border: none; border-radius: var(--yacd-radius);
  transition: var(--yacd-transition); cursor: pointer; white-space: nowrap;
  font-family: inherit; outline: none;
}
.y-btn:focus-visible { outline: 2px solid var(--yacd-primary); outline-offset: 2px; }

.y-btn--primary { background: var(--yacd-primary); color: white; }
.y-btn--primary:hover:not(:disabled) { background: var(--yacd-primary-hover); }
.y-btn--success { background: var(--yacd-success); color: white; }
.y-btn--success:hover:not(:disabled) { background: #5abd32; }
.y-btn--warning { background: var(--yacd-warning); color: white; }
.y-btn--warning:hover:not(:disabled) { background: #d4932a; }
.y-btn--danger { background: var(--yacd-danger); color: white; }
.y-btn--danger:hover:not(:disabled) { background: #e85a5a; }
.y-btn--info { background: var(--yacd-info); color: white; }
.y-btn--info:hover:not(:disabled) { background: #7d808b; }
.y-btn--default { background: var(--yacd-bg); color: var(--yacd-text); border: 1px solid var(--yacd-border); }
.y-btn--default:hover:not(:disabled) { background: var(--yacd-border); }

.y-btn--small { padding: 6px 12px; font-size: 12px; gap: 6px; }
.y-btn--default { padding: 10px 20px; font-size: 14px; gap: 8px; }
.y-btn--large { padding: 14px 28px; font-size: 15px; gap: 10px; }

.y-btn--icon-only { padding: 8px; }
.y-btn--small.y-btn--icon-only { padding: 6px; }
.y-btn--large.y-btn--icon-only { padding: 12px; }

.y-btn--disabled { opacity: 0.5; cursor: not-allowed; }
.y-btn--loading { pointer-events: none; }

.y-btn__loading { display: inline-flex; width: 1em; height: 1em; animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
</style>