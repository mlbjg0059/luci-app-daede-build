<template>
  <div class="y-input-wrapper" :class="{ 'y-input-wrapper--error': errorMessage }">
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :style="inputStyle"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      class="y-input"
    />
    <div v-if="errorMessage" class="y-input__error">{{ errorMessage }}</div>
    <div v-else-if="help && !focused" class="y-input__help">{{ help }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  disabled: Boolean,
  readonly: Boolean,
  errorMessage: String,
  help: String
})
defineEmits(['update:modelValue', 'blur', 'focus'])

const focused = ref(false)

const handleInput = (e) => emit('update:modelValue', e.target.value)
const handleBlur = (e) => { focused.value = false; emit('blur', e) }
const handleFocus = (e) => { focused.value = true; emit('focus', e) }

const inputStyle = computed(() => ({ width: '100%' }))
</script>

<style scoped>
.y-input-wrapper { position: relative; width: 100%; }
.y-input {
  width: 100%; padding: 10px 12px; font-size: 13px;
  border: 1px solid var(--yacd-border); border-radius: var(--yacd-radius);
  background: var(--yacd-card); color: var(--yacd-text);
  transition: var(--yacd-transition-fast);
}
.y-input::placeholder { color: var(--yacd-text-placeholder); }
.y-input:hover:not(:disabled):not(:readonly) { border-color: var(--yacd-text-placeholder); }
.y-input:focus { outline: none; border-color: var(--yacd-primary); box-shadow: 0 0 0 2px var(--yacd-primary-light); }
.y-input:disabled, .y-input[readonly] { background: var(--yacd-bg); color: var(--yacd-text-secondary); cursor: not-allowed; }
.y-input-wrapper--error .y-input { border-color: var(--yacd-danger); }
.y-input-wrapper--error .y-input:focus { box-shadow: 0 0 0 2px var(--yacd-danger-light); }
</style>