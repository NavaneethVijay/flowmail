import { format } from "date-fns";
import { CalendarIcon, PencilIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Todo } from "."
// import { Todo } from "./todo-list"

interface TaskListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onSelect: (todo: Todo) => void;
}

export function TaskList({ todos, onToggle, onSelect }: TaskListProps) {
  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-4 flex-1">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => onToggle(todo.id || "")}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className={cn(
                  "font-medium",
                  todo.completed && "line-through text-muted-foreground"
                )}>
                  {todo.title}
                </h3>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  todo.priority === "high" && "bg-red-100 text-red-700",
                  todo.priority === "medium" && "bg-yellow-100 text-yellow-700",
                  todo.priority === "low" && "bg-green-100 text-green-700"
                )}>
                  {todo.priority}
                </span>
              </div>
              {todo.details && (
                <p className="text-sm text-muted-foreground mt-1">
                  {todo.details}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3" />
                <span>Due: {format(new Date(todo.due_date), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => onSelect(todo)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {todos.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No tasks yet. Add one to get started!
        </div>
      )}
    </div>
  );
}
