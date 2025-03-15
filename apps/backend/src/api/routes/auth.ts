import { Hono } from 'hono'
import type { User } from '@supabase/supabase-js'
import { authMiddleware } from '@/api/middleware/auth'
import AuthService from '@/services/auth/index'
import { RequestContext } from '@/interfaces/IContext'

const authRouter = new Hono()
const authService = new AuthService()

/**
 * Login with Google
 */
authRouter.get('/login', async (c) => {
  const url = await authService.generateAuthUrl()
  return c.redirect(url)
})

/**
 * Google callback
 */
authRouter.get('/callback', async (c) => {
  const code = c.req.query('code')
  try {
    const data = await authService.handleGoogleCallback(code as string)
    if (!data) {
      return c.json({ error: 'Authentication failed' }, 400)
    }
    return c.redirect(`${process.env.APPLICATION_FRONTEND_CALLBACK_URL}?access_token=${data.access_token}`)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Authentication failed' }, 400)
  }
})

/**
 * Logout
 */
authRouter.post('/logout', authMiddleware, async (c: RequestContext) => {
  try {
    const user = c.get('user') as User
    await authService.setUser(user).signOut()
    return c.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ error: 'Failed to logout' }, 500);
  }
});

/**
 * Check if user is authenticated
 */
authRouter.get('/check-auth', authMiddleware, async (c: RequestContext) => {
  const user = c.get('user') as User
  return c.json(user)
})

/**
 * User settings
 */
authRouter.get('/settings', authMiddleware, async (c: RequestContext) => {
  const user = c.get('user') as User
  const settings = await authService.setUser(user).getUserSettings()
  return c.json(settings)
})
export { authRouter }
