import { User } from '@supabase/supabase-js';
import { Context } from 'hono';

interface RequestContext extends Context {
  user?: User;
}

export type { RequestContext }