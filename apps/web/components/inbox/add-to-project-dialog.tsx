// components/inbox/add-to-project-dialog.tsx
import { useState } from "react";
import { useProjectsStore } from "@/store/use-projects-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddToProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (projectId: number) => void;
}

export function AddToProjectDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddToProjectDialogProps) {
  const { projects } = useProjectsStore();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.domain_list.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedProject) {
      onSubmit(selectedProject);
      onOpenChange(false);
      setSelectedProject(null);
      setSearchTerm("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] lg:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add to Project</DialogTitle>
        </DialogHeader>

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

        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedProject === project.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50 border-neutral-200"
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{project.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
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
                  {project.labels && (
                    <div className="flex flex-wrap gap-2">
                      {project.labels.map((label: { id: string; name: string }) => (
                        <Badge key={label.id} variant="secondary">
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No projects found
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedProject}>
            Add to Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
