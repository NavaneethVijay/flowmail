"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { AddProject } from "@/components/projects/AddProject";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectsStore } from "@/store/use-projects-store";

interface LabelObject {
  id: string;
  name: string;
}

interface ProjectData {
  id?: string;
  name?: string;
  description?: string;
  domain_list?: string;
  labels?: LabelObject[];
  keywords?: string;
}

interface AddProjectContextType {
  isOpen: boolean;
  openAddProject: (initialData?: ProjectData) => void;
  closeAddProject: () => void;
}

const AddProjectContext = createContext<AddProjectContextType | undefined>(
  undefined
);

export const useAddProject = () => {
  const context = useContext(AddProjectContext);
  if (!context) {
    throw new Error("useAddProject must be used within an AddProjectProvider");
  }
  return context;
};

export const AddProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialData, setInitialData] = useState<ProjectData | undefined>();
  const isMobile = useIsMobile();
  const { setProjects } = useProjectsStore();

  const openAddProject = (data?: ProjectData) => {
    setInitialData(data);
    setIsOpen(true);
  };

  const closeAddProject = () => {
    setIsOpen(false);
    setInitialData(undefined);
  };

  const handleSuccess = async () => {
    try {
      // Fetch updated projects
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const projects = await response.json();

      // Update the projects store
      setProjects(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      closeAddProject();
    }
  };

  const content = (
    <AddProject
      onSuccess={handleSuccess}
      onClose={closeAddProject}
      initialData={initialData}
      isEditing={!!initialData?.id}
    />
  );

  return (
    <AddProjectContext.Provider
      value={{
        isOpen,
        openAddProject,
        closeAddProject,
      }}
    >
      {!isMobile ? (
        <Dialog open={isOpen} onOpenChange={closeAddProject}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {initialData?.id ? "Edit Project" : "Create a Project"}
              </DialogTitle>
              <DialogDescription>
                {initialData?.id
                  ? "  Edit your project details "
                  : "Let's create a new project to manage your emails."}
              </DialogDescription>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={isOpen} onOpenChange={closeAddProject}>
          <SheetContent side="right" className="w-[95vw]">
            <SheetHeader className="text-left">
              <SheetTitle>
                {initialData?.id ? "Edit Project" : "Create a Project"}
              </SheetTitle>
              <SheetDescription>
                {initialData?.id
                  ? "  Edit your project details "
                  : "Let's create a new project to manage your emails."}
              </SheetDescription>
            </SheetHeader>
            <div className="p-4">
              <ScrollArea className="overflow-y-auto max-h-[90vh]">
                {content}
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      )}
      {children}
    </AddProjectContext.Provider>
  );
};
