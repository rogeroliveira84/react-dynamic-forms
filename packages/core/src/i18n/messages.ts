export type RdfMessageKey =
  | 'required'
  | 'invalid_type'
  | 'too_small_string'
  | 'too_big_string'
  | 'too_small_number'
  | 'too_big_number'
  | 'invalid_string_email'
  | 'invalid_string_url'
  | 'invalid_string_regex'
  | 'invalid_enum_value'
  | 'invalid_date'

export type RdfMessageParams = {
  minimum?: number | bigint
  maximum?: number | bigint
  options?: (string | number)[]
}

export type RdfMessageValue = string | ((params: RdfMessageParams) => string)

export type RdfMessages = Partial<Record<RdfMessageKey, RdfMessageValue>>
