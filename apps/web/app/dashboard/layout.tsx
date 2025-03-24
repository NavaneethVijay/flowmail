"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useProjectsStore } from "@/store/use-projects-store";
import { SiteHeader } from "@/components/site-header";
import { PageLayout } from "@/components/PageLayout";

export default function DashboardLayout({
  children,
  title,
  actions,
}: Readonly<{
  children: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
}>) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { user } = await fetch("/api/users").then((res) => res.json());
      setUser(user);

      if (!user) {
        router.push("/");
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to access this page",
        });
        return;
      }

      // Fetch and initialize projects and domain stats
      const [projectsResponse, statsResponse, labelsResponse] =
        await Promise.all([
          fetch("/api/projects").then((res) => res.json()),
          fetch("/api/users/stats").then((res) => res.json()),
          fetch("/api/emails/labels").then((res) => res.json()),
        ]);

      if (!projectsResponse.error) {
        useProjectsStore.getState().setProjects(projectsResponse);
      }
      if (statsResponse.domains) {
        useProjectsStore.getState().setDomainStats(statsResponse.domains);
      }
      if (labelsResponse) {
        useProjectsStore.getState().setLabels(labelsResponse);
      }
    };
    checkUser();
  }, [router, toast]);

  return (
    <div className="themes-wrapper bg-gray-100 dark:bg-gray-900">
      <SidebarProvider
        style={{
          // @ts-ignore
          "--sidebar-width": "20rem",
          // @ts-ignore
          "--sidebar-width-mobile": "20rem",
        }}
      >
        {/* @ts-ignore */}
        <AppSidebar variant="inset" user={user}  />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </div>
  );
}
