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

export default function InboxMain() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-100vh max-h-100vh rounded-lg border"
    >
      <ResizablePanel defaultSize={40}>
        <EmailList />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70}>
            <EmailDetail />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30}>
            <EmailReply />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
