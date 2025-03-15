import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { formatEmailDate } from "@/lib/utils";
import { AddToProjectDialog } from "@/components/inbox/add-to-project-dialog";

interface Email {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
}

function parseEmailString(emailStr: string) {
  const match = emailStr.match(/(.*?)\s*<(.+?)>/);
  if (match) {
    return {
      displayName: match[1].trim(),
      email: match[2].trim(),
    };
  }
  return {
    displayName: emailStr,
    email: emailStr,
  };
}

export default function EmailList() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddToProjectOpen, setIsAddToProjectOpen] = useState(false);

  // Fetch emails from the API
  const fetchEmails = async (pageToken: string | null = null) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/emails?pageToken=${pageToken || ""}`);
      const data = await res.json();
      setEmails(data.emails);
      setNextPageToken(data.nextPageToken || null);

      // Store previous token for back navigation
      if (pageToken && !prevTokens.includes(pageToken)) {
        setPrevTokens((prev) => [...prev, pageToken]);
      }
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    }
    setLoading(false);
  };

  // Fetch initial emails on mount
  useEffect(() => {
    fetchEmails();
  }, []);

  // Handle next and previous page navigation
  const handleNextPage = () => {
    if (nextPageToken) {
      fetchEmails(nextPageToken);
    }
  };

  const handlePreviousPage = () => {
    if (prevTokens.length > 0) {
      const prevPageToken = prevTokens[prevTokens.length - 2] || null;
      setPrevTokens((prev) => prev.slice(0, -1)); // Remove last token
      fetchEmails(prevPageToken);
    }
  };

  const toggleEmailSelection = (id: string) => {
    setSelectedEmails((prev) =>
      prev.includes(id)
        ? prev.filter((emailId) => emailId !== id)
        : [...prev, id]
    );
  };

  const toggleAllEmails = () => {
    setSelectedEmails((prev) =>
      prev.length === emails.length ? [] : emails.map((email) => email.id)
    );
  };

  const handleAddToProject = (projectId: number) => {
    console.log("Selected emails:", selectedEmails);
    console.log("Selected project:", projectId);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Inbox</h2>
          {/* <div className="text-sm text-gray-600">
            <span className="mr-2">{emails.length} emails</span>
          </div> */}
        </div>
        {/* <Input
          type="search"
          placeholder="Search in emails"
          className="w-full"
        /> */}
      </div>
      <div className="p-2 border-b flex justify-between items-center bg-gray-50">
        <div className="flex items-center">
          <Checkbox
            checked={selectedEmails.length === emails.length}
            onCheckedChange={toggleAllEmails}
            aria-label="Select all emails"
            className="mr-2"
          />
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600"
            onClick={() => setIsAddToProjectOpen(true)}
            disabled={selectedEmails.length === 0}
          >
            Add to Project
          </Button>
        </div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600"
            onClick={handlePreviousPage}
            disabled={prevTokens.length === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600"
            onClick={handleNextPage}
            disabled={!nextPageToken}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <ScrollArea className="h-[calc(100vh-10rem)] rounded-md border">
          {loading ? (
            <p className="text-center p-4">Loading emails...</p>
          ) : emails.length === 0 ? (
            <p className="text-center p-4">No emails found.</p>
          ) : (
            emails.map((email) => {
              const { displayName, email: emailAddress } = parseEmailString(
                email.from
              );

              return (
                <div
                  key={email.id}
                  className="flex items-center p-2 border-b hover:bg-gray-50 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedEmails.includes(email.id)}
                    onCheckedChange={() => toggleEmailSelection(email.id)}
                    aria-label={`Select email from ${email.from}`}
                    className="mr-2"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage
                            src={`https://api.dicebear.com/6.x/initials/svg?seed=${email.from}`}
                            alt={displayName}
                          />
                          <AvatarFallback>
                            {displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{emailAddress}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-sm truncate">
                        {displayName}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2 ">
                        {formatEmailDate(email.date)}
                      </span>
                    </div>
                    <div className="text-sm font-medium truncate">
                      {email.subject}
                    </div>
                    <div
                      dangerouslySetInnerHTML={{ __html: email.snippet }}
                      className="text-sm text-muted-foreground line-clamp-2"
                    />
                  </div>
                </div>
              );
            })
          )}
        </ScrollArea>
      </div>
      <AddToProjectDialog
        open={isAddToProjectOpen}
        onOpenChange={setIsAddToProjectOpen}
        onSubmit={handleAddToProject}
      />
    </div>
  );
}
