import { useTranslation } from 'react-i18next'
import { SubstituteAvatar } from './SubstituteAvatar'

/**
 * A Substitute's face for the Team roster and their page: the dashed ring of SubstituteAvatar at a
 * Member face's size, with the Shirt Number badge in the same place as on MemberFace (ADR-0038).
 */
export function SubstituteFace({ name, shirtNumber, size }: { name: string; shirtNumber?: number | null; size: 'md' | 'lg' }) {
  const { t } = useTranslation()
  return (
    <div className="relative">
      <SubstituteAvatar
        name={name}
        className={size === 'md' ? 'size-16 border-2 text-body' : 'size-28 border-[3px] text-title'}
      />
      {/* The API sends null for "no number" although the generated type says undefined. */}
      {typeof shirtNumber === 'number' && (
        <span
          aria-label={t('member.shirtNumber', { number: shirtNumber })}
          className={[
            'absolute rounded-full border-background bg-foreground text-center font-bold text-background',
            size === 'md'
              ? '-bottom-1 left-1/2 min-w-6 -translate-x-1/2 border-2 px-1 text-caption leading-4'
              : '-right-1 -bottom-1 min-w-9 border-4 px-1.5 font-display text-body',
          ].join(' ')}
        >
          {shirtNumber}
        </span>
      )}
    </div>
  )
}
