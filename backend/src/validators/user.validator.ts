import { z } from 'zod';

export const updateProfileSchema = z.object({
  // Add fields as necessary. For now, profile mostly has `role` which they can't update,
  // but if they had a name or avatar, it would go here.
  // We'll leave it empty/allow any safe updates if added later.
}).strict();

export const createAddressSchema = z.object({
  recipient_name: z.string().min(1, 'Recipient name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  label: z.string().optional(),
  is_default: z.boolean().optional(),
  delivery_instructions: z.string().optional()
});

export const updateAddressSchema = createAddressSchema.partial();
