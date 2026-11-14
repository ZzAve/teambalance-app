/**
 * An HTTP response the app treats as a failure. It carries the response status, which the shared
 * retry policy reads: a thrown error without a status is taken for a network reject.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string = 'FAILED',
    message = `Request failed with status ${status}`,
    options?: ErrorOptions,
  ) {
    super(message, options)
    this.name = 'ApiError'
  }
}

/** The error for a non-success response. `code` is the `{ code }` of the body, as GlobalExceptionHandler sends it. */
export function apiErrorOf(res: { status: number; body?: unknown }, message?: string): ApiError {
  const code = (res.body as { code?: unknown } | null | undefined)?.code
  return new ApiError(res.status, typeof code === 'string' ? code : undefined, message)
}
