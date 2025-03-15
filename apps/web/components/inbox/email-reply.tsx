'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, Mail, Paperclip } from 'lucide-react'

export default function EmailReply() {
  const [content, setContent] = useState('')

  const handleFormat = (command: string) => {
    document.execCommand(command, false, undefined)
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4 flex space-x-2">
        <Button variant="outline" size="icon" onClick={() => handleFormat('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => handleFormat('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => handleFormat('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Paperclip className="h-4 w-4" />
        </Button>
      </div>
      <div
        className="flex-grow border rounded-md p-2 overflow-auto"
        contentEditable
        onInput={(e) => setContent(e.currentTarget.textContent || '')}
      />
      <div className="mt-4 flex justify-between">
        <Button variant="outline">Save Draft</Button>
        <Button>
          <Mail className="mr-2 h-4 w-4" /> Send
        </Button>
      </div>
    </div>
  )
}
