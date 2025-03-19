"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { AddToProjectDialog } from "@/components/inbox/add-to-project-dialog";
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Calendar as CalendarIcon,
  PlusCircle,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useModal } from "@/context/ModalContext";
import { AddProject } from "@/components/projects/AddProject";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatEmailDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Sample data
const recentProjects = [
  { name: "Client A Project", emails: 45, progress: 75 },
  { name: "Marketing Campaign", emails: 32, progress: 60 },
  { name: "Product Launch", emails: 28, progress: 85 },
  { name: "Support Tickets", emails: 15, progress: 40 },
];

const quickActions = [
  { title: "New Project", icon: FolderKanban, color: "text-blue-500" },
  { title: "Add to Project", icon: PlusCircle, color: "text-green-500" },
  { title: "Star Important", icon: CheckCircle2, color: "text-yellow-500" },
  { title: "Archive Old", icon: AlertCircle, color: "text-gray-500" },
];

interface Email {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
}

function parseEmailString(emailStr: string) {
  const match = emailStr.match(/(.*?)\s*<(.+?)>/);
  if (match) {
    return {
      displayName: match[1].trim(),
      email: match[2].trim(),
    };
  }
  return {
    displayName: emailStr,
    email: emailStr,
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [recentEmails, setRecentEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isAddToProjectOpen, setIsAddToProjectOpen] = useState(false);
  const { toast } = useToast();

  const handleNewProject = () => {
    openModal({
      title: "Create a Project",
      description: "Create a new project to manage your emails.",
      content: (
        <AddProject
          onSuccess={() => {
            closeModal();
            router.refresh();
          }}
          onClose={closeModal}
        />
      ),
      actions: null,
    });
  };

  const handleAddToProject = (email: Email) => {
    setSelectedEmail(email);
    setIsAddToProjectOpen(true);
  };

  const handleProjectSelect = async (projectId: number) => {
    if (!selectedEmail) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/emails`, {
        method: "POST",
        body: JSON.stringify({
          email_id: selectedEmail.id,
          thread_id: selectedEmail.threadId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add email to project");
      }

      toast({
        title: "Success",
        description: "Email added to project successfully!",
      });
    } catch (error) {
      console.error("Error adding email to project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add email to project. Please try again.",
      });
    }
  };

  useEffect(() => {
    const fetchEmails = async (pageToken: string | null = null) => {
      try {
        const res = await fetch(`/api/emails?pageToken=${pageToken || ""}`);
        const data = await res.json();
        setRecentEmails(data.emails.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch emails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your overview.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Left Column - Actions, Activity, and Projects */}
        <div className="col-span-5 space-y-4">
          {/* Quick Actions and Recent Activity Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Quick Actions */}
            <Card className="h-[330px]">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <Button
                      key={action.title}
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center space-y-2"
                      onClick={() => {
                        if (action.title === "New Project") {
                          handleNewProject();
                        } else if (action.title === "Add to Project" && recentEmails.length > 0) {
                          handleAddToProject(recentEmails[0]);
                        }
                      }}
                    >
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                      <span className="text-sm">{action.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Emails */}
            <Card className="h-[330px]">
              <CardHeader>
                <CardTitle>Recent Emails</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start space-x-4">
                          <div className="mt-1">
                            <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentEmails.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">
                      No recent emails
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentEmails.map((email) => {
                        const { displayName, email: emailAddress } =
                          parseEmailString(email.from);
                        return (
                          <div
                            key={email.id}
                            className="flex items-start space-x-4 group cursor-pointer hover:bg-muted/50 p-2 rounded-md"
                            onClick={() => handleAddToProject(email)}
                          >
                            <div className="mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${email.from}`}
                                  alt={displayName}
                                />
                                <AvatarFallback>
                                  {displayName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium">
                                  {displayName}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {email.subject}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatEmailDate(email.date)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Project Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Project Overview</CardTitle>
              <Link href="/dashboard/projects">
                <Button variant="ghost" className="text-sm">
                  View all Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{project.name}</span>
                      </div>
                      <Badge variant="secondary">{project.emails} emails</Badge>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Calendar */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <AddToProjectDialog
        open={isAddToProjectOpen}
        onOpenChange={setIsAddToProjectOpen}
        onSubmit={handleProjectSelect}
      />
    </div>
  );
}
