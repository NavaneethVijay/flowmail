import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TodoList from "@/components/emails/todo-list";
import EmailThread from "@/components/emails/emailThread";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EmailsDetailsProps {
  selectedEmail: any;
  showSidebar?: boolean;
  kanbanEmail?: any;
}

export default function EmailsDetails({
  selectedEmail,
  showSidebar = true,
  kanbanEmail,
}: EmailsDetailsProps) {
  if (!selectedEmail) {
    return (
      <div className="flex flex-col md:flex-row">
        <Skeleton className="h-[calc(90vh-2rem)] w-full" />
        loading...
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row">
      {showSidebar && (
        <div className="w-full md:w-1/4 space-y-4 pl-4 overflow-hidden ">
          <ScrollArea className="h-[calc(90vh-2rem)] pr-4">
            <TodoList boardEmailId={kanbanEmail.id} />
          </ScrollArea>
        </div>
      )}
      <div
        className={cn(
          "space-y-4 pl-4 bg-white rounded-lg",
          showSidebar ? "w-full md:w-1/2" : "w-full"
        )}
      >
        <ScrollArea className="h-[calc(90vh-2rem)] pr-4">
          <EmailThread emails={selectedEmail} />
        </ScrollArea>
      </div>
    </div>
  );
}
