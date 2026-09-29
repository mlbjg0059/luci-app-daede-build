<template>
  <div class="y-input-number-wrapper" :class="{ 'y-input-wrapper--error': errorMessage }">
    <div class="y-input-number__controls">
      <button
        class="y-input-number__btn"
        @click="decrease"
        :disabled="disabled || (min !== undefined && currentValue <= min)"
        @mousedown.prevent
      >
        <Minus class="y-input-number__icon" />
      </button>
      <input
        :type="type"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
        class="y-input y-input-number__input"
      />
      <button
        class="y-input-number__btn"
        @click="increase"
        :disabled="disabled || (max !== undefined && currentValue >= max)"
        @mousedown.prevent
      >
        <Plus class="y-input-number__icon" />
      </button>
    </div>
    <div v-if="errorMessage" class="y-input__error">{{ errorMessage }}</div>
    <div v-else-if="help && !focused" class="y-input__help">{{ help }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Minus, Plus } from 'lucide-vue-next'

defineProps({
  modelValue: [String, Number],
  min: [Number, String],
  max: [Number, String],
  step: { type: Number, default: 1 },
  precision: { type: Number, default: 0 },
  type: { type: String, default: 'text' },
  placeholder: String,
  disabled: Boolean,
  readonly: Boolean,
  errorMessage: String,
  help: String
})
defineEmits(['update:modelValue', 'blur', 'focus'])

const focused = ref(false)
const currentValue = computed(() => modelValue === '' || modelValue === null ? 0 : Number(modelValue))

const displayValue = computed({
  get: () => props.modelValue === '' ? '' : String(props.modelValue),
  set: (val) => emit('update:modelValue', val === '' ? '' : Number(val))
})

const handleInput = (e) => { emit('update:modelValue', e.target.value) }
const handleBlur = (e) => { focused.value = false; emit('blur', e) }
const handleFocus = (e) => { focused.value = true; emit('focus', e) }

const handleKeydown = (e) => {
  if (e.key === 'ArrowUp') increase()
  else if (e.key === 'ArrowDown') decrease()
}

const increase = () => {
  const val = currentValue.value + props.step
  if (props.max === undefined || val <= props.max) emit('update:modelValue', val)
}

const decrease = () => {
  const val = currentValue.value - props.step
  if (props.min === undefined || val >= props.min) emit('update:modelValue', val)
}
</script>

<style scoped>
.y-input-number-wrapper { position: relative; width: 100%; }
.y-input-number__controls { display: flex; align-items: stretch; }
.y-input-number__btn {
  display: flex; align-items: center; justify-content: center;
  width: 32px; background: var(--yacd-bg); border: 1px solid var(--yacd-border);
  border-right: none; color: var(--yacd-text-secondary); cursor: pointer;
  transition: var(--yacd-transition-fast);
}
.y-input-number__btn:first-child { border-radius: var(--yacd-radius) 0 0 var(--yacd-radius); }
.y-input-number__btn:last-child { border-radius: 0 var(--yacd-radius) var(--yacd-radius) 0; border-left: none; }
.y-input-number__btn:hover:not(:disabled) { background: var(--yacd-border); color: var(--yacd-text); }
.y-input-number__btn:disabled { opacity: 0.5; cursor: not-allowed; }
.y-input-number__icon { width: 14px; height: 14px; }
.y-input-number__input {
  flex: 1; text-align: center; border: 1px solid var(--yacd-border);
  border-left: none; border-right: none; padding: 10px 8px; font-size: 13px;
  background: var(--yacd-card); color: var(--yacd-text);
  outline: none; transition: var(--yacd-transition-fast);
}
.y-input-number__input:focus { border-color: var(--yacd-primary); box-shadow: 0 0 0 2px var(--yacd-primary-light); }
.y-input-number__input:disabled { background: var(--yacd-bg); color: var(--yacd-text-secondary); }
</style>