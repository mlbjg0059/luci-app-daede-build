<template>
  <div class="subscription-convert">
    <div class="page-header">
      <h1 class="page-title">{{ t('nav.subscriptionConvert') }}</h1>
    </div>

    <YCard :description="t('subscription.convert')">
      <FormCard :model="form" @submit="convert">
        <FormItem :label="t('subscription.urlPlaceholder')" prop="url" required>
          <YInput v-model="form.url" :placeholder="t('subscription.urlPlaceholder')" type="url" />
        </FormItem>
        <FormItem :label="t('subscription.namePlaceholder')" prop="name" required>
          <YInput v-model="form.name" :placeholder="t('subscription.namePlaceholder')" />
        </FormItem>
        <FormItem :label="t('subscription.groupNamePlaceholder')" prop="groupName" required>
          <YInput v-model="form.groupName" :placeholder="t('subscription.groupNamePlaceholder')" />
        </FormItem>
        <template #footer>
          <YButton type="primary" :loading="converting">{{ t('subscription.startConvert') }}</YButton>
        </template>
      </FormCard>

      <YCard v-if="result" :title="t('subscription.preview')" class="mt-4">
        <pre class="result-preview">{{ result }}</pre>
        <div class="mt-3">
          <YButton @click="applyResult" type="primary">{{ t('common.apply') }}</YButton>
          <YButton @click="downloadResult">{{ t('common.download') }}</YButton>
        </div>
      </YCard>
    </YCard>
  </template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/api'
import { toast } from '@/utils/toast'

const { t } = useI18n()

const form = reactive({ url: '', name: '', groupName: '' })
const converting = ref(false)
const result = ref('')

const convert = async () => {
  converting.value = true
  try {
    const res = await api.convertSubscription(form)
    result.value = res.config
    toast.success(t('subscription.convertSuccess'))
  } catch (e) { toast.error(t('subscription.convertFailed', { error: e.message })) } finally { converting.value = false }
}

const applyResult = async () => {
  try { await api.applyConfig(result.value); toast.success('配置已应用') } catch (e) { toast.error(e.message) }
}

const downloadResult = () => {
  const blob = new Blob([result.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${form.name}.yaml`; a.click()
  URL.revokeObjectURL(url)
}

return { form, converting, result, convert, applyResult, downloadResult, t }
</script>