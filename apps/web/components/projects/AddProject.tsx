import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectsStore } from "@/store/use-projects-store";
import { Label as LabelType } from "@/store/use-projects-store";
import { ChipsInput } from "@/components/ui/chips-input";

interface LabelObject {
  id: string;
  name: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  domain_list: string;
  labels?: LabelObject[];
  keywords: string;
}

interface AddProjectProps {
  onSuccess: () => void;
  initialDomains?: string[];
  onClose: () => void;
  initialData?: {
    id?: string;
    name?: string;
    description?: string;
    domain_list?: string;
    labels?: LabelObject[];
    keywords?: string;
  };
  isEditing?: boolean;
}

export function AddProject({
  onSuccess,
  initialDomains = [],
  onClose,
  initialData,
  isEditing,
}: AddProjectProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    domain_list: initialData?.domain_list || "",
    labels: initialData?.labels || [],
    keywords: initialData?.keywords || "",
  });
  const [domains, setDomains] = useState<string[]>(
    initialData?.domain_list
      ? initialData.domain_list.split(",")
      : initialDomains
  );
  const [domainInput, setDomainInput] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<LabelObject[]>(
    initialData?.labels || []
  );
  const { labels: sourceLabels } = useProjectsStore();
  const [labelInput, setLabelInput] = useState("");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [keywords, setKeywords] = useState<string[]>(
    initialData?.keywords ? initialData.keywords.split(",") : []
  );
  const [keywordInput, setKeywordInput] = useState("");

  interface TransformedLabel {
    value: string;
    label: string;
  }

  const transformedLabels: TransformedLabel[] = sourceLabels.labels.map(
    (label: LabelType) => ({
      value: label.id,
      label: label.name,
    })
  );

  const filteredLabels = transformedLabels.filter((label) =>
    label.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleLabels = searchTerm
    ? filteredLabels
    : transformedLabels.slice(0, 5);

  const handleLabelSelect = (value: string) => {
    const selectedLabel = sourceLabels.labels.find(
      (label) => label.id === value
    );
    if (!selectedLabel) return;

    if (selectedLabels.some((l) => l.id === value)) {
      setSelectedLabels(selectedLabels.filter((label) => label.id !== value));
    } else if (selectedLabels.length < 3) {
      setSelectedLabels([
        ...selectedLabels,
        { id: selectedLabel.id, name: selectedLabel.name },
      ]);
    } else {
      toast({
        variant: "destructive",
        title: "Label limit reached",
        description: "You can only select up to 3 labels.",
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !domains.length) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Project name and at least one domain are required.",
      });
      return;
    }

    interface ProjectSubmitData {
      id?: string;
      name: string;
      description: string;
      domain_list: string;
      url_slug: string;
      labels: LabelObject[];
      keywords: string;
    }

    let projectData: ProjectSubmitData = {
      name: formData.name,
      description: formData.description,
      domain_list: domains.join(","),
      url_slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      labels: selectedLabels,
      keywords: keywords.join(","),
    };

    console.log("projectData to api", projectData);

    if (isEditing && initialData?.id) {
      projectData.id = initialData.id;
    }

    const endpoint =
      isEditing && initialData?.id
        ? `/api/projects/${initialData.id}`
        : "/api/projects";

    const response = await fetch(endpoint, {
      method: isEditing ? "PUT" : "POST",
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${
          isEditing ? "update" : "create"
        } project. Please try again.`,
      });
      return;
    }

    toast({
      title: "Success",
      description: `Project ${isEditing ? "updated" : "created"} successfully!`,
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="w-full">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right text-foreground">
            Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right text-foreground">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="domain_list" className="text-right text-foreground">
            Domains
          </Label>
          <div className="col-span-3 space-y-2">
            <ChipsInput
              value={domains}
              onChange={setDomains}
              placeholder="Press Enter to add domain"
              prependSymbol="@"
              validate={(value) => {
                if (value.includes("@")) {
                  toast({
                    variant: "destructive",
                    title: "Invalid domain",
                    description: "Please enter domain without @ symbol",
                  });
                  return false;
                }
                return true;
              }}
            />
          </div>
          {/* <div className="col-span-3 space-y-2">
            <Input
              id="domain_list"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyDown={handleDomainAdd}
              placeholder="Press Enter to add domain"
              className="col-span-3"
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
          </div> */}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="labels" className="text-right text-foreground">
            Labels
          </Label>
          <div className="col-span-3 space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedLabels.length > 0
                    ? `${selectedLabels.length} selected`
                    : "Select labels..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search labels..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandEmpty>No label found.</CommandEmpty>
                  <CommandGroup>
                    {visibleLabels.map((label) => (
                      <CommandItem
                        key={label.value}
                        onSelect={() => handleLabelSelect(label.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedLabels.some((l) => l.id === label.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {label.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-2">
              {selectedLabels.map((label) => (
                <Badge
                  key={label.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {label.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleLabelSelect(label.id)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="keywords" className="text-right text-foreground">
            Keywords
          </Label>
          <div className="col-span-3 space-y-2">
            <ChipsInput
              value={keywords}
              onChange={setKeywords}
              placeholder="Press Enter to add keyword"
            />
            {/* <Input
              id="keywords"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordAdd}
              placeholder="Press Enter to add keyword"
              className="col-span-3"
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
            </div> */}
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex mt-6 justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          {isEditing ? "Update Project" : "Save Project"}
        </Button>
      </div>
    </div>
  );
}
