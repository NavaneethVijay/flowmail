import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectsStore } from "@/store/use-projects-store";

interface CreateRuleProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function CreateRule({ onSuccess, onClose }: CreateRuleProps) {
  const [name, setName] = useState("");
  const [domains, setDomains] = useState<string[]>([]);
  const [domainInput, setDomainInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const { toast } = useToast();
  const { projects } = useProjectsStore();

  const handleDomainAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const domain = domainInput.trim();
      if (domain) {
        const formattedDomain = domain.startsWith("@")
          ? domain.slice(1)
          : domain;
        if (!domains.includes(formattedDomain)) {
          setDomains([...domains, formattedDomain]);
          setDomainInput("");
        }
      }
    }
  };

  const handleDomainRemove = (domainToRemove: string) => {
    setDomains(domains.filter((domain) => domain !== domainToRemove));
  };

  const handleKeywordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const keyword = keywordInput.trim();
      if (keyword && !keywords.includes(keyword)) {
        setKeywords([...keywords, keyword]);
        setKeywordInput("");
      }
    }
  };

  const handleKeywordRemove = (keywordToRemove: string) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  const handleSubmit = async () => {
    if (!name || !selectedProject) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Rule name and target project are required.",
      });
      return;
    }

    // Add your API call here to create the rule
    // For now, we'll just show a success message
    toast({
      title: "Success",
      description: "Rule created successfully!",
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="sm:max-w-[425px]">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="domains" className="text-right">
            Domains
          </Label>
          <div className="col-span-3 space-y-2">
            <Input
              id="domains"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyDown={handleDomainAdd}
              placeholder="Press Enter to add domain"
            />
            <div className="flex flex-wrap gap-2">
              {domains.map((domain) => (
                <Badge
                  key={domain}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  @{domain}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleDomainRemove(domain)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="keywords" className="text-right">
            Keywords
          </Label>
          <div className="col-span-3 space-y-2">
            <Input
              id="keywords"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordAdd}
              placeholder="Press Enter to add keyword"
            />
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {keyword}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleKeywordRemove(keyword)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="project" className="text-right">
            Target Project
          </Label>
          <Select
            value={selectedProject}
            onValueChange={setSelectedProject}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Create Rule</Button>
      </div>
    </div>
  );
}