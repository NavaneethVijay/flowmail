"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AddToProjectDialog } from "@/components/inbox/add-to-project-dialog";
import { KeywordsGraph } from "@/components/dashboard/widgets/KeywordsGraph";
import {
  FolderKanban,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
import { AddProject } from "@/components/projects/AddProject";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatEmailDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useProjectsStore } from "@/store/use-projects-store";
import { PageLayout } from "@/components/PageLayout";

import ResponseTimeChart from "@/components/dashboard/widgets/ResponseTime";
import { CategoryChart } from "@/components/dashboard/widgets/CategoryChart";

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
  const [recentEmails, setRecentEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isAddToProjectOpen, setIsAddToProjectOpen] = useState(false);
  const { toast } = useToast();
  const { projects } = useProjectsStore();

  // Get only the 4 most recent projects
  const recentProjects = projects.slice(0, 4).map((project) => ({
    name: project.name,
    emails: project.email_count || 0,
    slug: project.url_slug,
    progress: 75, // TODO: Calculate actual progress based on your requirements
  }));

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
        setRecentEmails(data.emails.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch emails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  return (
    <PageLayout
      title="Dashboard"
      actions={
        <Select defaultValue="7d">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      <div className="space-y-6">
        {/* Main Content */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Quick Actions Section */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <KeywordsGraph />
            <ResponseTimeChart />
            <CategoryChart />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Emails */}
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Emails</CardTitle>
                <Link href="/dashboard/inbox">
                  <Button variant="ghost" className="text-sm">
                    View Inbox
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="px-0">
                <ScrollArea className="h-[300px] md:h-[400px]">
                  <div className="space-y-4 px-4">
                    {loading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                            <div className="space-y-2 flex-1">
                              <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : recentEmails.length > 0 ? (
                      recentEmails.map((email) => (
                        <div
                          key={email.id}
                          className="flex items-start space-x-4 p-2  rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${email.from}.png`}
                            />
                            <AvatarFallback>
                              {email.from.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium leading-none">
                                {email.from.split("@")[0]}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {formatEmailDate(email.date)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {email.subject}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => handleAddToProject(email)}
                              >
                                <PlusCircle className="mr-2 h-3 w-3" />
                                Add to Project
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        No recent emails
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Project Overview */}
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-x-2">
                <CardTitle>Project Overview</CardTitle>
                <Link href="/dashboard/projects">
                  <Button variant="ghost" className="text-sm whitespace-nowrap">
                    View all
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project) => (
                      <Link
                        href={`/dashboard/projects/${project.slug}`}
                        key={project.name}
                        className="block hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <FolderKanban className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="font-medium truncate">
                                {project.name}
                              </span>
                            </div>
                            <Badge variant="secondary" className="w-fit">
                              {project.emails} emails
                            </Badge>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      <p>No projects yet.</p>
                      <Button
                        variant="link"
                        onClick={() => router.push("/dashboard/projects")}
                        className="mt-2"
                      >
                        Create your first project
                      </Button>
                    </div>
                  )}
                </div>
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
    </PageLayout>
  );
}
