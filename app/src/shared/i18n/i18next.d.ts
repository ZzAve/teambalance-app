import 'i18next'
import type en from './locales/en.json'

// English is the source catalogue: a key that is not in it fails `tsc` (ADR-0043 §2).
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: typeof en }
  }
}
