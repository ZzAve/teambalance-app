export function MoneyPoolNotice({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-lg bg-card p-4 text-center">
      <h3 className="font-display text-body font-bold">{title}</h3>
      <p className="mt-1 text-small text-muted-foreground">{body}</p>
    </section>
  )
}
