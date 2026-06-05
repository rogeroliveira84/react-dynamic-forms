import { z } from 'zod'
import type { WizardStep } from '@rogeroliveira84/react-dynamic-forms-ui'

export const wizardSchema = z.object({
  email: z.string().email().describe('Work email'),
  password: z.string().min(8).describe('At least 8 characters'),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['Engineer', 'Designer', 'Product Manager']),
})

export const wizardSteps: WizardStep[] = [
  { title: 'Account', description: 'Your login details', fields: ['email', 'password'] },
  { title: 'Profile', description: 'A bit about you', fields: ['firstName', 'lastName', 'role'] },
]
