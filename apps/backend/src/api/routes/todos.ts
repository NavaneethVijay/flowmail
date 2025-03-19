import { Hono } from 'hono'
import { RequestContext } from '@/interfaces/IContext'
import TodoService from '@/services/todo'
import { User } from '@supabase/supabase-js'
import { authMiddleware } from '../middleware/auth'

const todoRouter = new Hono()
const todoService = new TodoService()

/**
 * Create a new todo
 */
todoRouter.post('/', authMiddleware, async (c: RequestContext) => {
    try {
        const user = c.get('user') as User
        const body = await c.req.json()
        const todo = await todoService.setUser(user).createTodo(body)
        return c.json(todo, 201)
    } catch (error) {
        console.error('Failed to create todo:', error)
        return c.json({ error: error }, 400)
    }
})

/**
 * Update a todo
 */
todoRouter.put('/:id', authMiddleware, async (c: RequestContext) => {
    try {
        const user = c.get('user') as User
        const id = parseInt(c.req.param('id'))
        const body = await c.req.json()
        const todo = await todoService.setUser(user).updateTodo({ id, ...body })
        return c.json(todo)
    } catch (error) {
        console.error('Failed to update todo:', error)
            return c.json({ error: error }, 400)
    }
})

/**
 * Delete a todo
 */
todoRouter.delete('/:id', authMiddleware, async (c: RequestContext) => {
    try {
        const user = c.get('user') as User
        const id = parseInt(c.req.param('id'))
        await todoService.setUser(user).deleteTodo(id)
        return c.json({ success: true })
    } catch (error) {
        console.error('Failed to delete todo:', error)
            return c.json({ error: error }, 400)
    }
})

/**
 * Get todos by email ID
 */
todoRouter.get('/email/:emailId', authMiddleware, async (c: RequestContext) => {
    try {
        const user = c.get('user') as User
        const emailId = c.req.param('emailId')
        const todos = await todoService.setUser(user).getTodosByEmailId(emailId)
        return c.json(todos)
    } catch (error) {
        console.error('Failed to fetch todos:', error)
            return c.json({ error: error }, 400)
    }
})

/**
 * Get a specific todo
 */
todoRouter.get('/:id', authMiddleware, async (c: RequestContext) => {
    try {
        const user = c.get('user') as User
        const id = parseInt(c.req.param('id'))
        const todo = await todoService.setUser(user).getTodoById(id)
        if (!todo) {
            return c.json({ error: 'Todo not found' }, 404)
        }
        return c.json(todo)
    } catch (error) {
        console.error('Failed to fetch todo:', error)
        return c.json({ error: error }, 400)
    }
})

/**
 * Toggle todo completion status
 */
todoRouter.post('/:id/toggle', authMiddleware, async (c: RequestContext) => {
    try {
        const user = c.get('user') as User
        const id = parseInt(c.req.param('id'))
        const todo = await todoService.setUser(user).toggleTodoComplete(id)
        return c.json(todo)
    } catch (error) {
        console.error('Failed to toggle todo:', error)
        return c.json({ error: error }, 400)
    }
})

export { todoRouter }