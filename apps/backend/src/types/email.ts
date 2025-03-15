export interface EmailData {
  id: string;
  threadId?: string | null;
  subject?: string | null;
  from?: string | null;
  to?: string | null;
  cc?: string | null;
  date?: string | null;
  snippet?: string | null;
  body?: string,
  labels?: {
    starred: boolean;
    important: boolean;
    inbox: boolean;
    sent: boolean;
    draft: boolean;
    spam: boolean;
    trash: boolean;
    unread: boolean;
    custom: string[];
  };
  rawLabels?: string[];
  isRead?: boolean;
}
