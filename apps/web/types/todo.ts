export interface Todo {
  id?: string;
  board_email_id: string;
  title: string;
  details: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}