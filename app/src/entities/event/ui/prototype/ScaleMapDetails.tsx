/**
 * PROTOTYPE — throwaway, issue #338. Surfaces the state a pure-CSS variant switch can't otherwise
 * show: which arbitrary size/radius each variant collapses onto what. Plain text, collapsed by
 * default. Delete alongside prototype-type-scale.css once #338 is decided.
 */

type ScaleVariant = 'A' | 'B' | 'C'

interface Row {
  from: string
  to: string
}

const TYPE_MAPS: Record<ScaleVariant, Row[]> = {
  A: [{ from: 'everything', to: 'unchanged — the current 58 arbitrary sizes, as shipped' }],
  B: [
    { from: '[9px] [10px] [11px]', to: '11px / 1.3 — caption' },
    { from: '[12px] [12.5px] [13px] [13.5px] · text-xs', to: '13px / 1.3 — small' },
    { from: '[15px] · text-sm · text-base', to: '15px / 1.5 — body' },
    { from: '[17px] · text-lg', to: '17px / 1.5 — lead' },
    { from: '[21px] [22px] · text-xl · text-2xl', to: '22px / 1.15 — title' },
    { from: 'text-3xl', to: '28px / 1.15 — page' },
  ],
  C: [
    { from: '[9px] [10px] [11px] [11.5px]', to: '12px / 1.3 — caption' },
    { from: '[12px] [12.5px] [13px] [13.5px] · text-xs', to: '14px / 1.3 — small' },
    { from: '[15px] · text-sm · text-base', to: '16px / 1.5 — body' },
    { from: '[17px] · text-lg', to: '18px / 1.5 — lead' },
    { from: '[21px] [22px] · text-xl · text-2xl', to: '24px / 1.15 — title' },
    { from: 'text-3xl', to: '28px / 1.15 — page (stays, carried by 3xl)' },
  ],
}

const RADIUS_MAPS: Record<ScaleVariant, Row[]> = {
  A: [{ from: 'everything', to: 'unchanged — sm/md/lg (8/12/16), Tailwind 2xl/3xl, [10px], [15px]' }],
  B: [
    { from: 'sm (8) · md (12) · lg (16) · xl (12) · 2xl (16)', to: 'unchanged — already on 8/12/16' },
    { from: '3xl (24, hero)', to: '16' },
    { from: '[10px] (roster nudge)', to: '12' },
    { from: '[15px] (date chit)', to: '16' },
  ],
  C: [
    { from: 'sm (8) · md (12) · xl (12) · [10px]', to: '10 — chips, badges, inputs' },
    { from: 'lg (16) · 2xl (16) · 3xl (24, hero) · [15px] (date chit)', to: '16 — cards' },
  ],
}

export function ScaleMapDetails({ variant }: { variant: ScaleVariant }) {
  return (
    <details className="mb-3 rounded-lg border border-dashed border-fuchsia-500/50 bg-fuchsia-500/5 p-3 text-sm open:pb-3.5">
      <summary className="cursor-pointer font-mono text-xs font-bold text-fuchsia-700">
        Prototype #338 — scale map (variant {variant})
      </summary>
      <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 font-mono text-[11px] font-bold uppercase text-muted-foreground">Type scale</p>
          <table className="w-full border-collapse text-xs">
            <tbody>
              {TYPE_MAPS[variant].map((row) => (
                <tr key={row.from} className="border-b border-border/40 last:border-0">
                  <td className="py-1 pr-2 align-top text-muted-foreground">{row.from}</td>
                  <td className="py-1 align-top font-semibold">{row.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p className="mb-1 font-mono text-[11px] font-bold uppercase text-muted-foreground">Radii</p>
          <table className="w-full border-collapse text-xs">
            <tbody>
              {RADIUS_MAPS[variant].map((row) => (
                <tr key={row.from} className="border-b border-border/40 last:border-0">
                  <td className="py-1 pr-2 align-top text-muted-foreground">{row.from}</td>
                  <td className="py-1 align-top font-semibold">{row.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </details>
  )
}
