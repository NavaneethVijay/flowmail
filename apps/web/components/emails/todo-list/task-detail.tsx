import { motion } from "framer-motion"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeft } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Todo } from "."
// import { Todo } from "./todo-list"

interface TaskDetailProps {
  todo: Todo
  onUpdate: (todo: Todo) => void
  onBack: () => void
}

export function TaskDetail({ todo, onUpdate, onBack }: TaskDetailProps) {
  return (
    <div className="max-w-3xl mx-auto p-6 h-full flex flex-col">
      <Button variant="ghost" onClick={onBack} className="self-start mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
      </Button>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="flex-1 p-4 border rounded-lg space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{todo.title}</h2>
          <span className={cn(
            "text-sm px-2 py-1 rounded-full",
            todo.priority === "high" && "bg-red-100 text-red-700",
            todo.priority === "medium" && "bg-yellow-100 text-yellow-700",
            todo.priority === "low" && "bg-green-100 text-green-700"
          )}>
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={(checked) => onUpdate({ ...todo, completed: checked as boolean })}
          />
          <span className={cn(todo.completed && "line-through text-muted-foreground")}>
            {todo.completed ? "Completed" : "Mark as complete"}
          </span>
        </div>
        <p className="text-muted-foreground">{todo.details}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          Due: {format(todo.due_date, "PPP")}
        </div>
      </motion.div>
    </div>
  )
}
