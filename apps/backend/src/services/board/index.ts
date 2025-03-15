import type { GoogleProvider } from '@/app/providers/GoogleProvider';
import { ProviderFactory } from '@/app/providers/ProviderFactory';
import { BoardColumnRepository } from '@/app/repository/boardColumnRepository';
import { BoardEmailRepository } from '@/app/repository/boardEmailRepository';
import { BoardRepository } from '@/app/repository/boardRepository';
import { OAuthRepository } from '@/app/repository/oauthRepository';
import type { Board, BoardColumn } from '@/types/boards'
import { SupabaseClient, User } from '@supabase/supabase-js';


export default class BoardService {
    private boardRepository: BoardRepository
    private boardColumnRepository: BoardColumnRepository
    private boardEmailRepository: BoardEmailRepository
    private provider: GoogleProvider
    private oauthRepository: OAuthRepository
    private user: User | undefined
    constructor() {
        this.boardRepository = new BoardRepository()
        this.boardColumnRepository = new BoardColumnRepository()
        this.boardEmailRepository = new BoardEmailRepository()
        this.oauthRepository = new OAuthRepository()
        this.provider = ProviderFactory.createProvider('google') as GoogleProvider
    }

    setUser(user: User) {
        this.user = user
        return this
    }

    async getUserBoards() {
        if (!this.user) throw new Error('User not set')
        return await this.boardRepository.getBoardsByUserId(this.user.id)
    }

    async getBoardById(boardId: number) {
        if (!this.user) throw new Error('User not set')
        return await this.boardRepository.getBoardById(boardId, this.user.id)
    }

    async createBoard(data: Board) {
        const board = await this.boardRepository.createBoard({ ...data, user_id: this.user?.id })
        const defaultColumns = [
            { name: 'Todo', position: 0 },
            { name: 'In Progress', position: 1 }
        ];

        const columnPromises = defaultColumns.map(column =>
            this.boardColumnRepository.createBoardColumn({
                board_id: board.id,
                title: column.name,
                type: column.name,
                position: column.position
            })
        );

        await Promise.all(columnPromises);
        return board;
    }

    async updateBoard(data: Board) {
        if (!this.user) throw new Error('User not set')
        return await this.boardRepository.updateBoard({ ...data, user_id: this.user.id })
    }

    async deleteBoard(boardId: number) {
        if (!this.user) throw new Error('User not set')
        return await this.boardRepository.deleteBoard(boardId, this.user.id)
    }

    async getBoardBySlug(slug: string) {
        if (!this.user) throw new Error('User not set')
        const board = await this.boardRepository.getBoardBySlug(slug, this.user.id)
        if (!board) throw new Error('Board not found')

        const boardColumns = await this.boardColumnRepository.getBoardColumns(board.id)
        return { board, board_columns: boardColumns }
    }

    async getEmailsByBoardId(boardId: number, forceRefresh = false) {
        if (!this.user) throw new Error('User not set')

        try {
            console.log('fetching board id', boardId)
            const board = await this.boardRepository.getBoardById(boardId, this.user.id)
            if (!board) throw new Error('Board not found')

            if (!forceRefresh) {
                console.log('Requesting cached emails')
                const cachedEmails = await this.boardEmailRepository.getBoardEmails(boardId)
                if (cachedEmails && cachedEmails.length > 0) {
                    console.log('Requesting cached emails')
                    return {
                        emails: cachedEmails,
                        uniqueEmails: []
                    }
                }
            }
            console.log('making request to google api')
            const domains = (board.domain_list || '').split(',').map((domain: string) => domain.trim())
            const labels = (board.labels || '')
            .split(',')
            .map((label: string) => label.trim())
            .filter((label) => label !== ''); // Remove empty strings

            const searchQuery = domains
                .map((domain: string) => `{from:${domain} OR to:${domain}}`)
                .join(' OR ')

            console.log('Search query for API', JSON.stringify(searchQuery, null, 2))
            console.log('Labels for API', JSON.stringify(labels, null, 2))
            const tokens = await this.oauthRepository.getTokens(this.user)
            this.provider.setTokens(tokens)
            const emails = await this.provider.searchEmails({ q: searchQuery, maxResults: 20, labelIds: labels })
            console.log("total emails from GMAIL", emails.length)
            // get default column
            // Handle sync when columns are updated, for new emails assgin default column
            const defaultColumn = await this.boardColumnRepository.getInitialBoardColumn(boardId)
            console.log('defaultColumn while syncing', JSON.stringify(defaultColumn, null, 2))
            await this.boardEmailRepository.saveBoardEmails(boardId, emails as [], defaultColumn)
            const cachedEmails = await this.boardEmailRepository.getBoardEmails(boardId)
            return { emails: cachedEmails, uniqueEmails: [] }

        } catch (error) {
            console.error('Error in getEmailsByProjectId:', error)
            throw error
        }
    }
    async updateBoardColumns(boardId: number, columns: BoardColumn[]) {
        if (!this.user) throw new Error('User not set')
        return await this.boardColumnRepository.updateBoardColumns(boardId, columns, this.user.id)
    }
}
