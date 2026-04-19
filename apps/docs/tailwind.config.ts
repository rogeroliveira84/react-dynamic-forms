import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--rdf-border))',
        input: 'hsl(var(--rdf-input))',
        ring: 'hsl(var(--rdf-ring))',
        background: 'hsl(var(--rdf-background))',
        foreground: 'hsl(var(--rdf-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--rdf-primary))',
          foreground: 'hsl(var(--rdf-primary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--rdf-destructive))',
          foreground: 'hsl(var(--rdf-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--rdf-muted))',
          foreground: 'hsl(var(--rdf-muted-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--rdf-radius)',
        md: 'calc(var(--rdf-radius) - 2px)',
        sm: 'calc(var(--rdf-radius) - 4px)',
      },
    },
  },
} satisfies Config
