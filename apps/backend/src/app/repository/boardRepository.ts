import { supabaseClient as supabase } from '@/config/supabaseClient'
import type { Board, BoardColumn } from '@/types/boards'
export class BoardRepository {
  private readonly BOARDS_TABLE = 'boards'
  private readonly BOARD_CACHE_KEY = 'board_email_cache'

  async createBoard(board: Board) {
    const { data, error } = await supabase.from(this.BOARDS_TABLE).insert({
      name: board.name,
      description: board.description,
      domain_list: board.domain_list,
      url_slug: board.url_slug,
      user_id: board.user_id
    }).select()
      .single()
    if (error) {
      console.error('Error creating board:', error)
      throw error
    }
    return data
  }

  async getBoardById(id: number, userId: string): Promise<Board> {
    const { data, error } = await supabase
      .from(this.BOARDS_TABLE)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error getting board by id:', error)
      throw error
    }
    return data
  }

  async updateBoard(board: Board) {
    const { data, error } = await supabase
      .from(this.BOARDS_TABLE)
      .update(board)
      .eq('id', board.id)
      .eq('user_id', board.user_id)

    if (error) {
      console.error('Error updating board:', error)
      throw error
    }
    return data
  }

  async deleteBoard(id: number, userId: string) {
    const { error } = await supabase
      .from(this.BOARDS_TABLE)
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting board:', error)
      throw error
    }
    return true
  }

  async getBoardsByUserId(userId: string): Promise<Board[]> {
    const { data, error } = await supabase
      .from(this.BOARDS_TABLE)
      .select(`*,
            ${this.BOARD_CACHE_KEY} (
              last_synced_at,
              cache_tag
            )
          `)
      .eq('user_id', userId)

    if (error) {
      console.error('Error getting boards by user id:', error)
      throw error
    }
    const formattedData = data.map((board) => {
      const { board_email_cache, ...rest } = board;
      return {
        ...rest,
        last_synced_at: board[this.BOARD_CACHE_KEY]?.last_synced_at || null,
      };
    });

    return formattedData
  }

  async getBoardBySlug(slug: string, userId: string): Promise<Board> {
    const { data, error } = await supabase
      .from(this.BOARDS_TABLE)
      .select('*')
      .eq('url_slug', slug)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error getting board by slug:', error)
      throw error
    }
    return data
  }
}
