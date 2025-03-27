import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TodoList from "@/components/emails/todo-list";
import EmailThread from "@/components/emails/emailThread";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface EmailsDetailsProps {
  selectedEmail: any;
  isInbox?: boolean;
  kanbanEmail?: any;
}

interface SummaryData {
  summary?: {
    summary: string;
    actionItems: string[];
  };
  isLoading: boolean;
  error?: string;
}

function parseInput(input: string) {
  const summaryMatch = input.match(
    /\*\*Summary:\*\*\s*([\s\S]*?)\s*\*\*Action Items:\*\*/
  );
  const actionItemsMatch = input.match(/\*\*Action Items:\*\*\s*([\s\S]*)/);

  return {
    summary: summaryMatch ? summaryMatch[1].trim() : "",
    actionItems: actionItemsMatch
      ? actionItemsMatch[1]
          .split(/\n\*\s+/) // Split on newlines followed by "* " (list items)
          .map((item) => item.replace(/^\*\s*/, "").trim()) // Remove the "* " from the start
          .filter((item) => item !== "") // Remove empty items
      : [],
  };
}

function renderTextWithLinks(text: string) {
  const linkRegex = /<https?:\/\/[^\s<>]+>/g;
  return text.split(linkRegex).reduce((acc, part, index, array) => {
    acc.push(<span key={`text-${index}`}>{part}</span>);
    if (index < array.length - 1) {
      const match = text.match(linkRegex);
      if (match && match[index]) {
        acc.push(
          <a
            key={`link-${index}`}
            href={match[index].slice(1, -1)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {match[index].slice(1, -1)}
          </a>
        );
      }
    }
    return acc;
  }, []);
}

export default function EmailsDetails({
  selectedEmail,
  isInbox = false,
  kanbanEmail,
}: EmailsDetailsProps) {
  console.log(selectedEmail);
  console.log(kanbanEmail);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    isLoading: false,
  });

  const fetchSummary = async (threadId: string) => {
    setSummaryData({ isLoading: true });
    try {
      const response = await fetch(`/api/emails/summarize/${threadId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const data = await response.json();
      console.log("data from api", data);
      const parsedData = parseInput(data.summary.summary);
      setSummaryData({ summary: parsedData, isLoading: false });
    } catch (error) {
      setSummaryData({
        error: "Failed to load summary",
        isLoading: false,
      });
    }
  };

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
        <ScrollArea className="h-[calc(90vh-2rem)]">
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
          <TabsTrigger value="summary" className="flex-1">
            Summary
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
        <TabsContent value="summary">
          <ScrollArea className="h-[calc(90vh-2rem)] pr-4">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Summary</h1>
                <Button
                  variant="shine"
                  onClick={() =>
                    selectedEmail?.[0]?.threadId &&
                    fetchSummary(selectedEmail[0].threadId)
                  }
                  disabled={summaryData.isLoading}
                >
                  {summaryData.isLoading ? (
                    "Summarizing..."
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Summarize
                    </>
                  )}
                </Button>
              </div>
              {summaryData.isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : summaryData.summary ? (
                <p className="text-sm text-muted-foreground">
                  {renderTextWithLinks(summaryData.summary?.summary || "")}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click summarize to generate a summary
                </p>
              )}
              <h1 className="text-2xl font-bold mt-4">Action Items</h1>
              {summaryData.isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : summaryData.summary?.actionItems?.length ? (
                <ul className="text-sm text-muted-foreground list-disc">
                  {summaryData.summary?.actionItems?.map(
                    (item: string, index: number) => (
                      <li className="ml-4 my-2" key={index}>
                        {renderTextWithLinks(item)}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No action items available
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
