import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// tailwind-merge only knows Tailwind's stock font sizes, so it filed the six named steps from #338
// (`text-caption` …) under "text colour" and dropped them whenever a colour class followed —
// `cn('text-caption text-muted-foreground')` came out as just the colour. Teach it the scale.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["caption", "small", "body", "lead", "title", "page"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
