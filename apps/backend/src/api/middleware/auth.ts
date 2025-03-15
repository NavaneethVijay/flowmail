import type { Context, Next } from 'hono'
import { type User } from '@supabase/supabase-js'
import { supabase } from '@/config/supabase.js';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  console.log('authticated user ==>', user?.email)
  if (error) {
    console.error('Error getting user from token', error)
    // if (error.code == 'bad_jwt') {
    //   const { access_token } = await new AuthService().refreshTokensIfNeeded(token)
    //   const { data: { user }, error } = await supabase.auth.getUser(access_token);
    //   console.log('user from refreshed token', JSON.stringify(user, null, 2))

    //   if (error || !user) {
    //     return c.json({ error: 'Unauthorized' }, 401);
    //   }
    //   c.set('user', user as User);
    //   await next();
    // }
  }

  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  c.set('user', user as User);
  await next();
}
