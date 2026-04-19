import type { LegacyConfig } from '@rogeroliveira84/react-dynamic-forms'

export const legacyExample: LegacyConfig = {
  name: 'Client Register (v0.5 legacy)',
  fields: [
    {
      id: 'fullname',
      label: 'Full Name',
      type: 'text',
      required: 'true',
      value: '',
      placeholder: 'Type your name…',
    },
    {
      id: 'dateOfBirth',
      label: 'Date Of Birth',
      type: 'date',
      required: 'false',
      value: '',
    },
    {
      id: 'favoriteFruit',
      label: 'Favorite Fruit',
      type: 'array',
      required: 'false',
      value: '',
      definition: {
        options: [
          { id: 1, display: 'Apple' },
          { id: 2, display: 'Banana' },
          { id: 3, display: 'Watermelon' },
        ],
      },
    },
  ],
}
