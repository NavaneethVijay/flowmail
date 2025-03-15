import React from "react";
import {
  Archive,
  ArchiveX,
  Trash2,
  Clock,
  Reply,
  ReplyAll,
  Forward,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EmailThreadHeader = () => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between px-0 py-2">
        {/* <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Archive className="h-4 w-4" />
            <span className="sr-only">Archive</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ArchiveX className="h-4 w-4" />
            <span className="sr-only">Move to junk</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Move to trash</span>
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Clock className="h-4 w-4" />
                <span className="sr-only">Snooze</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar />
            </PopoverContent>
          </Popover>
        </div> */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Reply className="h-4 w-4" />
            <span className="sr-only">Reply</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ReplyAll className="h-4 w-4" />
            <span className="sr-only">Reply all</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Forward className="h-4 w-4" />
            <span className="sr-only">Forward</span>
          </Button>
          {/* <div className="w-px h-6 bg-gray-300 mx-2" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Move to folder</DropdownMenuItem>
              <DropdownMenuItem>Print</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </div>
  );
};
export default EmailThreadHeader;
