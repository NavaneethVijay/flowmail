import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import EmailService from '@/services/email/index'
import { User } from '@supabase/supabase-js'
import { RequestContext } from '@/interfaces/IContext'

const emailRouter = new Hono()
const emailService = new EmailService()

// Apply auth middleware to all routes
emailRouter.use('*', authMiddleware)


/**
 * Get Email labels
 */
emailRouter.get('/labels', async (c: RequestContext) => {
  const user = c.get('user') as User
  const labels = await emailService.setUser(user).getLabels()
  return c.json(labels)
})

/**
 * Get Email threads by label
 */
emailRouter.get('/threads/:labelId', async (c: RequestContext) => {
  const user = c.get('user') as User
  const labelId = c.req.param('labelId')
  const threads = await emailService.setUser(user).getThreadsByLabel(labelId)
  return c.json(threads)
})


/**
 * Get analytics of the threads
 */
// emailRouter.get('/analytics/:labelId', async (c: RequestContext) => {
//   const user = c.get('user') as User
//   const labelId = c.req.param('labelId')
//   const analytics = await emailService.setUser(user).getAnalytics(labelId)
//   return c.json(analytics)
// })

/**
 * Get recent inbox emails
 */
emailRouter.get('/recent-inbox-emails', async (c: RequestContext) => {
  const user = c.get('user') as User
  const emails = await emailService.setUser(user).getRecentInboxEmails({
    maxResults: 10,
    pageToken: c.req.query('pageToken')
  })
  return c.json(emails)
})

/**
 * Get email thread
 */
emailRouter.get('/:id', async (c: RequestContext) => {
  const emailId = c.req.param('id')
  try {
    const user = c.get('user') as User
    const email = await emailService.setUser(user).getEmailById(emailId)
    return c.json(email)
  } catch (error) {
    console.error('Failed to fetch email', error)
    return c.json({ error: 'Failed to fetch email' }, 500)
  }
})
export { emailRouter }
