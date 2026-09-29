<template>
  <div class="y-table-wrapper" :class="{ 'y-table--loading': loading }">
    <table class="y-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.prop" :style="{ width: col.width, minWidth: col.minWidth }" :class="{ 'y-table__th--sortable': col.sortable }">
            <div class="y-table__th-content">
              <span>{{ col.label }}</span>
              <slot :name="col.prop + '-header'" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="data.length">
        <tr v-for="row in data" :key="row.id || row._id" :class="{ 'y-table__row--hover': hoverRow }" @mouseenter="hoverRow = true" @mouseleave="hoverRow = false">
          <td v-for="col in columns" :key="col.prop" :style="{ width: col.width, minWidth: col.minWidth }">
            <slot :name="col.prop" :row="row" :value="row[col.prop]">
              <template v-if="col.render">{{ col.render(row[col.prop], row) }}</template>
              <template v-else>{{ row[col.prop] }}</template>
            </slot>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="columns.length" class="y-table__empty">
            <slot name="empty">{{ emptyText || t('common.noData') }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading" class="y-table__loading">
      <div class="y-table__loading-spinner"><RefreshCw class="animate-spin" /></div>
      <span>{{ loadingText || t('common.loading') }}</span>
    </div>
    <div v-if="pagination" class="y-table__pagination">
      <YButton size="small" @click="prevPage" :disabled="page <= 1">{{ t('common.prev') }}</YButton>
      <span class="page-info">{{ t('common.pageInfo', { current: page, total: totalPages }) }}</span>
      <YButton size="small" @click="nextPage" :disabled="page >= totalPages">{{ t('common.next') }}</YButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, default: () => [] },
  loading: Boolean,
  loadingText: String,
  emptyText: String,
  pagination: { type: Boolean, default: false },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 20 },
  total: { type: Number, default: 0 }
})

defineEmits(['page-change'])

const { t } = useI18n()
const hoverRow = ref(false)
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const prevPage = () => { if (props.page > 1) emit('page-change', props.page - 1) }
const nextPage = () => { if (props.page < totalPages.value) emit('page-change', props.page + 1) }
</script>

<style scoped>
.y-table-wrapper { position: relative; background: var(--yacd-card); border: 1px solid var(--yacd-border); border-radius: var(--yacd-radius); overflow: hidden; }
.y-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.y-table th, .y-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--yacd-divider); white-space: nowrap; }
.y-table th { background: var(--yacd-bg); font-weight: 600; color: var(--yacd-text-secondary); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
.y-table tbody tr { transition: var(--yacd-transition-fast); }
.y-table__row--hover { background: var(--yacd-bg); }
.y-table__empty { text-align: center; padding: 48px 16px; color: var(--yacd-text-placeholder); }
.y-table__loading { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(255,255,255,0.9); z-index: 10; font-size: 13px; color: var(--yacd-text-secondary); }
.y-table__loading-spinner { width: 20px; height: 20px; color: var(--yacd-primary); }
.y-table__pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px; border-top: 1px solid var(--yacd-border); background: var(--yacd-bg); }
.page-info { font-size: 13px; color: var(--yacd-text-secondary); }
</style>