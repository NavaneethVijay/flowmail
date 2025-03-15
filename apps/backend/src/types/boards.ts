export interface Board {
    id: number
    user_id?: string
    url_slug?: string
    name: string
    description: string
    domain_list: string
    settings?: string
    created_at?: string
    updated_at?: string
    is_archived?: boolean
    labels?: string
}
export interface BoardEmail {
    id?: number
    board_id: number
    email: string
}

export interface BoardColumn {
    id?: number
    board_id: number
    title: string
    type: string
    position: number
}