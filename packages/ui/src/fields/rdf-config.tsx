import { createContext, useContext } from 'react'
import type { EnumOption } from '@rogeroliveira84/react-dynamic-forms'

/** Map of field name → async options loader. Supplied at render time on `<DynamicForm>`. */
export type AsyncOptionsMap = Record<string, (query: string) => Promise<EnumOption[]>>

export type RdfConfig = {
  asyncOptions?: AsyncOptionsMap
}

const RdfConfigContext = createContext<RdfConfig>({})

export const RdfConfigProvider = RdfConfigContext.Provider

export function useRdfConfig(): RdfConfig {
  return useContext(RdfConfigContext)
}
