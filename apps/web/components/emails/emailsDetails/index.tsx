import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TodoList from "@/components/emails/todo-list";
import EmailThread from "@/components/emails/emailThread";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface EmailsDetailsProps {
  selectedEmail: any;
  isInbox?: boolean;
  kanbanEmail?: any;
}

export default function EmailsDetails({
  selectedEmail,
  isInbox = false,
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
  if (isInbox) {
    return (
      <div>
        <ScrollArea className="h-[calc(90vh-2rem)] pr-4">
          <EmailThread emails={selectedEmail} />
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Tabs defaultValue="emailThread" className="w-full">
        <TabsList className="flex w-full">
          <TabsTrigger value="emailThread" className="flex-1">
            Emails
          </TabsTrigger>
          <TabsTrigger value="todoList" className="flex-1">
            Todo List
          </TabsTrigger>
        </TabsList>
        <TabsContent value="emailThread">
          <ScrollArea className="h-[calc(90vh-2rem)] pr-4">
            <EmailThread emails={selectedEmail} />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="todoList">
          <ScrollArea className="h-[calc(90vh-2rem)] pr-4">
            <TodoList boardEmailId={kanbanEmail.id} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
