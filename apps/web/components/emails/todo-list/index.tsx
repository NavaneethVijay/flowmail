"use client";

import { useState } from "react";
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

export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      title: "Complete Project Proposal",
      description: "Draft and submit the Q2 project proposal",
      dueDate: new Date("2024-04-15"),
      priority: "high",
      completed: false,
    },
    {
      id: "2",
      title: "Review Code PRs",
      description: "Review pending pull requests from the team",
      dueDate: new Date("2024-04-10"),
      priority: "medium",
      completed: true,
    },
    {
      id: "3",
      title: "Update Documentation",
      description: "Update API documentation with new endpoints",
      dueDate: new Date("2024-04-20"),
      priority: "low",
      completed: false,
    },
    {
        id: "4",
        title: "Update Documentation",
        description: "Update API documentation with new endpoints",
        dueDate: new Date("2024-04-20"),
        priority: "low",
        completed: false,
      },
      {
        id: "5",
        title: "Update Documentation",
        description: "Update API documentation with new endpoints",
        dueDate: new Date("2024-04-20"),
        priority: "low",
        completed: false,
      },
  ]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addTodo = (todo: Todo) => {
    setTodos([...todos, todo]);
    setIsDialogOpen(false);
  };

  const deleteTodo = (id: string) => {
    console.log("deleting todo", id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(
      todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
    setSelectedTodo(null);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
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
