import Markdown_, { type Components } from 'react-markdown'
import { cn } from '@shared/lib/utils'

// ADR-0048: Markdown becomes React elements, never HTML (no rehype-raw), so raw HTML shows as text.
// Images are left out; any other element is replaced by its children.
const ALLOWED_ELEMENTS = [
  'p', 'br', 'strong', 'em', 'del', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
]

const HTTP_URL = /^https?:\/\//i
const httpOnly = (url: string) => (HTTP_URL.test(url) ? url : '')

const heading = ({ children }: { children?: React.ReactNode }) => (
  <p className="font-semibold text-foreground">{children}</p>
)

const COMPONENTS: Components = {
  h1: heading,
  h2: heading,
  h3: heading,
  h4: heading,
  h5: heading,
  h6: heading,
  ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
  blockquote: ({ children }) => <blockquote className="border-l-2 border-border pl-3 text-muted-foreground">{children}</blockquote>,
  code: ({ children }) => <code className="rounded bg-muted px-1 font-mono">{children}</code>,
  pre: ({ children }) => <pre className="overflow-x-auto rounded bg-muted p-2">{children}</pre>,
  a: ({ href, children }) =>
    href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue underline underline-offset-2">
        {children}
      </a>
    ) : (
      <span>{children}</span>
    ),
}

interface MarkdownProps {
  source: string
  className?: string
}

/** Renders user-written Markdown safely (ADR-0048): a short list of elements, http(s) links only. */
export function Markdown({ source, className }: MarkdownProps) {
  return (
    <div className={cn('flex flex-col gap-2 break-words text-small text-foreground/90', className)}>
      <Markdown_ allowedElements={ALLOWED_ELEMENTS} unwrapDisallowed urlTransform={httpOnly} components={COMPONENTS}>
        {source}
      </Markdown_>
    </div>
  )
}
