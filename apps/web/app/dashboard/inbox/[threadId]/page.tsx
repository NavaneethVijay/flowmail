"use client";

import EmailsDetails from "@/components/emails/emailsDetails";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { AddToProjectDialog } from "@/components/inbox/add-to-project-dialog";

export default function EmailDetailPage() {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAddToProjectOpen, setIsAddToProjectOpen] = useState(false);
  const { threadId } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!threadId) return;
    fetchEmailThread(threadId as string);
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

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/inbox")}
          className="flex items-center md:hidden"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inbox
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddToProjectOpen(true)}
          className="flex items-center ml-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add to Project
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-full space-y-3 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
            <p className="text-sm font-medium text-gray-600 animate-pulse">
              Fetching your email...
            </p>
          </div>
        </div>
      ) : (
        <EmailsDetails selectedEmail={selectedEmail} showSidebar={false} />
      )}

      <AddToProjectDialog
        open={isAddToProjectOpen}
        onOpenChange={setIsAddToProjectOpen}
        onSubmit={() => {}} // Add this prop
      />
    </div>
  );
}