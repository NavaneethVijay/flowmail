import { supabase } from '@/config/supabase'
import { User } from '@supabase/supabase-js'

export class OAuthRepository {
    private readonly OAUTH_TABLE = 'user_oauth_data'

    async getTokens(user: User) {
        const { data, error } = await supabase
            .from(this.OAUTH_TABLE)
            .select('*')
            .eq('id', user.id)
            .single()
        return data || []
    }
}
