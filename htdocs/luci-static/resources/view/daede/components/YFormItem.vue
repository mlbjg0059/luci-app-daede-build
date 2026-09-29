<template>
  <div class="y-form-item" :class="{ 'y-form-item--error': errorMessage }">
    <label v-if="label" class="y-form-item__label">
      {{ label }}
      <YTooltip v-if="help" :content="help" placement="right">
        <Info class="y-form-item__help-icon" />
      </YTooltip>
    </label>
    <div class="y-form-item__content">
      <slot />
    </div>
    <div v-if="errorMessage" class="y-form-item__error">{{ errorMessage }}</div>
    <div v-else-if="help && !helpIcon" class="y-form-item__help">{{ help }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  help: String,
  helpIcon: { type: Boolean, default: true },
  errorMessage: String,
  prop: String,
  required: { type: Boolean, default: false }
})
</script>

<style scoped>
.y-form-item { margin-bottom: 20px; }
.y-form-item__label { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-size: 13px; font-weight: 500; color: var(--yacd-text); }
.y-form-item__label ::v-deep .y-form-item__help-icon { width: 14px; height: 14px; color: var(--yacd-text-placeholder); flex-shrink: 0; }
.y-form-item__content { position: relative; }
.y-form-item__error { margin-top: 6px; font-size: 12px; color: var(--yacd-danger); }
.y-form-item__help { margin-top: 6px; font-size: 12px; color: var(--yacd-text-placeholder); }
</style>