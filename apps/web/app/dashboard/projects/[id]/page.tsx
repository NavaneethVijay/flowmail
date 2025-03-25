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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import EmailsDetails from "@/components/emails/emailsDetails";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon, NotebookText } from "lucide-react";
import { ProjectSettingsSheet } from "@/components/projects/project-details";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";

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

  const [selectedEmail, setSelectedEmail] = useState<Email[] | null>(null);
  const [selectedKanbanEmail, setSelectedKanbanEmail] = useState<Email | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { open: sidebarOpen, isMobile, openMobile } = useSidebar();
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

      // Sort board_columns by position
      const sortedBoardColumns = [...board_columns].sort(
        (a, b) => a.position - b.position
      );

      const data = await fetch(
        `/api/projects/${boardInfo.id}/email?forceRefresh=${forceRefresh}`
      ).then((res) => res.json());

      const { emails } = data;
      setUniqueEmails(extractUniqueEmails(emails));
      const columnTypeMap = sortedBoardColumns.reduce(
        (acc: Record<number, string>, col: BoardColumn) => {
          acc[col.id] = col.type.toLowerCase();
          return acc;
        },
        {}
      );

      const formattedColumns = sortedBoardColumns.reduce(
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

  const fetchEmailThread = async (email: Email) => {
    try {
      const emailData = await fetch(`/api/emails/${email.thread_id}`).then(
        (res) => res.json()
      );
      setSelectedEmail(emailData);
    } catch (error) {
      console.error("Failed to fetch email thread:", error);
    }
  };

  const handleItemClick = async (email: Email) => {
    console.log("email from kaban", email);
    setIsModalOpen(true);
    setSelectedKanbanEmail(email);
    await fetchEmailThread(email);
    window.history.pushState(null, '', `#email-${email.id}`);
  };

  const handleSheetClose = () => {
    setIsModalOpen(false);
    window.history.pushState(null, '', window.location.pathname);
  };

  // Add function to fetch email by ID
  const fetchEmailById = async (emailId: string) => {
    const email = board?.emails?.find(e => e.id === emailId);
    if (email) {
      setSelectedKanbanEmail(email);
      await fetchEmailThread(email);
      setIsModalOpen(true);
    }
  };

  // Update the useEffect that handles hash
  useEffect(() => {
    const handlePopState = () => {
      if (!window.location.hash) {
        setIsModalOpen(false);
      }
    };

    const initializeFromHash = async () => {
      const hash = window.location.hash;
      if (hash.startsWith('#email-') && board?.emails) {
        const emailId = hash.replace('#email-', '');
        await fetchEmailById(emailId);
      }
    };

    // Only check hash after board data is loaded
    if (board) {
      initializeFromHash();
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [board]); // Add board as dependency

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
      console.log("columnsArray", columnsArray);

      throttledUpdateColumns(columnsArray as BoardColumn[]);
    },
    [updateColumns, throttledUpdateColumns, board?.id]
  );

  useEffect(() => {
    fetchData();
  }, []);

  console.log("selectedEmail", selectedEmail);

  return (
    <PageLayout
      title={board?.name}
      actions={
        <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
          {/* @ts-ignore */}
          <NotebookText className="w-4 h-4" />
          <span className="hidden sm:block ml-2">View Board</span>
        </Button>
      }
    >
      <div className="flex flex-col">
        <ScrollArea>
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

      <Sheet open={isModalOpen && selectedEmail !== null} onOpenChange={handleSheetClose}>
        <SheetContent
          side="right"
          className="w-[100vw] sm:w-[40vw] sm:max-w-[40vw]"
        >
          <SheetHeader>
            {selectedEmail ? (
              <>
                <SheetTitle>{selectedEmail[0]?.subject}</SheetTitle>
                <SheetDescription>{selectedEmail[0]?.snippet}</SheetDescription>
              </>
            ) : (
              <Skeleton className="w-full h-12" />
            )}
          </SheetHeader>
          <div className="mt-4">
            {selectedEmail && (
              <EmailsDetails
                selectedEmail={selectedEmail}
                kanbanEmail={selectedKanbanEmail}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <ProjectSettingsSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        board={board}
        onSync={handleSync}
        isSyncing={isSyncing}
        uniqueEmails={uniqueEmails}
      />
    </PageLayout>
  );
}
