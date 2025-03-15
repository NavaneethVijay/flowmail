import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { authRouter } from './api/routes/auth.js'
import { projectRouter } from './api/routes/projects.js'
import { cors } from 'hono/cors'
import { emailRouter } from './api/routes/email.js'

const app = new Hono()
app.use('*', logger())

// Mount auth routes
app.route('/api/auth', authRouter)
app.route('/api/emails', emailRouter)
app.route('/api/projects', projectRouter)

// Root route
app.get('/', (c) => {
  return c.json({ message: 'Welcome to Gmail API Integration' })
})

// Error handling
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ error: 'Internal Server Error' }, 500)
})

app.use('/*', cors({
  origin: 'http://www.flowmail.in/',
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
}))

const port = 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})