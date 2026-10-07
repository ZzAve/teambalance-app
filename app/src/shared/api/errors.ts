/** Builds the error for a failed response; receives the response body for statuses that carry a `code`. */
export type ErrorBuilder = (body: unknown) => Error

export type ErrorTable<Status extends number> = { [S in Status]: ErrorBuilder }

/**
 * Throws the error the table lists for the response's status; any other status passes through.
 * Narrows `res` to the statuses left, so the caller can still read the success body.
 */
export function throwOnStatus<R extends { status: number }, Status extends number>(
  res: R,
  table: ErrorTable<Status>,
): asserts res is Exclude<R, { status: Status }> {
  const build = (table as Partial<Record<number, ErrorBuilder>>)[res.status]
  if (build) throw build((res as { body?: unknown }).body)
}
