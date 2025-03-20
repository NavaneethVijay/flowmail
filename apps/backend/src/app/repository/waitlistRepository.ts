import { supabase } from '@/config/supabase'

export interface WaitlistEntry {
  id: string
  email: string
  created_at: string
}

export class WaitlistRepository {
  private readonly WAITLIST_TABLE = 'waitlist'

  async addEmail(email: string): Promise<WaitlistEntry> {
    const { data, error } = await supabase
      .from(this.WAITLIST_TABLE)
      .insert({ email })
      .select()
      .single()

    if (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        throw new Error('Email already exists in waitlist')
      }
      console.error('Error adding to waitlist:', error)
      throw new Error(error.message || 'Unknown database error');
    }

    return data
  }
}