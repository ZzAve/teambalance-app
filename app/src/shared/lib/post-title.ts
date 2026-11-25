/** The first line of a Post's Markdown, without heading marks or emphasis: its name in short lists. */
export const postTitle = (markdown: string) =>
  markdown.split('\n').find((line) => line.trim())?.replace(/^#+\s*/, '').replace(/[*_`]/g, '').trim() ?? ''
