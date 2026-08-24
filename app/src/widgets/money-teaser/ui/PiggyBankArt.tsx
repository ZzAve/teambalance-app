/**
 * The cozy piggy-bank mascot for the Money teaser — a warm, friendly coin bank with a euro coin
 * poised above the slot. Purely decorative (the copy beside it carries the meaning), so it is
 * `aria-hidden` and takes no props.
 *
 * Every fill is a design token, not a literal, so it follows the theme. Gold is deliberately the
 * one hue the dark layer leaves unchanged (it already reads on the warm near-black card and is the
 * "maybe" attendance colour), which is exactly why the piggy stays gold in both themes instead of
 * needing a dark-mode variant. The deep-brown snout/eye details sit on that gold in either theme.
 */
export function PiggyBankArt({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="150"
      viewBox="0 0 140 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ground shadow */}
      <ellipse cx="70" cy="110" rx="46" ry="6" fill="rgba(120, 80, 40, 0.12)" />
      {/* euro coin above the slot */}
      <circle cx="70" cy="18" r="11" fill="var(--color-gold-light)" stroke="var(--color-gold-dark)" strokeWidth="2.5" />
      <text
        x="70"
        y="23"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="13"
        fill="var(--color-gold-dark)"
      >
        €
      </text>
      {/* legs */}
      <rect x="42" y="86" width="12" height="16" rx="5" fill="var(--color-gold-dark)" />
      <rect x="86" y="86" width="12" height="16" rx="5" fill="var(--color-gold-dark)" />
      {/* body */}
      <ellipse cx="70" cy="66" rx="47" ry="35" fill="var(--color-gold)" />
      <ellipse cx="70" cy="66" rx="47" ry="35" fill="none" stroke="rgba(120, 80, 40, 0.18)" strokeWidth="1.5" />
      {/* ear */}
      <path d="M42 40 q-4 -14 10 -14 q-2 10 -4 16 Z" fill="var(--color-gold-dark)" />
      {/* coin slot */}
      <rect x="60" y="40" width="20" height="5" rx="2.5" fill="#8a5a00" />
      {/* snout */}
      <ellipse cx="112" cy="66" rx="15" ry="17" fill="var(--color-gold)" stroke="rgba(120, 80, 40, 0.18)" strokeWidth="1.5" />
      <circle cx="109" cy="64" r="2.6" fill="#8a5a00" />
      <circle cx="117" cy="64" r="2.6" fill="#8a5a00" />
      {/* eye */}
      <circle cx="90" cy="55" r="3.4" fill="#3a2600" />
      {/* cheek blush */}
      <circle cx="96" cy="66" r="4.5" fill="rgba(255, 255, 255, 0.35)" />
      {/* curly tail */}
      <path d="M24 62 q-9 -3 -7 5 q1 6 6 3" fill="none" stroke="var(--color-gold-dark)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
