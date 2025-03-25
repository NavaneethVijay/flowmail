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
import { useIsMobile } from "@/hooks/use-mobile";
import { AddProject } from "@/components/projects/AddProject";

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

  const openAddProject = (data?: ProjectData) => {
    setInitialData(data);
    setIsOpen(true);
  };

  const closeAddProject = () => {
    setIsOpen(false);
    setInitialData(undefined);
  };

  const handleSuccess = () => {
    closeAddProject();
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
          <SheetContent side="bottom" className="h-[96%]">
            <SheetHeader className="text-left">
              <SheetTitle>
                {initialData?.id ? "Edit Project" : "Create a Project"}
              </SheetTitle>
              <SheetDescription>
                {initialData?.id
                  ? "Edit your project details"
                  : "Create a new project to manage your emails."}
              </SheetDescription>
            </SheetHeader>
            <div className="p-4">{content}</div>
          </SheetContent>
        </Sheet>
      )}
      {children}
    </AddProjectContext.Provider>
  );
};
