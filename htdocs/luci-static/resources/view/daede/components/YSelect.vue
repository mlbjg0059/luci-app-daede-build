<template>
  <div class="y-select-wrapper" :class="{ 'y-select-wrapper--open': open, 'y-select-wrapper--error': errorMessage }">
    <div class="y-select__trigger" :class="{ 'y-select__trigger--focused': focused }" @click="toggle" @keydown="handleKeydown">
      <span class="y-select__selected">
        <span v-if="selectedOption">{{ selectedOption.label }}</span>
        <span v-else class="placeholder">{{ placeholder }}</span>
      </span>
      <ChevronDown :class="{ 'rotate-180': open }" class="y-select__arrow" />
    </div>
    <div v-if="errorMessage" class="y-select__error">{{ errorMessage }}</div>
    <div v-else-if="help && !focused" class="y-select__help">{{ help }}</div>

    <transition name="fade" @after-leave="onAfterLeave">
      <div v-show="open" class="y-select__dropdown">
        <div class="y-select__options">
          <div v-for="option in filteredOptions" :key="option.value" class="y-select__option" :class="{ 'y-select__option--selected': selectedValue === option.value, 'y-select__option--disabled': option.disabled }" @click="select(option)" @mousedown.prevent>
            <span class="y-select__option-label">{{ option.label }}</span>
            <Check v-if="selectedValue === option.value" class="y-select__check" />
          </div>
          <div v-if="filteredOptions.length === 0" class="y-select__empty">{{ t('common.noResults') }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

defineProps({
  modelValue: [String, Number],
  options: { type: Array, default: () => [] },
  placeholder: String,
  disabled: Boolean,
  filterable: { type: Boolean, default: true },
  errorMessage: String,
  help: String
})
defineEmits(['update:modelValue', 'change', 'blur', 'focus'])

const { t } = useI18n()
const open = ref(false)
const focused = ref(false)
const searchQuery = ref('')

const filteredOptions = computed(() => {
  if (!props.filterable || !searchQuery.value) return props.options
  return props.options.filter(o => o.label.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const selectedOption = computed(() => props.options.find(o => o.value === props.modelValue))

const selectedValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const toggle = () => { if (!props.disabled) { open.value = !open.value; focused.value = true; } }
const select = (option) => { if (!option.disabled) { selectedValue.value = option.value; emit('change', option.value); open.value = false; } }
const onAfterLeave = () => { focused.value = false }

const handleKeydown = (e) => {
  if (e.key === 'Escape') { open.value = false }
  else if (e.key === 'Enter' && open.value) { /* handled by click */ }
  else if (e.key === 'ArrowDown') { e.preventDefault(); open.value = true; focusNext() }
  else if (e.key === 'ArrowUp') { e.preventDefault(); focusPrev() }
}

const focusNext = () => { /* focus next option */ }
const focusPrev = () => { /* focus prev option */ }

const handleClickOutside = (e) => {
  if (!e.target.closest('.y-select-wrapper')) open.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

watch(() => props.disabled, (val) => { if (val) open.value = false })
</script>

<style scoped>
.y-select-wrapper { position: relative; width: 100%; }
.y-select__trigger {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 10px 12px; min-height: 40px;
  border: 1px solid var(--yacd-border); border-radius: var(--yacd-radius);
  background: var(--yacd-card); color: var(--yacd-text);
  cursor: pointer; transition: var(--yacd-transition-fast);
}
.y-select__trigger:hover:not(:disabled) { border-color: var(--yacd-text-placeholder); }
.y-select__trigger--focused { border-color: var(--yacd-primary); box-shadow: 0 0 0 2px var(--yacd-primary-light); }
.y-select__selected { flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.y-select__selected.placeholder { color: var(--yacd-text-placeholder); }
.y-select__arrow { width: 16px; height: 16px; color: var(--yacd-text-secondary); transition: var(--yacd-transition-fast); flex-shrink: 0; }
.y-select__arrow.rotate-180 { transform: rotate(180deg); }

.y-select__dropdown {
  position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px;
  background: var(--yacd-card); border: 1px solid var(--yacd-border); border-radius: var(--yacd-radius);
  box-shadow: var(--yacd-shadow-hover); z-index: 100; overflow: hidden;
  max-height: 240px; overflow-y: auto;
}
.y-select__options { max-height: 240px; overflow-y: auto; }
.y-select__option {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 12px; cursor: pointer; transition: var(--yacd-transition-fast);
}
.y-select__option:hover:not(.y-select__option--disabled) { background: var(--yacd-bg); }
.y-select__option--selected { background: var(--yacd-primary-light); color: var(--yacd-primary); }
.y-select__option--disabled { opacity: 0.5; cursor: not-allowed; }
.y-select__check { width: 16px; height: 16px; color: var(--yacd-primary); flex-shrink: 0; }
.y-select__empty { padding: 16px; text-align: center; color: var(--yacd-text-placeholder); font-size: 13px; }
</style>