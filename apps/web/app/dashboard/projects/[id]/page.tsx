"use client";

import React from "react";
import { useKanbanStore } from "@/store/use-kanban-store";
import Kanban from "@/components/kanban";
import { useState, useEffect, useCallback } from "react";
import EmailCard from "@/components/kanban/EmailCard";
import { Button } from "@/components/ui/button";
import throttle from "lodash/throttle";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import EmailsDetails from "@/components/emails/emailsDetails";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon, NotebookText } from "lucide-react";
import { ProjectSettingsSheet } from "@/components/projects/project-details";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

// Define types
export interface Email {
  email_id: string;
  id: string;
  thread_id: string;
  subject: string;
  column_id?: number;
  from: string;
  to: string[];
  date: string;
  snippet: string;
  body: string;
  labels: {
    starred: boolean;
    important: boolean;
    inbox: boolean;
    sent: boolean;
    draft: boolean;
    spam: boolean;
    trash: boolean;
    unread: boolean;
  };
  rawLabels: string[];
}

export interface BoardColumn {
  id: number;
  type: string;
  title: string;
  board_id: number;
  position: number;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  itemIds?: string[];
}

export default function ProjectBoard() {
  const params = useParams();
  const { id: boardSlug } = params;
  const {
    board,
    isLoading,
    isSyncing,
    initializeBoard,
    updateColumns,
    setLoading,
    setSyncing,
  } = useKanbanStore();

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { open: sidebarOpen } = useSidebar();
  const [uniqueEmails, setUniqueEmails] = useState<string[]>([]);

  function extractUniqueEmails(data: { from: string; to: string }[]): string[] {
    const emailSet = new Set<string>();

    const extractEmails = (text: string) => {
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const emails = text.match(emailRegex);
      if (emails) {
        emails.forEach((email) => emailSet.add(email));
      }
    };

    data.forEach((item) => {
      extractEmails(item.from);
      extractEmails(item.to);
    });

    return Array.from(emailSet);
  }

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const boardData = await fetch(`/api/projects/${boardSlug}`).then((res) =>
        res.json()
      );
      const { board: boardInfo, board_columns } = boardData;

      const data = await fetch(
        `/api/projects/${boardInfo.id}/email?forceRefresh=${forceRefresh}`
      ).then((res) => res.json());

      const { emails } = data;
      setUniqueEmails(extractUniqueEmails(emails));
      const columnTypeMap = board_columns.reduce(
        (acc: Record<number, string>, col: BoardColumn) => {
          acc[col.id] = col.type.toLowerCase();
          return acc;
        },
        {}
      );

      const formattedColumns = board_columns.reduce(
        (acc: Record<string, BoardColumn>, column: BoardColumn) => {
          acc[column.type.toLowerCase()] = {
            ...column,
            itemIds: [],
          };
          return acc;
        },
        {}
      );

      emails.forEach((email: Email) => {
        const columnType = columnTypeMap[email?.column_id || 0];
        if (columnType && formattedColumns[columnType]) {
          formattedColumns[columnType].itemIds.push(String(email.id));
        } else {
          const firstColumnType =
            board_columns[0]?.type.toLowerCase() || "todo";
          formattedColumns[firstColumnType].itemIds.push(String(email.id));
        }
      });

      initializeBoard(boardInfo.id, {
        ...boardInfo,
        columns: formattedColumns,
        emails,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    await fetchData(true);
    toast({
      title: "Success",
      description: "Emails synced successfully",
      duration: 1000,
    });
    setIsSettingsOpen(false);
    setSyncing(false);
  };

  const fetchEmailThread = async (threadId: string) => {
    try {
      const emailData = await fetch(`/api/emails/${threadId}`).then((res) =>
        res.json()
      );
      console.log("emailData", emailData);
      setSelectedEmail(emailData);
    } catch (error) {
      console.error("Failed to fetch email thread:", error);
    }
  };

  const handleItemClick = async (email: Email) => {
    setIsModalOpen(true);
    await fetchEmailThread(email.thread_id);
  };

  const throttledUpdateColumns = useCallback(
    throttle(async (columns: BoardColumn[]) => {
      if (!board) return;
      try {
        const res = await fetch(`/api/projects/${board.id}/columns`, {
          method: "POST",
          body: JSON.stringify({ boardId: board.id, columns }),
        });
        if (res.ok) {
          toast({
            title: "Success",
            description: "Board columns updated successfully",
            duration: 1000,
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update board columns",
            variant: "destructive",
            duration: 1000,
          });
        }
      } catch (error) {
        console.error("Failed to update board columns:", error);
        toast({
          title: "Error",
          description: "Failed to update board columns",
          variant: "destructive",
          duration: 1000,
        });
      }
    }, 1000),
    [toast, board?.id]
  );

  const handleColumnUpdate = useCallback(
    (newColumns: Record<string, BoardColumn>) => {
      updateColumns(newColumns);

      const columnsArray = Object.values(newColumns).map((column) => ({
        id: column.id,
        board_id: Number(board?.id),
        title: column.title,
        position: column.position,
        itemIds: column.itemIds,
        type: column.type,
        settings: column.settings,
      }));

      throttledUpdateColumns(columnsArray as BoardColumn[]);
    },
    [updateColumns, throttledUpdateColumns, board?.id]
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex justify-between items-center py-4 border-b border-neutral-200 w-[calc(100vw-20rem)]">
          <div className="flex w-4/12 items-center gap-4 pl-4">
            {isLoading || !board ? (
              <Skeleton className="w-40 h-8 block" />
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/dashboard/projects">
                  <Button variant="ghost" size="icon">
                    <ArrowLeftIcon className="w-6 h-6 text-muted-foreground" />
                    <span className="hidden">Back</span>
                  </Button>
                </Link>
                <h1 className="text-2xl font-medium inline-flex items-center gap-2">
                  {board?.name}
                </h1>
              </div>
            )}
          </div>
          <div className="w-5/12">
            <Input
              className="w-full"
              type="text"
              placeholder="Search for emails"
            />
          </div>
          <div className="w-3/12 pr-10 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
              <NotebookText className="w-4 h-4" />
              <span className="ml-2">View Board</span>
            </Button>
          </div>
        </div>

        <ScrollArea
          className={cn(
            "max-w-[100vw]",
            sidebarOpen ? "w-[calc(100vw-20rem)]" : ""
          )}
        >
          {isLoading || !board ? (
            <Skeleton className="w-1/4" />
          ) : (
            <Kanban<Email>
              data={board.emails || []}
              columns={board.columns || {}}
              renderItem={(email) => <EmailCard email={email} />}
              onColumnUpdate={handleColumnUpdate}
              onItemClick={handleItemClick}
            />
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[80vw] w-[80vw] h-[90vh] px-0 pt-4 bg-neutral-100">
          <DialogHeader className="hidden">
            <DialogTitle>Email Details</DialogTitle>
            <DialogDescription>View email details here.</DialogDescription>
          </DialogHeader>
          <EmailsDetails selectedEmail={selectedEmail} />
        </DialogContent>
      </Dialog>

      <ProjectSettingsSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        board={board}
        onSync={handleSync}
        isSyncing={isSyncing}
        uniqueEmails={uniqueEmails}
      />
    </div>
  );
}
