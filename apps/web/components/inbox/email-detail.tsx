import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Reply, ReplyAll, Forward, MoreHorizontal, Star, Trash } from 'lucide-react'

export default function EmailDetail() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">1 of 100</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Reply className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-6 flex-grow overflow-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src="/avatars/boss.png" alt="Boss Smith" />
              <AvatarFallback>BS</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold mb-1">Weekly Report</h2>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">From:</span> Boss Smith &lt;boss@company.com&gt;
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">To:</span> Me &lt;me@example.com&gt;
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Jul 3, 2023, 10:30 AM</span>
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="prose max-w-none">
          <p>Hello,</p>
          <p>Here&apos;s this week&apos;s progress report. We&apos;ve made significant strides in our main project and I&apos;m pleased with the team&apos;s performance.</p>
          <p>Key points:</p>
          <ul>
            <li>Project A is 80% complete</li>
            <li>We&apos;ve onboarded 2 new clients</li>
            <li>Team productivity has increased by 15%</li>
          </ul>
          <p>Let&apos;s discuss these in our next meeting.</p>
          <p>Best regards,<br />Boss Smith</p>
        </div>
      </div>
      <div className="p-4 border-t bg-gray-50">
        <div className="flex space-x-2">
          <Button>
            <Reply className="mr-2 h-4 w-4" /> Reply
          </Button>
          <Button variant="outline">
            <ReplyAll className="mr-2 h-4 w-4" /> Reply All
          </Button>
          <Button variant="outline">
            <Forward className="mr-2 h-4 w-4" /> Forward
          </Button>
        </div>
      </div>
    </div>
  )
}
