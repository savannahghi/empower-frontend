export interface TableListModel<T> {
    count: number;
    next: number | null;
    previous: number | null;
    page_size: number;
    current_page: number;
    total_pages: number;
    start_index: number;
    end_index: number;
    results: Array<T>;
}
