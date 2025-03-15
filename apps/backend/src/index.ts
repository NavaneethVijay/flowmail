import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { authRouter } from './api/routes/auth.js'
import { projectRouter } from './api/routes/projects.js'
import { cors } from 'hono/cors'
import { emailRouter } from './api/routes/email.js'
import { createKey, encryptObjectValues } from './utils/crypto.js'

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

// app.get('/secret', (c) => {
//   const user = { id: 123, username: 'johndoe' };
//   const encryptionKey = createKey(user);

//   const data = { name: 'John Doe', email: 'john@example.com', age: 30, role: 'admin' };
//   const encryptedData = encryptObjectValues(data, encryptionKey, { excludeKeys: ['age'] });

//   console.log('Encrypted Data:', encryptedData);

//   return c.json({ encryptionKey, encryptedData })
// })


// Error handling
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ error: 'Internal Server Error' }, 500)
})

app.use('/*', cors({
  origin: 'http://localhost:3000',
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