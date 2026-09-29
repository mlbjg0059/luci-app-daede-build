<template>
  <div class="y-tooltip-provider" @mouseenter="show = true" @mouseleave="show = false">
    <slot name="trigger" v-if="show" />
    <Transition name="fade">
      <div v-show="show" class="y-tooltip" :style="tooltipStyle">
        <div class="y-tooltip__content">{{ content }}</div>
        <div class="y-tooltip__arrow" />
      </div>
    </Transition>
    <slot />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineProps({
  content: String,
  placement: { type: String, default: 'top', validator: v => ['top', 'bottom', 'left', 'right'].includes(v) },
  offset: { type: Number, default: 8 }
})

const show = ref(false)
const tooltipStyle = ref({})

const updatePosition = () => {
  const trigger = document.querySelector('.y-tooltip-provider > :first-child')
  if (!trigger) return
  const rect = trigger.getBoundingClientRect()
  const offset = props.offset
  let top, left

  switch (props.placement) {
    case 'top':
      top = rect.top - offset - 8; left = rect.left + rect.width / 2 - 80
      break
    case 'bottom':
      top = rect.bottom + offset + 8; left = rect.left + rect.width / 2 - 80
      break
    case 'left':
      top = rect.top + rect.height / 2 - 16; left = rect.left - offset - 8 - 160
      break
    case 'right':
      top = rect.top + rect.height / 2 - 16; left = rect.right + offset + 8
      break
  }

  tooltipStyle.value = { top: `${top}px`, left: `${left}px` }
}

const update = () => { if (show.value) updatePosition() }

onMounted(() => { window.addEventListener('scroll', update, true); window.addEventListener('resize', update) })
onUnmounted(() => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update) })
</script>

<style scoped>
.y-tooltip {
  position: fixed; z-index: 9999; pointer-events: none;
  max-width: 240px; padding: 8px 12px;
  background: var(--yacd-text); color: white;
  border-radius: var(--yacd-radius-sm); font-size: 12px; line-height: 1.5;
  box-shadow: var(--yacd-shadow-hover); white-space: normal; word-break: break-word;
}
.y-tooltip__arrow {
  position: absolute; width: 6px; height: 6px; background: var(--yacd-text);
  transform: rotate(45deg);
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>