import { z } from 'zod'

export const zodExample = z.object({
  fullName: z.string().min(2).describe('Your full name'),
  email: z.string().email().describe('Email address'),
  age: z.number().min(18).max(120),
  country: z.enum(['BR', 'US', 'PT']),
  subscribe: z.boolean().optional(),
  bio: z.string().max(500).optional().describe('Tell us about yourself'),
})
