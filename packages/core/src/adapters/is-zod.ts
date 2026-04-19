import type { ZodTypeAny } from 'zod'

export function isZodLike(input: unknown): input is ZodTypeAny {
  return (
    typeof input === 'object' &&
    input !== null &&
    '_def' in (input as object) &&
    'parse' in (input as object)
  )
}
