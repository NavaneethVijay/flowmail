"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Todo } from "."
// import { Todo } from "./task-list"

interface TaskFormProps {
  onSubmit: (todo: Todo) => void
  onCancel: () => void
  onDelete: (id: string) => void
  initialValues?: Todo
}

export function TaskForm({ onSubmit, onCancel, onDelete, initialValues }: TaskFormProps) {
  const [todo, setTodo] = useState<Partial<Todo>>({
    title: "",
    details: "",
    due_date: new Date().toISOString().split('T')[0],
    priority: "medium",
    completed: false
  })

  useEffect(() => {
    if (initialValues) {
      setTodo(initialValues)
    }
  }, [initialValues])

  const handleSubmit = () => {
    if (!todo.title || !todo.due_date) {
      return
    }

    const newTodo: Todo = {
      board_email_id: initialValues?.board_email_id || "",
      title: todo.title,
      details: todo.details || "",
      due_date: todo.due_date,
      priority: todo.priority || "medium",
      completed: todo.completed || false
    }

    onSubmit(newTodo)
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Task name here..."
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />

      <Textarea
        placeholder="Description"
        value={todo.details}
        onChange={(e) => setTodo({ ...todo, details: e.target.value })}
      />

      <div className="flex flex-wrap gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !todo.due_date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {todo.due_date ? format(new Date(todo.due_date), "PPP") : "Due Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={new Date(todo.due_date || "")}
              onSelect={(date) => setTodo({ ...todo, due_date: date?.toISOString().split('T')[0] || "" })}
            />
          </PopoverContent>
        </Popover>

        <Select
          value={todo.priority}
          onValueChange={(value) => setTodo({ ...todo, priority: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        {initialValues ? (
          <Button
            variant="destructive"
            onClick={() => onDelete(initialValues.id || "")}
          >
            Delete Task
          </Button>
        ) : (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit}>
          {initialValues ? "Update Task" : "Add Task"}
        </Button>
      </div>
    </div>
  )
}
