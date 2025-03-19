"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Reply, ReplyAll, Forward, MoreHorizontal, Star, Trash } from 'lucide-react'
import { format } from "date-fns";
import EmailsDetails from "@/components/emails/emailsDetails";
import type { Email } from "./email-list";

interface EmailDetailProps {
  threadId?: string | null;
}

export default function EmailDetail({ threadId }: EmailDetailProps) {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!threadId) return;
    fetchEmailThread(threadId);
  }, [threadId]);

  const fetchEmailThread = async (threadId: string) => {
    setLoading(true);
    try {
      const emailData = await fetch(`/api/emails/${threadId}`).then((res) =>
        res.json()
      );
      setSelectedEmail(emailData);
    } catch (error) {
      console.error("Failed to fetch email thread:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!threadId || !selectedEmail) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select an email to view details
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading...
      </div>
    );
  }

  return <EmailsDetails selectedEmail={selectedEmail} showSidebar={false} />;
}
