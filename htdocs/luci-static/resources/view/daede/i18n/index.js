import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.js'
import enUS from './locales/en-US.js'

const messages = { 'zh-CN': zhCN, 'en-US': enUS }
const locale = localStorage.getItem('daede-lang') || 'zh-CN'

export const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en-US',
  messages,
  globalInjection: true
})

export function setLocale(lang) {
  i18n.global.locale.value = lang
  localStorage.setItem('daede-lang', lang)
}