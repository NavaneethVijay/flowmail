"use client";

import * as React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import EmailList from "@/components/inbox/email-list";
import { PageLayout } from "@/components/PageLayout";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function InboxLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const threadId = params.threadId;

  return (
    <PageLayout title="Inbox">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-100vh max-h-100vh"
      >
        {/* Hide email list on mobile when viewing an email */}
        <ResizablePanel
          defaultSize={40}
          className={cn(
            threadId ? 'hidden md:block' : 'block'
          )}
        >
          {/* we can remove this as we route it  */}
          <EmailList onEmailSelect={() => {}} />
        </ResizablePanel>
        <ResizableHandle className="hidden md:block" />
        <ResizablePanel
          defaultSize={60}
          className={cn(
            threadId ? 'block w-full' : 'hidden md:block'
          )}
        >
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </PageLayout>
  );
}