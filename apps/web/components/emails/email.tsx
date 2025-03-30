import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Email as EmailType } from "@/app/dashboard/projects/[id]/page";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const adjustIframeHeight = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const newHeight =
        iframeRef.current.contentWindow.document.body.scrollHeight + "px";
      iframeRef.current.style.height = newHeight;
    }
  };

  return (
    <Accordion type="single" collapsible defaultValue={isLast ? email.id : undefined}>
      <AccordionItem value={email.id} className="border-b border-border">
        <AccordionTrigger className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${email.from}`}
            />
            <AvatarFallback>
              {email.from.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow text-left">
            <p className="text-sm font-medium">{email.from}</p>
            <p className="text-xs text-muted-foreground">{email.from}</p>
            <p className="text-xs text-muted-foreground">{formatDate(email.date)}</p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <iframe
            ref={iframeRef}
            srcDoc={email.body}
            className="w-full border-none overflow-hidden"
            sandbox="allow-same-origin"
            title="Email content"
            onLoad={adjustIframeHeight}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
