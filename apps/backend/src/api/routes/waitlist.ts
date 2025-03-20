import { Hono } from 'hono'
import WaitlistService from '@/services/waitlist'

const waitlistRouter = new Hono()
const waitlistService = new WaitlistService()

/**
 * Add email to waitlist
 */
waitlistRouter.post('/', async (c) => {
  try {
    const { email } = await c.req.json()

    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }
    const entry = await waitlistService.addToWaitlist(email)
    return c.json(entry, 201)
  } catch (error: any) {
    const errorMessage = typeof error === 'string' ? error : error?.message || '';
    if (errorMessage.includes('Email already exists in waitlist')) {
      return c.json({ error: errorMessage }, 409);
    }
    if (errorMessage.includes('Invalid email address')) {
      return c.json({ error: errorMessage }, 400);
    }
    console.error('Unhandled error:', JSON.stringify(error, null, 2));
    return c.json({ error: 'Internal server error' }, 500);
  }
})

export { waitlistRouter }