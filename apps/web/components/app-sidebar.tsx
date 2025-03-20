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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import { useProjectsStore } from "@/store/use-projects-store";
// import apiClient from "@/lib/server-api-client"

// Updated navigation data with proper routes
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Pages",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
        },
        {
          title: "Inbox",
          url: "/dashboard/inbox",
          icon: <MailIcon className="mr-2 h-4 w-4" />,
        },
        {
          title: "Projects",
          url: "/dashboard/projects",
          icon: <FolderKanban className="mr-2 h-4 w-4" />,
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: <Settings className="mr-2 h-4 w-4" />,
        },
      ],
    },
  ],
};

export function AppSidebar({
  // @ts-expect-error - user is not defined
  user,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
      document.cookie =
        "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      router.push("/");
    });
  };

  const getLabelIcon = (color: { backgroundColor?: string; textColor?: string } | null) => {
    return (
      <Tag
        className={cn(
          "mr-2 h-4 w-4",
          !color && "text-muted-foreground"
        )}
        style={{
          color: color?.backgroundColor || undefined,
          stroke: color?.backgroundColor || undefined,
          strokeWidth: color ? 2 : 1.5,
        }}
      />
    );
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="px-2 bg-muted rounded-lg m-4">
        <div className="flex flex-col gap-2 py-2">
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
            <div className="flex flex-col">
              <p className="text-sm font-medium leading-none">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              {/* <Badge variant="secondary" className="text-xs mt-2">
                Last synced: {new Date().toLocaleTimeString()}
              </Badge> */}
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2 pt-0">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium">
            Account Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="text-md mb-1 p-2 font-medium"
                >
                  <Link href="/dashboard">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-sm font-medium">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {/* @ts-expect-error - item.submenu is not defined */}
                    {item.submenu ? (
                      <>
                        <SidebarMenuButton
                          className="text-md mb-1 p-2 font-medium w-full flex justify-between items-center"
                          onClick={() => toggleSubmenu(item.title)}
                        >
                          <span className="flex items-center">
                            {item.icon}
                            {item.title}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              openSubmenus.includes(item.title) ? "transform rotate-180" : ""
                            }`}
                          />
                        </SidebarMenuButton>
                        {openSubmenus.includes(item.title) && (
                          <div className="ml-6 space-y-1">
                            {/* @ts-expect-error - item.submenu is not defined */}
                            {item.submenu.map((subItem) => (
                              <SidebarMenuButton
                                key={subItem.title}
                                className="text-sm p-2 w-full"
                                asChild
                                isActive={pathname === subItem.url}
                              >
                                <Link href={subItem.url}>{subItem.title}</Link>
                              </SidebarMenuButton>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton
                        className="text-md mb-1 p-2 font-medium"
                        asChild
                        isActive={
                          item.url === "/dashboard"
                            ? pathname === item.url
                            : pathname?.startsWith(item.url)
                        }
                      >
                        <Link prefetch href={item.url}>
                          {item.icon}
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium">
            Labels
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(labels).map(([category, labels]) => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton
                    className="text-md mb-1 p-2 font-medium w-full flex justify-between items-center"
                    onClick={() => toggleSubmenu(category)}
                  >
                    <span className="flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openSubmenus.includes(category) ? "transform rotate-180" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                  {openSubmenus.includes(category) && (
                    <div className="ml-6 space-y-1">
                      {/* @ts-expect-error - labels is not defined */}
                      {labels.map((label) => (
                        <SidebarMenuButton
                          key={label.id}
                          className="text-sm p-2 w-full hover:bg-muted/50"
                          asChild
                        >
                          <Link
                            href={`/dashboard/labels/${label.id}`}
                            className="flex items-center w-full"
                          >
                            {getLabelIcon(label.color)}
                            <span
                              className={cn(
                                "flex-1",
                                label.color && "font-medium"
                              )}
                              style={{
                                color: label.color?.backgroundColor || undefined,
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
        <SidebarGroup>
          <SidebarGroupLabel>Appearance</SidebarGroupLabel>
          <SidebarGroupContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuItem>
                  {theme === 'light' && <Sun className="mr-2 h-4 w-4" />}
                  {theme === 'dark' && <Moon className="mr-2 h-4 w-4" />}
                  {theme === 'system' && <Monitor className="mr-2 h-4 w-4" />}
                  {theme ? theme.charAt(0).toUpperCase() + theme.slice(1) : 'Theme'}
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[160px]">
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
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="space-y-2 rounded-lg bg-muted p-3">
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
