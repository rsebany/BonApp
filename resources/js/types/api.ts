export interface ApiResponse<T> {
    data: T;
    message?: string;
    meta?: {
        current_page: number;
        total_pages: number;
        per_page: number;
        total: number;
    };
}

export interface PaginationParams {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_dir?: 'asc' | 'desc';
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}