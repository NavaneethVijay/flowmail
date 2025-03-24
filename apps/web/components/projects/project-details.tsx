import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  board: any;
  onSync: () => void;
  isSyncing: boolean;
  uniqueEmails: string[];
}

export function ProjectSettingsSheet({
  isOpen,
  onClose,
  board,
  onSync,
  isSyncing,
  uniqueEmails,
}: ProjectSettingsSheetProps) {
  if (!board) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader className="border-b border-neutral-200 pb-4">
          <SheetTitle className="text-xl font-semibold">
            {board.name}
          </SheetTitle>
          <SheetDescription>
            {board.description || "No description provided"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Project Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Domains</div>
              <div className="flex flex-wrap gap-2">
                {board.domain_list?.split(",").map((domain: string) => (
                  <span
                    key={domain}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >
                    @{domain.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Labels</div>
              <div className="flex flex-wrap gap-2">
                {board.labels.map((label: { id: string; name: string }) => (
                  <span
                    key={label.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {label.name}
                  </span>
                ))}
                {board.labels.length === 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    No labels
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Keywords</div>
              <div className="flex flex-wrap gap-2">
                {board?.keywords?.split(",").map((keyword: string) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Members</h3>
            <div className="flex -space-x-2">
              {uniqueEmails.slice(0, 3).map((email) => (
                <TooltipProvider key={email}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Avatar className="border-2 border-background w-8 h-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${
                            email.split("@")[0]
                          }`}
                          alt={email.split("@")[0]}
                        />
                        <AvatarFallback>{email.split("@")[0]}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{email}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}

              {uniqueEmails.length > 3 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Avatar className="border-2 border-background w-8 h-8 bg-secondary hover:bg-secondary/80 cursor-pointer">
                        <AvatarFallback>
                          +{uniqueEmails.length - 3}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[280px]">
                      <div className="space-y-2">
                        <p className="font-medium">All Members</p>
                        <div className="space-y-1">
                          {uniqueEmails.map((email) => (
                            <p
                              key={email}
                              className="text-sm text-muted-foreground"
                            >
                              {email}
                            </p>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
        <SheetFooter>
          <div className="flex justify-between w-full py-4 mt-4 border-t border-neutral-200">
            <Button
              disabled={isSyncing}
              onClick={onSync}
              size="sm"
              variant="outline"
            >
              <RefreshCcw className="w-4 h-4" />
              <span className="ml-2">{isSyncing ? "Syncing..." : "Sync"}</span>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
