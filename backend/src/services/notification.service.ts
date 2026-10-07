import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';

export class NotificationService {
  async getNotifications(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError('Failed to fetch notifications', 500, 'INTERNAL_ERROR');
    }
    return data;
  }

  async markAsRead(userId: string, notificationId: string, isRead: boolean) {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: isRead })
      .eq('id', notificationId)
      .eq('profile_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Notification not found', 404, 'NOT_FOUND');
    }
    return data;
  }
}

export const notificationService = new NotificationService();
