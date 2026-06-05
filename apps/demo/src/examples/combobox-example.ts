import { z } from 'zod'
import type { EnumOption } from '@rogeroliveira84/react-dynamic-forms'

export const comboboxSchema = z.object({
  country: z.string().describe('Start typing to search countries'),
})

const COUNTRIES: EnumOption[] = [
  { value: 'br', label: 'Brazil' },
  { value: 'us', label: 'United States' },
  { value: 'pt', label: 'Portugal' },
  { value: 'jp', label: 'Japan' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
]

/** Simulates a remote search endpoint with latency. */
export async function loadCountries(query: string): Promise<EnumOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const q = query.toLowerCase()
  return COUNTRIES.filter((c) => c.label.toLowerCase().includes(q))
}
