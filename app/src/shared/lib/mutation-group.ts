interface MutationState {
  error: unknown
  isPending: boolean
}

/** Folds several mutations into the first error of `ErrorClass` (null if none) and whether any is pending. */
export function summarizeMutations<E extends Error>(
  ErrorClass: new (...args: never[]) => E,
  ...mutations: MutationState[]
): { error: E | null; isSaving: boolean } {
  return {
    error: mutations.map((m) => m.error).find((e): e is E => e instanceof ErrorClass) ?? null,
    isSaving: mutations.some((m) => m.isPending),
  }
}
