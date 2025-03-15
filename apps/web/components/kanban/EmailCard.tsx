"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Archive,
  Flag,
  MoreHorizontal,
  Reply,
  Star,
  Trash,
  Inbox,
  Send,
  Rat,
  AlertCircle,
  Tag,
  LucideListTodo,
  Eye,
  SquareArrowOutDownRightIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface EmailProps {
  email: {
    id: string;
    thread_id: string;
    subject: string;
    from: string;
    to: string[];
    date: string;
    snippet: string;
    labels: {
      starred: boolean;
      important: boolean;
      inbox: boolean;
      sent: boolean;
      draft: boolean;
      spam: boolean;
      trash: boolean;
      unread: boolean;
    };
    rawLabels: string[]; // All Gmail labels including custom ones
  };
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

type LabelColor = {
  bg: string;
  text: string;
  border: string;
};

const LABEL_COLORS: { [key: string]: LabelColor } = {
  default: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  red: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  blue: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
};

const getSystemLabelIcon = (label: string) => {
  switch (label) {
    case "INBOX":
      return <Inbox className="h-3 w-3 mr-1" />;
    case "SENT":
      return <Send className="h-3 w-3 mr-1" />;
    case "DRAFT":
      return <Rat className="h-3 w-3 mr-1" />;
    case "IMPORTANT":
      return <Flag className="h-3 w-3 mr-1" />;
    case "SPAM":
      return <AlertCircle className="h-3 w-3 mr-1" />;
    default:
      return <Tag className="h-3 w-3 mr-1" />;
  }
};

export default function EmailCard({ email }: EmailProps) {
  const [isStarred, setIsStarred] = useState(email.labels?.starred || false);

  const handleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
    // TODO: Add API call to update star status
  };

  const { displayName, email: emailAddress } = parseEmailString(email.from);

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "mb-4 transition-all hover:shadow-md p-0 px-1 pb-2",
          email.rawLabels.includes("UNREAD")
            ? // ? "border-2 border-cyan-800"
              "border-none"
            : "border-none"
        )}
      >
        <CardHeader className="p-2 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${email.from}`}
                  alt={displayName}
                />
                <AvatarFallback>
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Tooltip>
                  <TooltipTrigger>
                    <p className="text-sm font-medium text-left">
                      {displayName}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{emailAddress}</p>
                  </TooltipContent>
                </Tooltip>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(email.date), "MMM d, yyyy HH:mm")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleStar}
              >
                <Link href={`/dashboard/projects/legendary/email/${email.thread_id}`}>
                  <SquareArrowOutUpRightIcon className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2 pb-0">
          <div className="cursor-pointer">
            <h3 className="text-md font-semibold mb-1 line-clamp-2">
              {email.subject}
            </h3>
            <div
              dangerouslySetInnerHTML={{ __html: email.snippet }}
              className="text-xs text-muted-foreground line-clamp-2"
            />
          </div>
        </CardContent>

        <CardFooter className="p-2 flex flex-col items-start pt-0 ">
          <div className="flex flex-wrap gap-1.5 mt-2">
            {/* System Labels */}
            {email.labels?.important && (
              <Badge
                variant="secondary"
                className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
              >
                <Flag className="h-3 w-3 mr-1" />
                Important
              </Badge>
            )}

            {/* Custom Labels */}
            {email.rawLabels
              ?.filter((label) => {
                // Filter out system labels we don't want to show
                const systemLabels = [
                  "STARRED",
                  "UNREAD",
                  "INBOX",
                  "SENT",
                  "DRAFT",
                  "IMPORTANT",
                  "CATEGORY_PERSONAL",
                  "CATEGORY_SOCIAL",
                  "CATEGORY_PROMOTIONS",
                  "CATEGORY_FORUMS",
                ];
                return !systemLabels.includes(label);
              })
              .map((label, index) => {
                // Get a consistent color based on the label string
                const colorKeys = Object.keys(LABEL_COLORS);
                const colorIndex = label
                  .split("")
                  .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const color =
                  LABEL_COLORS[colorKeys[colorIndex % colorKeys.length]];

                const formattedLabel = label
                  .toLowerCase()
                  .replace("label_", "")
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());

                return (
                  <Badge
                    key={label}
                    variant="outline"
                    className={cn(
                      "text-xs font-normal",
                      color.bg,
                      color.text,
                      color.border,
                      "hover:bg-opacity-75"
                    )}
                  >
                    {getSystemLabelIcon(label)}
                    {formattedLabel}
                  </Badge>
                );
              })}
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-4 border p-2 rounded-md">
              <LucideListTodo className="text-muted-foreground h-4 w-4" />
              <div className="text-sm text-muted-foreground">1/8</div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
