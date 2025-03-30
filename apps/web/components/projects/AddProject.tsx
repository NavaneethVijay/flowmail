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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string(),
  domain_list: z.string(),
  labels: z.array(z.object({ id: z.string(), name: z.string() })),
  keywords: z.string(),
});

export function AddProject({
  onSuccess,
  initialDomains = [],
  onClose,
  initialData,
  isEditing,
}: AddProjectProps) {
  const { toast } = useToast();
  const [domains, setDomains] = useState<string[]>(
    initialData?.domain_list ? initialData.domain_list.split(",") : initialDomains
  );
  const [selectedLabels, setSelectedLabels] = useState<LabelObject[]>(
    initialData?.labels || []
  );
  const { labels: sourceLabels } = useProjectsStore();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>(
    initialData?.keywords ? initialData.keywords.split(",") : []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      domain_list: initialData?.domain_list || "",
      labels: initialData?.labels || [],
      keywords: initialData?.keywords || "",
    },
  });

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.name || !domains.length) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Project name and at least one domain are required.",
      });
      return;
    }

    setIsLoading(true);

    const projectData = {
      name: values.name,
      description: values.description,
      domain_list: domains.join(","),
      url_slug: values.name.toLowerCase().replace(/\s+/g, "-"),
      labels: selectedLabels,
      keywords: keywords.join(","),
      ...(isEditing && initialData?.id ? { id: initialData.id } : {}),
    };

    const endpoint = isEditing && initialData?.id
      ? `/api/projects/${initialData.id}`
      : "/api/projects";

    const response = await fetch(endpoint, {
      method: isEditing ? "PUT" : "POST",
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} project. Please try again.`,
      });
      return;
    }

    setIsLoading(false);
    toast({
      title: "Success",
      description: `Project ${isEditing ? "updated" : "created"} successfully!`,
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Name</FormLabel>
                <FormControl className="col-span-3">
                  <Input {...field} />
                </FormControl>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Description</FormLabel>
                <FormControl className="col-span-3">
                  <Textarea {...field} />
                </FormControl>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Domains</Label>
            <div className="col-span-3">
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
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Labels</Label>
            <div className="col-span-3">
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
            <Label className="text-right">Keywords</Label>
            <div className="col-span-3">
              <ChipsInput
                value={keywords}
                onChange={setKeywords}
                placeholder="Press Enter to add keyword"
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {isEditing ? "Update Project" : "Save Project"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
