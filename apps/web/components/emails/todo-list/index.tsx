"use client";

import { useState, useEffect } from "react";
import { TaskList } from "./task-list";
import { TaskForm } from './task-form'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export interface Todo {
  id?: string;
  board_email_id: string;
  title: string;
  details: string;
  due_date: string;
  priority: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

interface TodoListProps {
  boardEmailId: string;
}

export default function TodoList({ boardEmailId }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch todos when component mounts
  useEffect(() => {
    fetchTodos();
  }, [boardEmailId]);

  const fetchTodos = async () => {
    try {
        setIsLoading(true);
        const response = await fetch(`/api/todos/email/${boardEmailId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data);
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to load todos",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
};

  console.log('boardEmailId', boardEmailId);

  const addTodo = async (todoData: Omit<Todo, 'id' | 'board_email_id'>) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todoData,
          board_email_id: boardEmailId,
        }),
      });
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create todo",
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos(todos.filter((todo) => todo.id !== id));
      setSelectedTodo(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  const updateTodo = async (updatedTodo: Todo) => {
    try {
      const response = await fetch(`/api/todos/${updatedTodo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      setSelectedTodo(null);
    } catch (error) {
      console.error('error', error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}/toggle`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to toggle todo');
      const updatedTodo = await response.json();
      setTodos(
        todos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      toast({
        title: "Success",
        description: "Updated your task!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle todo completion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-2">
      <div className="flex justify-between items-center border-b border-border pb-4 mb-4">
        <h2 className="text-2xl font-medium ">Things to do</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="focus-visible:ring-0">Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              onSubmit={addTodo}
              onCancel={() => setIsDialogOpen(false)}
              onDelete={(id) => {
                console.log('callcancelled');
                deleteTodo(id)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <TaskList
        todos={todos}
        onToggle={toggleTodo}
        onSelect={setSelectedTodo}
      />
      {selectedTodo && (
        <Dialog
          open={!!selectedTodo}
          onOpenChange={(open) => !open && setSelectedTodo(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              onDelete={(id) => {
                console.log('callcancelled');
                deleteTodo(id)
              }}
              initialValues={selectedTodo}
              onSubmit={updateTodo}
              onCancel={() => setSelectedTodo(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
