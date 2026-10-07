import { z } from 'zod';

export const createNormalOrderSchema = z.object({
  customer_name: z.string().min(1, 'Name is required'),
  customer_phone: z.string().min(10, 'Valid phone number is required'),
  customer_notes: z.string().optional(),
  delivery_address_snapshot: z.record(z.any()).optional()
});

export const createBulkOrderSchema = z.object({
  customer_name: z.string().min(1, 'Name is required'),
  customer_phone: z.string().min(10, 'Valid phone number is required'),
  customer_notes: z.string().optional(),
  event_date: z.string().min(1, 'Event date is required'),
  event_time: z.string().min(1, 'Event time is required'),
  items: z.array(
    z.object({
      product_id: z.string().uuid('Invalid product ID'),
      option_name: z.string().nullable().optional(),
      option_id: z.string().uuid().nullable().optional(),
      quantity: z.number().int().positive('Quantity must be greater than 0')
    })
  ).min(1, 'At least one item is required for a bulk order')
});
