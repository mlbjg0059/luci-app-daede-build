<template>
  <label class="y-switch" :class="{ 'y-switch--checked': modelValue, 'y-switch--disabled': disabled }" @click="toggle">
    <input type="checkbox" :checked="modelValue" :disabled="disabled" class="y-switch__input" @change="$emit('update:modelValue', $event.target.checked)" />
    <span class="y-switch__core">
      <span class="y-switch__thumb"></span>
    </span>
    <span v-if="label" class="y-switch__label">{{ label }}</span>
    <YTooltip v-if="help" :content="help" placement="right">
      <Info class="y-switch__help-icon" />
    </YTooltip>
    <div v-if="onText || offText" class="y-switch__text">
      <span :class="{ active: modelValue }">{{ onText }}</span>
      <span :class="{ active: !modelValue }}">{{ offText }}</span>
    </div>
  </label>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  label: String,
  help: String,
  disabled: Boolean,
  onText: String,
  offText: String
})
defineEmits(['update:modelValue', 'change'])

const toggle = () => { if (!props.disabled) emit('update:modelValue', !modelValue) }
</script>

<style scoped>
.y-switch { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
.y-switch--disabled { opacity: 0.5; cursor: not-allowed; }
.y-switch__input { position: absolute; opacity: 0; width: 0; height: 0; }
.y-switch__core { position: relative; width: 44px; height: 24px; background: var(--yacd-border); border-radius: 12px; transition: var(--yacd-transition); }
.y-switch--checked .y-switch__core { background: var(--yacd-primary); }
.y-switch__thumb { position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; box-shadow: var(--yacd-shadow); transition: var(--yacd-transition); }
.y-switch--checked .y-switch__thumb { transform: translateX(20px); }
.y-switch__label { font-size: 13px; color: var(--yacd-text); }
.y-switch__help-icon { width: 14px; height: 14px; color: var(--yacd-text-placeholder); }
.y-switch__text { display: flex; gap: 8px; font-size: 12px; color: var(--yacd-text-secondary); }
.y-switch__text span { padding: 2px 8px; border-radius: 4px; transition: var(--yacd-transition-fast); background: transparent; }
.y-switch__text span.active { background: var(--yacd-primary-light); color: var(--yacd-primary); font-weight: 500; }
</style>