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
        // Transform the columns data to match the expected format
        const transformedColumns = columns.map(column => ({
            id: column.id,
            type: column.type,
            settings: column.settings || {},
            position: column.position,
            title: column.title,
            itemIds: column?.itemIds?.map(id => parseInt(id, 10))
        }));

        console.log('Transformed data:', {
            columns_data: transformedColumns,
            board_id_param: boardId,
            user_id_param: userId
        });

        const { data, error } = await supabase.rpc('update_columns_and_emails', {
            columns_data: transformedColumns,
            board_id_param: boardId,
            user_id_param: userId
        });

        if (error) {
            console.error('Error updating board columns and emails:', error);
            throw error;
        }

        console.log('✅ Supabase RPC Success:', JSON.stringify(data, null, 2));

        return data;
    }
}
