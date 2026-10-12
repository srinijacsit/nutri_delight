import { z } from 'zod';

export const addCartItemSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  option_id: z.string().uuid('Invalid option ID').optional(),
  quantity: z.number().int().positive('Quantity must be positive')
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive')
});
