/** VITE_DEMO is set to the string "true" only by the demo build; "false", "" or unset all mean off. */
export function isDemoFlag(value: string | undefined) {
  return value === 'true'
}

export const IS_DEMO_BUILD = isDemoFlag(import.meta.env.VITE_DEMO)
