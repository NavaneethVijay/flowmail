import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TodoList from "@/components/emails/todo-list";
import EmailThread from "@/components/emails/emailThread";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmailsDetails({
  selectedEmail,
}: {
  selectedEmail: any;
}) {
  if (!selectedEmail) {
    return (
      <div>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 space-y-4 pl-4 overflow-hidden">
            <ScrollArea className="h-[calc(90vh-2rem)] pr-4">
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="w-full md:w-1/2 space-y-4 pl-4 pt-4 bg-white rounded-lg">
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="w-full md:w-1/4 space-y-4 border-r border-border px-4">
            <div className="border-b border-border pb-4 mt-4 mb-4">
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 space-y-4 pl-4 overflow-hidden ">
          <ScrollArea className="h-[calc(90vh-2rem)] pr-4">
            <TodoList />
          </ScrollArea>
        </div>
        <div className="w-full md:w-1/2 space-y-4  pl-4 bg-white rounded-lg">
          <ScrollArea className="h-[calc(90vh-2rem)] pr-4">
            <EmailThread emails={selectedEmail} />
          </ScrollArea>
        </div>
        <div className="w-full md:w-1/4 space-y-4 border-r border-border px-4">
          <div className="border-b border-border pb-4 mt-4 mb-4">
            <h2 className="text-2xl font-medium ">Summary</h2>
          </div>
          Legend: A productivity application designed to integrate various tools
          into a single platform, enhancing task management and organization.
          Users can access their inbox, calendar, tasks, and more within Legend.
          LEGEND VML: An international marketing and communications company
          specializing in brand experience, commerce, and customer experience.
          VML was formed from the merger of Wunderman Thompson and VMLY&R and is
          a subsidiary of WPP plc.
        </div>
      </div>
    </div>
  );
}
