import { supabase } from '@/config/supabase'

export interface CreateTodoInput {
    board_id: number;
    board_email_id: string;
    title: string;
    details?: string;
    priority?: 'low' | 'medium' | 'high';
    due_date?: Date;
}

export interface UpdateTodoInput {
    id: number;
    board_id: number;
    board_email_id: string;
    title?: string;
    details?: string;
    priority?: 'low' | 'medium' | 'high';
    due_date?: Date;
    completed?: boolean;
}

export interface Todo {
    id: number;
    board_id: number;
    board_email_id: string;
    title: string;
    details?: string;
    priority: 'low' | 'medium' | 'high';
    due_date?: Date;
    completed: boolean;
    created_at: Date;
    updated_at: Date;
}

export class TodoRepository {
    private readonly TODO_TABLE = 'email_todos'

    async createTodo(data: CreateTodoInput): Promise<Todo> {
        const { data: todo, error } = await supabase
            .from(this.TODO_TABLE)
            .insert(data)
            .select('*')
            .single()

        if (error) {
            console.error('Error creating todo:', error)
            throw error
        }

        return todo
    }

    async updateTodo(data: UpdateTodoInput): Promise<Todo> {
        const { id, ...updateData } = data
        const { data: todo, error } = await supabase
            .from(this.TODO_TABLE)
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        console.log('todo from updateTodo', todo)

        if (error) {
            console.error('Error updating todo:', error)
            throw error
        }

        return todo
    }

    async deleteTodo(id: number): Promise<void> {
        const { error } = await supabase
            .from(this.TODO_TABLE)
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting todo:', error)
            throw error
        }
    }

    async getTodosByEmailId(boardEmailId: string): Promise<Todo[]> {
        const { data: todos, error } = await supabase
            .from(this.TODO_TABLE)
            .select('*')
            .eq('board_email_id', boardEmailId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching todos:', error)
            throw error
        }

        return todos
    }

    async getTodoById(id: number): Promise<Todo | null> {
        const { data: todo, error } = await supabase
            .from(this.TODO_TABLE)
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') { // No rows returned
                return null
            }
            console.error('Error fetching todo:', error)
            throw error
        }

        return todo
    }

    async toggleTodoComplete(id: number): Promise<Todo> {
        // First get the current todo to toggle its completed status
        const currentTodo = await this.getTodoById(id)
        if (!currentTodo) {
            throw new Error('Todo not found')
        }

        const { data: todo, error } = await supabase
            .from(this.TODO_TABLE)
            .update({ completed: !currentTodo.completed })
            .eq('id', id)
            .select('*')
            .single()

        if (error) {
            console.error('Error toggling todo completion:', error)
            throw error
        }

        return todo
    }

    async getTodosByDueDate(startDate: Date, endDate: Date): Promise<Todo[]> {
        const { data: todos, error } = await supabase
            .from(this.TODO_TABLE)
            .select('*')
            .gte('due_date', startDate.toISOString())
            .lte('due_date', endDate.toISOString())
            .order('due_date', { ascending: true })

        if (error) {
            console.error('Error fetching todos by due date:', error)
            throw error
        }

        return todos
    }

    async getOverdueTodos(): Promise<Todo[]> {
        const now = new Date()
        const { data: todos, error } = await supabase
            .from(this.TODO_TABLE)
            .select('*')
            .lt('due_date', now.toISOString())
            .eq('completed', false)
            .order('due_date', { ascending: true })

        if (error) {
            console.error('Error fetching overdue todos:', error)
            throw error
        }

        return todos
    }
}