<template>
  <div class="y-card" :class="{ 'y-card--hover': hover, 'y-card--shadow-never': shadow === 'never', 'y-card--shadow-hover': shadow === 'hover' }">
    <div v-if="$slots.header || title" class="y-card__header">
      <div class="y-card__header-content">
        <span v-if="title" class="y-card__title">{{ title }}</span>
        <slot name="header" />
      </div>
      <slot name="header-action" />
    </div>
    <div class="y-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="y-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  hover: { type: Boolean, default: false },
  shadow: { type: String, default: 'always', validator: v => ['always', 'hover', 'never'].includes(v) }
})
</script>

<style scoped>
.y-card { background: var(--yacd-card); border: 1px solid var(--yacd-border); border-radius: var(--yacd-radius); box-shadow: var(--yacd-shadow); transition: var(--yacd-transition); overflow: hidden; }
.y-card--hover:hover { box-shadow: var(--yacd-shadow-hover); transform: translateY(-2px); }
.y-card--shadow-never { box-shadow: none; }
.y-card--shadow-hover { box-shadow: none; }
.y-card--shadow-hover:hover { box-shadow: var(--yacd-shadow-hover); transform: translateY(-2px); }
.y-card__header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--yacd-border); }
.y-card__header-content { display: flex; align-items: center; gap: 12px; }
.y-card__title { font-size: 16px; font-weight: 600; color: var(--yacd-text); }
.y-card__body { padding: 20px; }
.y-card__footer { padding: 16px 20px; border-top: 1px solid var(--yacd-border); background: var(--yacd-bg); }
</style>