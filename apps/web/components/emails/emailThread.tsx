import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Email } from "./email";
import { Email as EmailType } from "@/app/dashboard/projects/[id]/page";
import { MoreHorizontal, Paperclip, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import EmailThreadHeader from "./emailThreadHeader";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import TodoList from "./todo-list";

interface EmailThreadProps {
  emails: EmailType[];
}

export default function EmailThread({ emails }: EmailThreadProps) {
  return (
    <Card className="w-full  mx-auto border-none shadow-none">
      <CardContent className="p-0">
        <div className="py-4 mb-6 border-b border-border">
          <h2 className="text-2xl font-medium ">{emails[0].subject}</h2>
          {/* <Sheet>
            <SheetTrigger asChild>
              <Button variant="default">Manage Tasks</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Task Management</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you re
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <TodoList boardEmailId={emails[0].id} />
              </div>
            </SheetContent>
          </Sheet> */}
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
