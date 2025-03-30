"use client";

import EmailsDetails from "@/components/emails/emailsDetails";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useKanbanStore } from "@/store/use-kanban-store";
import { PageLayout } from "@/components/PageLayout";

export default function EmailViewPage() {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const { threadId } = useParams();
  const kanbanEmail = useKanbanStore((state) => state.selectedKanbanEmail);

  useEffect(() => {
    if (!threadId) return;
    fetchEmailThread(threadId as string);
  }, [threadId]);

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

  if (!selectedEmail) return null;

  return (
    <PageLayout title="View Email">
      <EmailsDetails selectedEmail={selectedEmail} kanbanEmail={kanbanEmail} isBoard />
    </PageLayout>
  );
}
