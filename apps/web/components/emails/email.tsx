import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Email as EmailType } from "@/app/dashboard/projects/[id]/page";

interface EmailProps {
  email: EmailType;
  isLast: boolean;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export function Email({ email, isLast }: EmailProps) {
  const [isOpen, setIsOpen] = useState(isLast);
  console.log('email in details', email);

  return (
    <div className="mb-4 border-b border-border">
      <div className="flex items-center space-x-4 mb-2">
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${email.from}`}
          />
          <AvatarFallback>
            {email.from.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-sm font-medium">{email.from}</p>
          <p className="text-xs text-muted-foreground">{email.from}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(email.date)}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      {isOpen && (
        <div className="pr-4">
          <iframe
            srcDoc={email.body}
            className="w-full min-h-[100vh] border-none overflow-hidden"
            sandbox="allow-same-origin"
            title="Email content"
          />
        </div>
      )}
    </div>
  );
}
