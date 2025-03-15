"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  TrashIcon,
  PlusCircle,
  ChevronRight,
  Mail,
  Briefcase,
  PlugZap,
  PlugZap2Icon,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useModal } from "@/context/ModalContext";
import { AddProject } from "@/components/projects/AddProject";
import Image from "next/image";
import { useProjectsStore } from "@/store/use-projects-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil } from "lucide-react";

interface DomainStats {
  domain: string;
  count: number;
  image: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, domainStats, setProjects, removeProject } =
    useProjectsStore();
  const [isLoading, setIsLoading] = useState(true);
  const { openModal, closeModal } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.domain_list.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchProjects = async () => {
    setIsLoading(true);
    const data = await fetch("/api/projects").then((res) => res.json());

    if (data.error) {
      console.error("Error fetching projects:", data.error);
      return;
    }

    setProjects(data || []);
    setIsLoading(false);
  };

  const handleDeleteClick = (id: number) => {
    setProjectToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    const { error } = await fetch(`/api/projects/${projectToDelete}`, {
      method: "DELETE",
    }).then((res) => res.json());

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project. Please try again.",
      });
    } else {
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
      removeProject(projectToDelete);
    }
    setProjectToDelete(null);
  };

  const handleNewProject = (domain?: string) => {
    const initialDomains = domain ? [domain] : [];
    openModal({
      title: "Create a Project",
      description: "Create a new project to manage your emails.",
      content: (
        <AddProject
          onSuccess={fetchProjects}
          onClose={closeModal}
          initialDomains={initialDomains}
        />
      ),
      actions: null,
    });
  };

  const handleEditProject = (project: any) => {
    openModal({
      title: "Edit Project",
      description: "Update your project details.",
      content: (
        <AddProject
          onSuccess={fetchProjects}
          onClose={closeModal}
          initialData={project}
          isEditing={true}
        />
      ),
      actions: null,
    });
  };

  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex-1 space-y-8 p-8 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Project Dashboard
              </h2>
              <p className="text-muted-foreground">
                Manage and organize your email projects efficiently
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ringHover" onClick={() => handleNewProject()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>

          <div className="flex space-x-8">
            <div className="flex-1 space-y-4">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {/* Projects */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.length === 0 ? (
                  <div className="flex flex-col col-span-3 items-center justify-center">
                    <p className="text-muted-foreground">No projects found</p>
                  </div>
                ) : (
                  filteredProjects.map((project) => (
                    <Card
                      className="hover:bg-muted/50 transition-colors"
                      key={project.id}
                    >
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div>
                          <CardTitle className="text-lg font-medium">
                            {project.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleEditProject(project)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleDeleteClick(project.id)}
                              >
                                <TrashIcon className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-0">
                        <div className="flex items-center flex-wrap gap-2">
                          <Briefcase className="h-4 w-4 text-primary" />
                          {project.domain_list.split(",").map((domain) => (
                            <span
                              key={domain}
                              className="inline-block m-0 items-center space-x-2 text-sm text-primary"
                            >
                              @{domain.trim()}
                            </span>
                          ))}
                        </div>
                        <div>
                          {project.labels && (
                            <div className="flex flex-wrap gap-2 my-2">
                              {project.labels?.split(",").map((label) => (
                                <Badge key={label} variant="secondary">
                                  {label.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-xs mt-2 text-muted-foreground">
                          Last Sync:
                          <span className="inline-block px-2">
                          {project.last_synced_at
                            ? new Date(
                                project.last_synced_at
                              ).toLocaleString()
                            : "Never"}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="pb-2 border-t mt-4 pt-2 border-neutral-200">
                        <div className="flex justify-between w-full space-x-4">
                          <div className="flex  flex-1 items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              24 Emails
                            </span>
                          </div>
                          <Button
                            onClick={() =>
                              router.push(
                                `/dashboard/projects/${project.url_slug}`
                              )
                            }
                            variant="expandIcon"
                            Icon={() => (
                              <ChevronRight className="ml-2 h-4 w-4" />
                            )}
                            iconPlacement="right"
                          >
                            View Board
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
            <div className="w-[400px] space-y-4">
              <Card className="bg-primary/0">
                <CardHeader>
                  <CardTitle className="text-lg">Suggested Projects</CardTitle>
                  <CardDescription>
                    Based on your email activity, choose a project to connect
                    to.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div>
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="flex items-center mb-4">
                          <Skeleton className="h-14 w-full flex-1 " />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ScrollArea className="h-[600px] overflow-y-auto overflow-x-hidden ">
                      {domainStats.slice(0, 6).map((domain, index) => (
                        <div
                          className="rounded-lg p-2 mb-4 overflow-hidden bg-primary/5 border border-neutral-200"
                          key={index}
                        >
                          <div className="grid grid-cols-[40px_140px_120px] gap-4 items-center">
                            <Avatar className="w-[40px] h-[40px] bg-white rounded-lg overflow-hidden border border-neutral-200">
                              <AvatarImage
                                width={40}
                                height={40}
                                src={domain.image}
                                alt={domain.domain}
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start">
                              <h3 className="leading-7 text-sm mt-0 break-words">
                                {domain.domain}
                              </h3>
                            </div>
                            <Button
                              variant="default"
                              className="w-[120px] flex gap-1 items-center justify-between"
                              onClick={() => handleNewProject(domain.domain)}
                            >
                              <PlugZap2Icon className="h-4 w-4" /> Connect
                            </Button>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={() => setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                Are you sure you want to remove the project?
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project and all its data.{" "}
              <div className="font-medium">
                Your emails will remain in your inbox.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
