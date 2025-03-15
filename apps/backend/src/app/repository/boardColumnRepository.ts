import { supabase } from '@/config/supabase'
import type { BoardColumn } from '@/types/boards'

export class BoardColumnRepository {
    private readonly BOARD_COLUMNS_TABLE = 'board_columns'

    async getBoardColumns(boardId: number): Promise<BoardColumn[]> {
        const { data, error } = await supabase.from(this.BOARD_COLUMNS_TABLE).select('*').eq('board_id', boardId)
        if (error) {
            console.error('Error getting board columns:', error);
            throw error;
        }
        return data
    }

    async createBoardColumn(column: BoardColumn) {
        const { data, error } = await supabase.from(this.BOARD_COLUMNS_TABLE).insert(column).select().single()
        if (error) {
            console.error('Error creating board column:', error);
            throw error;
        }
        return data
    }

    async getInitialBoardColumn(boardId: number): Promise<BoardColumn> {
        const { data, error } = await supabase
            .from(this.BOARD_COLUMNS_TABLE)
            .select('*')
            .eq('board_id', boardId)
            .eq('position', 0)
            .single()

        if (error) {
            console.error('Error getting initial board columns:', error);
            throw error;
        }
        return data
    }

    async updateBoardColumns(boardId: number, columns: BoardColumn[], userId: string) {
        console.log('data', {
            columns_data: columns,
            board_id_param: boardId,
            user_id_param: userId
        })
        // Start a transaction to ensure all updates are atomic
        const { data, error } = await supabase.rpc('update_columns_and_emails', {
            columns_data: columns,
            board_id_param: boardId,
            user_id_param: userId
        });

        console.log('update_columns_and_emails', JSON.stringify(data, null, 2))

        if (error) {
            console.error('Error updating board columns and emails:', error);
            throw error;
        }

        return true;
    }
}
