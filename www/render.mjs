// Fills {{key}} placeholders. Text and attributes get HTML-escaped values; placeholders inside the
// <script type="application/json" id="copy"> block get JSON-escaped values (and `<` as `<` so the
// value can never close the script element).
const html = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const json = (s) => JSON.stringify(s).slice(1, -1).replace(/</g, '\\u003c')

const COPY_BLOCK_OR_PLACEHOLDER = /(<script type="application\/json" id="copy">[\s\S]*?<\/script>)|\{\{(\w+)\}\}/g

export const render = (template, strings, label = 'strings') => {
  const value = (key) => {
    if (!(key in strings)) throw new Error(`${label} has no "${key}"`)
    return strings[key]
  }
  return template.replace(COPY_BLOCK_OR_PLACEHOLDER, (_, block, key) =>
    block ? block.replace(/\{\{(\w+)\}\}/g, (_m, k) => json(value(k))) : html(value(key)),
  )
}
