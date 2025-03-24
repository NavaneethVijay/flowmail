import * as React from "react";
import {
  LogOut,
  LayoutDashboard,
  FolderKanban,
  Settings,
  Sparkles,
  MailIcon,
  ChevronDown,
  Tag,
  Sun,
  Moon,
  Monitor,
  InboxIcon,
  ScrollText,
  BarChart3,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Label, useProjectsStore } from "@/store/use-projects-store";
import { User } from "@supabase/supabase-js";
// import apiClient from "@/lib/server-api-client"

// Updated navigation data with proper routes
const data = {
  navMain: [
    {
      title: "Pages",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Inbox",
          url: "/dashboard/inbox",
          icon: MailIcon,
        },
        {
          title: "Projects",
          url: "/dashboard/projects",
          icon: FolderKanban,
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
          icon: BarChart3,
        },
      ],
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { projects } = useProjectsStore();
  const { labels } = useProjectsStore();
  const projectCount = projects.length;
  const projectLimit = 5;
  const projectProgress = (projectCount / projectLimit) * 100;
  const remainingProjects = projectLimit - projectCount;
  const [openSubmenus, setOpenSubmenus] = React.useState<string[]>([]);
  const { setTheme, theme } = useTheme();

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const handleSignOut = async () => {
    await fetch("/api/users/logout", {
      method: "POST",
    }).finally(() => {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      router.push("/");
    });
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-4 py-2">
        <div className="flex items-center space-x-2">
          <Image
            src="https://placehold.co/32x32"
            alt="Logo"
            width={32}
            height={32}
          />
          <span className="font-semibold text-xl">FlowMail</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {/* Main Navigation */}
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-sm font-medium">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="text-md mb-1 p-2 font-medium"
                      asChild
                      isActive={
                        item.url === "/dashboard"
                          ? pathname === item.url
                          : pathname?.startsWith(item.url || "")
                      }
                    >
                      <Link href={item.url || ""}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Labels Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium">
            Labels
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(labels).map(([category, labels]) => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton
                    asChild
                    className="text-md mb-1 p-2 font-medium w-full flex justify-between items-center"
                    onClick={() => toggleSubmenu(category)}
                  >
                    <span className="flex items-center">
                      <span className="flex items-center">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openSubmenus.includes(category)
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </span>
                  </SidebarMenuButton>
                  {openSubmenus.includes(category) && (
                    <div className="ml-0 space-y-1">
                      {labels.map((label: Label) => (
                        <SidebarMenuButton
                          key={label.id}
                          className="text-md p-2 w-full hover:bg-muted/50"
                          asChild
                        >
                          <Link
                            href={`/dashboard/labels/${label.id}`}
                            className="flex items-center w-full"
                          >
                            {/* {label.color} */}
                            <span
                              className={cn(
                                "flex-1 text-sm",
                                label.color && "font-medium"
                              )}
                              style={{
                                color:
                                  label.color?.backgroundColor || undefined,
                              }}
                            >
                              {label.name}
                            </span>
                            {label.messagesUnread > 0 && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                {label.messagesUnread}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="w-full px-2 py-8">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url}
                    alt={user?.email}
                  />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.full_name || user?.email}
                  </p>
                  <p className="text-xs ">{user?.email}</p>
                </div>
                <ChevronDown className="ml-auto h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade Plan
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {theme === "light" && <Sun className="mr-2 h-4 w-4" />}
                {theme === "dark" && <Moon className="mr-2 h-4 w-4" />}
                {theme === "system" && <Monitor className="mr-2 h-4 w-4" />}
                Appearance
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Project Limit Section */}
        <div className="space-y-2 rounded-lg p-3 border border-border bg-background">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Project Limit</span>
            <span className="font-medium">
              {projectCount}/{projectLimit} Projects
            </span>
          </div>
          <Progress value={projectProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Create {remainingProjects} more project
            {remainingProjects !== 1 ? "s" : ""} with Free plan.
          </p>
          <Link
            href="/dashboard/upgrade"
            className="text-xs font-medium text-primary underline"
          >
            Upgrade for unlimited projects
          </Link>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
