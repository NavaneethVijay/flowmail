import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TodoList from "@/components/emails/todo-list";
import EmailThread from "@/components/emails/emailThread";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface EmailsDetailsProps {
  selectedEmail: any;
  isInbox?: boolean;
  kanbanEmail?: any;
  isBoard?: boolean;
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
    // @ts-ignore
    acc.push(<span key={`text-${index}`}>{part}</span>);
    if (index < array.length - 1) {
      const match = text.match(linkRegex);
      if (match && match[index]) {
        acc.push(
          // @ts-ignore
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
  isBoard = false,
}: EmailsDetailsProps) {
  console.log(selectedEmail);
  console.log(kanbanEmail);

  const [summaryData, setSummaryData] = useState<SummaryData>({
    isLoading: false,
  });
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const fetchSummary = async (threadId: string) => {
    console.log("fetching summary");
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

  useEffect(() => {
    if (isDrawerOpen) {
      fetchSummary(selectedEmail[0].threadId);
    }
  }, [isDrawerOpen]);

  if (!selectedEmail) {
    return (
      <div className="flex flex-col md:flex-row">
        <Skeleton className="h-[calc(90vh-2rem)] w-full" />
        loading...
      </div>
    );
  }

  if (isBoard) {
    return (
      <div className="px-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-2">
            <AccordionTrigger>Manage tasks</AccordionTrigger>
            <AccordionContent>
              <TodoList boardEmailId={kanbanEmail.id} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <ScrollArea className="h-[calc(90vh-2rem)]">
          <EmailThread emails={selectedEmail} />
        </ScrollArea>
        <Button
          className="fixed bottom-6 right-6 shadow-lg"
          variant="shine"
          onClick={() => setDrawerOpen(true)}
        >
          <Wand2 className="w-4 h-4 mr-2" /> Summarize
        </Button>
        <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 shadow-lg"
              variant="shine"
            >
              <Wand2 className="w-4 h-4 mr-2" /> Summarize
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <ScrollArea className="overflow-y-auto h-full">
              <DrawerHeader>
                <DrawerTitle>Summary</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                <div className="mt-4">
                  {summaryData.isLoading ? (
                    <Skeleton className="h-4 w-full" />
                  ) : (
                    summaryData.summary?.summary || "No summary available"
                  )}
                </div>
                <h1 className="text-2xl font-bold mt-4">Action Items</h1>
                {summaryData.isLoading ? (
                  <Skeleton className="h-4 w-full" />
                ) : summaryData.summary?.actionItems?.length ? (
                  <ul className="text-sm text-muted-foreground list-disc ml-4">
                    {summaryData.summary?.actionItems?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No action items available
                  </p>
                )}
              </div>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
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
    <div className="grid grid-cols-12 gap-4 h-[90vh] ">
      {/* Todo List Column */}
      <div className="col-span-3 overflow-y-auto px-4 bg-primary/5 rounded-lg">
        <TodoList boardEmailId={kanbanEmail.id} />
      </div>

      {/* Emails Column */}
      <div className="col-span-6 overflow-y-auto pr-4">
        <ScrollArea className="h-full">
          <EmailThread emails={selectedEmail} />
        </ScrollArea>
      </div>

      {/* Summary Column */}
      <div className="col-span-3 overflow-y-auto bg-primary/5 rounded-lg">
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
      </div>
    </div>
  );
}
