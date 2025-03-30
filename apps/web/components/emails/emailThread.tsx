import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Email } from "./email";
import { Email as EmailType } from "@/app/dashboard/projects/[id]/page";

interface EmailThreadProps {
  emails: EmailType[];
}

export default function EmailThread({ emails }: EmailThreadProps) {
  return (
    <div className="p-0 mt-2">
        {emails.map((email, index) => (
          <Email
            key={email.id}
            email={email}
            isLast={index === emails.length - 1}
          />
        ))}
      </div>
  );
}
