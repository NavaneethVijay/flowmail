"use client";

import * as React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import EmailList from "@/components/inbox/email-list";
import EmailDetail from "@/components/inbox/email-detail";
import EmailReply from "@/components/inbox/email-reply";
import { PageLayout } from "@/components/PageLayout";

export default function InboxMain() {
  const [selectedThreadId, setSelectedThreadId] = React.useState<string | null>(
    null
  );

  return (
    <PageLayout title="Inbox">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-100vh max-h-100vh rounded-lg border"
      >
        <ResizablePanel defaultSize={40}>
          <EmailList
            onEmailSelect={(threadId: string) => setSelectedThreadId(threadId)}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <EmailDetail threadId={selectedThreadId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </PageLayout>
  );
}
