import { create } from 'zustand';

export interface Email {
  email_id: string;
  id: string;
  thread_id: string;
  subject: string;
  column_id?: number;
  from: string;
  to: string[];
  date: string;
  snippet: string;
  body: string;
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
  rawLabels: string[];
}

export interface BoardColumn {
  id: number;
  type: string;
  title: string;
  board_id: number;
  position: number;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  itemIds?: string[];
}

interface KanbanBoard {
  id: number;
  name: string;
  description: string;
  columns: Record<string, BoardColumn>;
  emails: Email[];
  uniqueEmails: string[];
}

interface KanbanState {
  board: KanbanBoard | null;
  isLoading: boolean;
  isSyncing: boolean;

  initializeBoard: (boardId: string, data: Partial<KanbanBoard>) => void;
  updateBoard: (data: Partial<KanbanBoard>) => void;
  updateColumns: (columns: Record<string, BoardColumn>) => void;
  setEmails: (emails: Email[], uniqueEmails: string[]) => void;
  setLoading: (isLoading: boolean) => void;
  setSyncing: (isSyncing: boolean) => void;
  getBoard: () => KanbanBoard | null;
  clearBoard: () => void;
}

export const useKanbanStore = create<KanbanState>()((set, get) => ({
  board: null,
  isLoading: false,
  isSyncing: false,

  initializeBoard: (boardId, data) =>
    set(() => ({
      board: {
        id: Number(boardId),
        name: '',
        description: '',
        columns: {},
        emails: [],
        uniqueEmails: [],
        ...data,
      },
    })),

  updateBoard: (data) =>
    set((state) => ({
      board: state.board ? { ...state.board, ...data } : null,
    })),

  updateColumns: (columns) =>
    set((state) => ({
      board: state.board ? { ...state.board, columns } : null,
    })),

  setEmails: (emails, uniqueEmails) =>
    set((state) => ({
      board: state.board ? { ...state.board, emails, uniqueEmails } : null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setSyncing: (isSyncing) => set({ isSyncing }),

  getBoard: () => get().board,

  clearBoard: () => set({ board: null }),
}));