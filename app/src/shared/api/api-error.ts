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

/** The `{ code }` of an error body, as GlobalExceptionHandler sends it, when it is a string. */
export function codeOf(body: unknown): string | undefined {
  const code = (body as { code?: unknown } | null | undefined)?.code
  return typeof code === 'string' ? code : undefined
}

/** The error for a non-success response. */
export function apiErrorOf(res: { status: number; body?: unknown }, message?: string): ApiError {
  return new ApiError(res.status, codeOf(res.body), message)
}
