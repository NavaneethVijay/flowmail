import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import BoardService from '@/services/board/index'
import type { Board } from '@/types/boards'
import EmailService from '@/services/email/index'
import { RequestContext } from '@/interfaces/IContext'

const projectRouter = new Hono()
const boardsService = new BoardService()
const emailService = new EmailService()

// Apply auth middleware to all routes
projectRouter.use('*', authMiddleware)


/**
 * Get domain stats
 */
projectRouter.get('/domain-stats', async (c: RequestContext) => {
  try {
    const user = c.get('user') as User
    const domainStats = await emailService.setUser(user).getEmailDomainStats()
    return c.json(domainStats)
  } catch (error) {
    console.error('Failed to fetch domain stats', error)
    return c.json({ error: 'Failed to fetch domain stats' }, 500)
  }
})
/**
 * Get all user boards
 */
projectRouter.get('/', async (c: RequestContext) => {
  try {
    const user = c.get('user') as User
    const boards = await boardsService.setUser(user).getUserBoards()
    return c.json(boards)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Failed to fetch projects' }, 500)
  }
})

/**
 * Create new board
 */
projectRouter.post('/', async (c: RequestContext) => {
  try {
    const body = await c.req.json() as Board
    const user = c.get('user') as User
    const board = await boardsService.setUser(user).createBoard(body)
    return c.json(board)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Failed to create project' }, 500)
  }
})

/**
 * Update board
 */
projectRouter.put('/:id', async (c: RequestContext) => {
  try {
    const body = await c.req.json() as Board
    const user = c.get('user') as User
    const board = await boardsService.setUser(user).updateBoard(body)
    return c.json(board)
  } catch (error) {
    return c.json({ error: 'Failed to update project' }, 500)
  }
})

/**
 * Delete board
 */
projectRouter.delete('/:id', async (c: RequestContext) => {
  try {
    const boardId = parseInt(c.req.param('id'))
    const user = c.get('user') as User
    await boardsService.setUser(user).deleteBoard(boardId)
    return c.json({ message: 'Project deleted' })
  } catch (error) {
    return c.json({ error: 'Failed to delete project' }, 500)
  }
})

/**
 * Update board columns TODO
 */
projectRouter.post('/:id/columns', async (c: RequestContext) => {
  console.log('Called update board columns')
  try {
    const user = c.get('user')
    const boardId = parseInt(c.req.param('id'))
    const columns = await c.req.json()
    await boardsService.setUser(user).updateBoardColumns(boardId, columns.columns)

    return c.json({ message: 'Board columns updated' })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Failed to update board columns' }, 500)
  }
})

/**
 * Get board emails
 */
projectRouter.get('/:id/emails', async (c: RequestContext) => {
  const boardId = parseInt(c.req.param('id'))
  const user = c.get('user') as User
  const forceRefresh = c.req.query('forceRefresh') === 'true'
  const emails = await boardsService.setUser(user).getEmailsByBoardId(boardId, forceRefresh)
  return c.json(emails)
})
/**
 * Get board by slug
 */
projectRouter.get('/board/:slug', async (c: RequestContext) => {
  try {
    const user = c.get('user') as User
    const slug = c.req.param('slug')
    const board = await boardsService.setUser(user).getBoardBySlug(slug)
    return c.json(board)
  } catch (error) {
    return c.json({ error: 'Failed to fetch project' }, 500)
  }
})



export { projectRouter }
