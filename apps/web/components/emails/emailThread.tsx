import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Email } from "./email";
import { Email as EmailType } from "@/app/dashboard/projects/[id]/page";
import { Paperclip, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import EmailThreadHeader from "./emailThreadHeader";

interface EmailThreadProps {
  emails: EmailType[];
}

export default function EmailThread({ emails }: EmailThreadProps) {
  return (
    <Card className="w-full  mx-auto border-none shadow-none">
      <CardContent className="p-0">
        <div className="py-4 mb-6 border-b border-border">
          <h2 className="text-2xl font-medium ">{emails[0].subject}</h2>
        </div>

        {emails.map((email, index) => (
          <Email
            key={email.id}
            email={email}
            isLast={index === emails.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}
