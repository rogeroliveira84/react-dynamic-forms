export function getErrorMessage(
  errors: Record<string, unknown>,
  path: string,
): string | undefined {
  const parts = path.split('.')
  let current: unknown = errors
  for (const p of parts) {
    if (current && typeof current === 'object' && p in (current as object)) {
      current = (current as Record<string, unknown>)[p]
    } else {
      return undefined
    }
  }
  if (current && typeof current === 'object' && 'message' in (current as object)) {
    const msg = (current as { message?: unknown }).message
    return typeof msg === 'string' ? msg : undefined
  }
  return undefined
}
