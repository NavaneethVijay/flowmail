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
        <div className="pt-4 mb-6 border-b border-border">
          <h2 className="text-2xl font-medium ">{emails[0].subject}</h2>
          <EmailThreadHeader />
        </div>

        {emails.map((email, index) => (
          <Email
            key={index}
            email={email}
            isLast={index === emails.length - 1}
          />
        ))}
      </CardContent>
      {/* <CardFooter className="flex-col items-start">
        <div className="absolute left-0 right-0 bottom-0 mb-6 bg-background p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type your reply..."
              // value={replyText}
              // onChange={(e) => setReplyText(e.target.value)}
            />
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
