export const jsonSchemaExample = {
  title: 'Product',
  type: 'object' as const,
  properties: {
    name: { type: 'string' as const, title: 'Product name' },
    price: { type: 'number' as const, minimum: 0, title: 'Price (USD)' },
    inStock: { type: 'boolean' as const, title: 'In stock' },
    category: {
      type: 'string' as const,
      enum: ['A', 'B', 'C'] as const,
      title: 'Category',
    },
  },
  required: ['name', 'price'],
}
