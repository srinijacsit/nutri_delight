import { supabaseAdmin } from '../config/supabase';
import { NotFoundError } from '../utils/errors';

export class AddressService {
  async getAddresses(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('addresses')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async createAddress(userId: string, addressData: any) {
    // If this is set to default, unset other defaults
    if (addressData.is_default) {
      await this.unsetOtherDefaults(userId);
    }

    const { data, error } = await supabaseAdmin
      .from('addresses')
      .insert([{ ...addressData, profile_id: userId }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateAddress(userId: string, addressId: string, addressData: any) {
    if (addressData.is_default) {
      await this.unsetOtherDefaults(userId);
    }

    const { data, error } = await supabaseAdmin
      .from('addresses')
      .update(addressData)
      .eq('id', addressId)
      .eq('profile_id', userId) // Enforce ownership
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new NotFoundError('Address not found');
    
    return data;
  }

  async deleteAddress(userId: string, addressId: string) {
    const { data, error } = await supabaseAdmin
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('profile_id', userId) // Enforce ownership
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new NotFoundError('Address not found');
    
    return { success: true };
  }

  private async unsetOtherDefaults(userId: string) {
    await supabaseAdmin
      .from('addresses')
      .update({ is_default: false })
      .eq('profile_id', userId)
      .eq('is_default', true);
  }
}

export const addressService = new AddressService();
