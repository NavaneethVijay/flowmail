import { TodoRepository, type CreateTodoInput, type UpdateTodoInput, type Todo } from '@/app/repository/todoRepository'
import { User } from '@supabase/supabase-js'
import { BoardEmailRepository } from '@/app/repository/boardEmailRepository'

export default class TodoService {
    private todoRepository: TodoRepository
    private boardEmailRepository: BoardEmailRepository
    private user: User | undefined

    constructor() {
        this.todoRepository = new TodoRepository()
        this.boardEmailRepository = new BoardEmailRepository()
    }

    setUser(user: User) {
        this.user = user
        return this
    }

    private async verifyEmailAccess(boardEmailId: string) {
        if (!this.user) throw new Error('User not set')

        // Verify the email exists and user has access to it
        const email = await this.boardEmailRepository.checkIfEmailIdIsValid(boardEmailId)
        if (!email) {
            throw new Error('Email not found')
        }
        // Additional access verification can be added here if needed
    }

    async createTodo(data: CreateTodoInput): Promise<Todo> {
        await this.verifyEmailAccess(data.board_email_id)
        return await this.todoRepository.createTodo(data)
    }

    async updateTodo(data: UpdateTodoInput): Promise<Todo> {
        const todo = await this.todoRepository.getTodoById(data.id)
        if (!todo) {
            throw new Error('Todo not found')
        }
        await this.verifyEmailAccess(todo.board_email_id)
        return await this.todoRepository.updateTodo(data)
    }

    async deleteTodo(id: number): Promise<void> {
        const todo = await this.todoRepository.getTodoById(id)
        if (!todo) {
            throw new Error('Todo not found')
        }
        await this.verifyEmailAccess(todo.board_email_id)
        await this.todoRepository.deleteTodo(id)
    }

    async getTodosByEmailId(boardEmailId: string): Promise<Todo[]> {
        await this.verifyEmailAccess(boardEmailId)
        return await this.todoRepository.getTodosByEmailId(boardEmailId)
    }

    async getTodoById(id: number): Promise<Todo | null> {
        const todo = await this.todoRepository.getTodoById(id)
        if (todo) {
            await this.verifyEmailAccess(todo.board_email_id)
        }
        return todo
    }

    async toggleTodoComplete(id: number): Promise<Todo> {
        const todo = await this.todoRepository.getTodoById(id)
        if (!todo) {
            throw new Error('Todo not found')
        }
        await this.verifyEmailAccess(todo.board_email_id)
        return await this.todoRepository.toggleTodoComplete(id)
    }
}