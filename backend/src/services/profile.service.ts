import { supabaseAdmin } from '../config/supabase';
import { NotFoundError } from '../utils/errors';

export class ProfileService {
  async getProfile(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new NotFoundError('Profile not found');
      throw new Error(error.message);
    }
    return data;
  }

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}

export const profileService = new ProfileService();
