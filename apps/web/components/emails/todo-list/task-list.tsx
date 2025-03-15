import { format } from "date-fns";
import { CalendarIcon, PencilIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Todo } from "."
// import { Todo } from "./todo-list"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TaskListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onSelect: (todo: Todo) => void;
}

export function TaskList({ todos, onToggle, onSelect}: TaskListProps) {
  return (
    <Accordion type="multiple" className="space-y-2">
      {todos.map((todo) => (
        <AccordionItem
          key={todo.id}
          value={todo.id}
          className={cn(
            "border rounded-lg px-4 bg-white",
            todo.completed && "bg-neutral-200"
          )}
        >
          <AccordionTrigger className="hover:no-underline flex-1 [&[data-state=open]>svg]:hidden [&>svg]:hidden flex flex-col items-start gap-2">
            <div className="flex items-start gap-4 w-full">
              <Checkbox
                className="mt-1"
                checked={todo.completed}
                onCheckedChange={() => onToggle(todo.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3
                    className={cn(
                      "font-medium text-left",
                      todo.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {todo.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3" />
                    {format(todo.dueDate, "MMM d, yyyy")}
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      todo.priority === "high" && "bg-red-100 text-red-700",
                      todo.priority === "medium" &&
                        "bg-yellow-100 text-yellow-700",
                      todo.priority === "low" && "bg-green-100 text-green-700"
                    )}
                  >
                    {todo.priority.charAt(0).toUpperCase() +
                      todo.priority.slice(1)}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(todo);
                }}
              >
                <PencilIcon className="h-4 w-4" />
                <span className="sr-only">Edit task</span>
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-border pt-2 pb-2">
            <p className="text-sm text-muted-foreground py-0">
              {todo.description}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
