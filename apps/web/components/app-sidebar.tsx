import * as React from "react";
import {
  LogOut,
  LayoutDashboard,
  FolderKanban,
  MailIcon,
  Settings,
  Sparkles,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  BarChart3,
  ListChecks,
  InboxIcon,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
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
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { Progress } from "./ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const data = {
  navMain: [
    {
      title: "Emails",
      items: [
        { title: "Inbox", url: "/dashboard/inbox", icon: InboxIcon },
        { title: "Labels", url: "/dashboard/labels", icon: FolderKanban },
      ],
    },
    {
      title: "Projects",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Projects", url: "/dashboard/projects", icon: ListChecks },
        { title: "Settings", url: "/dashboard/settings", icon: Settings },
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
  const { setTheme, theme } = useTheme();
  const { projects } = useProjectsStore();
  const projectCount = projects.length;
  const projectLimit = 5;
  const projectProgress = (projectCount / projectLimit) * 100;
  const remainingProjects = projectLimit - projectCount;

  const handleSignOut = async () => {
    await fetch("/api/users/logout", { method: "POST" }).finally(() => {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      router.push("/");
    });
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-6 py-4 pb-0 flex gap-3">
        <div className="flex items-center justify-start gap-3">
          <Image src="/logo-white.svg" alt="Logo" width={36} height={36} />
          <span className="font-semibold text-lg">FlowMail</span>
        </div>
        <div className="flex items-center gap-3 cursor-pointer px-2 bg-primary/5 py-2 rounded-lg  transition">
          <Avatar>
            <AvatarImage
              src={user?.user_metadata?.avatar_url}
              alt={user?.email}
            />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {user?.user_metadata?.full_name || user?.email}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        item.url === "/dashboard"
                          ? pathname === "/dashboard"
                          : pathname?.startsWith(item.url || "")
                      }
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-primary/5 transition"
                    >
                      <Link href={item.url || ""}>
                        <item.icon className="h-5 w-5 text-primary" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t flex border-border">
        <div className="flex items-center justify-between gap-2 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted-foreground/10 rounded-md">
          Change Appearance
          <div className="relative ml-3 flex items-center">
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
              className="peer hidden"
            />
            <div
              className="relative w-12 h-6 flex items-center rounded-full bg-muted-foreground/20 cursor-pointer transition-colors"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <div
                className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-md transition-all ${
                  theme === "dark" ? "translate-x-6 bg-gray-800" : ""
                }`}
              >
                {theme === "dark" ? (
                  <Moon className="h-3 w-3 text-white" />
                ) : (
                  <Sun className="h-3 w-3 text-yellow-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be signed out of your account and redirected to the home page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSignOut}>Logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  );
}
