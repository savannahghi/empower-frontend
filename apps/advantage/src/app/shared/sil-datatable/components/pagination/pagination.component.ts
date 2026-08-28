import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import _ from 'underscore';

/**
 * Component that controls datatable pagination
 */
@Component({
    selector: 'sil-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    standalone: false,
})

/**
 * Class that defines pagination controls, methods and lifecycle hooks
 */
export class PaginationComponent implements OnInit, OnChanges {
    /**
     * Contains the item count
     */
    @Input() itemCount: any;
    /**
     * Contains the total number of items (for FHIR endpoints)
     */
    @Input() totalItems: number = 0;

    /**
     * namespace for the pagination param
     */
    @Input() namespace: string;

    /**
     * Contains the page size (for FHIR endpoints)
     */
    @Input() pageSize: number = 20;

    /**
     * Contains pagination data from server
     */
    @Input() paginationData: any;

    @Input() isGraphqlEndpoint: boolean = false;
    @Input() isFhirEndpoint: boolean = false;

    @Input() pageGroupSize: number = 0;
    pageList: number[] = [];

    /**
     * Namespaced page param key
     */
    pageKey: string;

    /**
     * Current page number
     */
    currentPage: number = 1;
    /**
     * Total number of pages
     */
    totalPages: number = 1;
    /**
     * Event that sends pagination preference to an api
     */
    @Output() pageEvent = new EventEmitter<any>();
    /**
     * Disables previous control
     */
    disablePrevious: boolean = false;
    /**
     * Disables next control
     */
    disableNext: boolean = false;

    /**
     * Empty constructor
     */
    constructor() {}

    /**
     * Extract pagination parameters from FHIR URL
     */
    private extractFhirPaginationParams(
        url: string
    ): { offset: number; count: number; getpages?: string } | null {
        if (!url || typeof url !== 'string' || url.trim() === '') {
            return null;
        }
        try {
            const urlObj = new URL(url);
            const offset = parseInt(
                urlObj.searchParams.get('_getpagesoffset') || '0',
                10
            );
            const count = parseInt(
                urlObj.searchParams.get('_count') || '20',
                10
            );
            const getpages = urlObj.searchParams.get('_getpages') || undefined;
            return { offset, count, getpages };
        } catch (error) {
            console.error(
                'Error extracting FHIR pagination parameters:',
                error
            );
            return null;
        }
    }

    /**
     * Extract page number from URL for REST endpoints
     */
    private extractPageFromUrl(url: string): number | null {
        if (!url || typeof url !== 'string' || url.trim() === '') {
            return null;
        }

        try {
            const urlObj = new URL(url);
            const page = urlObj.searchParams.get('page');
            if (page) {
                const pageNum = parseInt(page, 10);
                return pageNum;
            }
        } catch (error) {
            console.error('Error extracting page number from URL:', error);
        }

        return null;
    }

    /**
     * Goes to the next page
     */
    goToNext() {
        if (this.disableNext) {
            return;
        }

        if (this.isGraphqlEndpoint) {
            if (!this.paginationData?.pageInfo?.EndCursor) {
                return;
            }

            const nextPageData = {
                after: this.paginationData.pageInfo.EndCursor,
            };
            this.pageEvent.emit(nextPageData);
        } else if (this.isFhirEndpoint) {
            if (!this.paginationData?.pageInfo?.EndCursor) {
                return;
            }

            const params = this.extractFhirPaginationParams(
                this.paginationData.pageInfo.EndCursor
            );

            if (params) {
                const nextPageData = {
                    offset: params.offset,
                    count: params.count,
                    _getpages: params.getpages,
                };
                this.pageEvent.emit(nextPageData);
            } else {
            }
        } else {
            if (!this.paginationData?.next) {
                console.error('Missing "next" URL in REST pagination data');
                return;
            }

            const nextPage = this.extractPageFromUrl(this.paginationData.next);
            if (nextPage) {
                const nextPageData = { [this.pageKey]: nextPage };
                this.pageEvent.emit(nextPageData);
            } else {
                const nextPageData = {
                    [this.pageKey]: this.paginationData.current_page + 1,
                };
                this.pageEvent.emit(nextPageData);
            }
        }
    }

    /**
     * Goes to the previous page
     */
    goToPrevious() {
        if (this.disablePrevious) {
            return;
        }

        if (this.isGraphqlEndpoint) {
            if (!this.paginationData?.pageInfo?.StartCursor) {
                return;
            }

            const previousPageData = {
                before: this.paginationData.pageInfo.StartCursor,
            };
            this.pageEvent.emit(previousPageData);
        } else if (this.isFhirEndpoint) {
            if (!this.paginationData?.pageInfo?.StartCursor) {
                console.error('Missing StartCursor in FHIR pagination data');
                return;
            }

            const params = this.extractFhirPaginationParams(
                this.paginationData.pageInfo.StartCursor
            );

            if (params) {
                const previousPageData = {
                    offset: params.offset,
                    count: params.count,
                    _getpages: params.getpages,
                };
                this.pageEvent.emit(previousPageData);
            } else {
                console.error(
                    'Failed to extract FHIR pagination parameters for previous page'
                );
            }
        } else {
            if (
                !this.paginationData?.previous &&
                this.paginationData?.current_page > 1
            ) {
                const previousPageData = { [this.pageKey]: 1 };
                this.pageEvent.emit(previousPageData);
                return;
            } else if (!this.paginationData?.previous) {
                console.error('Missing "previous" URL in REST pagination data');
                return;
            }
            const prevPage = this.extractPageFromUrl(
                this.paginationData.previous
            );
            if (prevPage) {
                const previousPageData = { [this.pageKey]: prevPage };
                this.pageEvent.emit(previousPageData);
            } else {
                const previousPageData = {
                    [this.pageKey]: Math.max(
                        1,
                        this.paginationData.current_page - 1
                    ),
                };
                this.pageEvent.emit(previousPageData);
            }
        }
    }

    /**
     * Go to page - only on rest
     */
    goToPage(pageNumber: number | string) {
        if (this.isGraphqlEndpoint || this.isFhirEndpoint) {
            return;
        }

        this.pageEvent.emit({ [this.pageKey]: pageNumber });
    }

    /**
     * populate pages that can be navigated to
     */
    populatePageList(pageInfo: RestPagination) {
        const groupSize = this.pageGroupSize || 1;

        if (this.isGraphqlEndpoint || this.isFhirEndpoint) {
            return;
        }

        this.pageList = this.getPageGroup(
            pageInfo.current_page,
            pageInfo.total_pages,
            groupSize
        );
    }

    /**
     * Generates a range of page numbers for pagination, centered around the current `pageNumber`,
     * with a specified `groupSize`. It returns an array which is a list of page numbers to be displayed
     * on the pagination controls.
     *
     * @param {number} pageNumber - The current page number to center the group around.
     * @param {number} totalPages - The total number of available pages.
     * @param {number} groupSize - The number of page numbers to display in the pagination group.
     *
     * @returns {number[]} An array of page numbers for the current pagination group.
     *
     * @example
     * Example with a groupSize of 5 and a pageNumber of 7 out of 10 total pages:
     * getPageGroup(7, 10, 5); // Returns [5, 6, 7, 8, 9]
     *
     * @example
     * Example where the current page is near the start or end of the pages:
     * getPageGroup(1, 10, 5); // Returns [1, 2, 3, 4, 5]
     * getPageGroup(9, 10, 5); // Returns [6, 7, 8, 9, 10]
     */

    getPageGroup(
        pageNumber: number,
        totalPages: number,
        groupSize: number
    ): number[] {
        const halfGroup = Math.floor(groupSize / 2);
        let startPage = Math.max(1, pageNumber - halfGroup);
        const endPage = Math.min(startPage + groupSize - 1, totalPages);

        if (endPage - startPage + 1 < groupSize) {
            startPage = Math.max(1, endPage - groupSize + 1);
        }

        const result = Array.from(
            { length: endPage - startPage + 1 },
            (_unused, index) => startPage + index
        );

        return result;
    }

    /**
     * Calculates the current page number based on offset and count
     */
    private calculateCurrentPage(): void {
        if (this.isFhirEndpoint && this.paginationData?.pageInfo?.StartCursor) {
            const params = this.extractFhirPaginationParams(
                this.paginationData.pageInfo.StartCursor
            );
            if (params && this.pageSize > 0) {
                this.currentPage =
                    Math.floor(params.offset / this.pageSize) + 1;
            } else {
                this.currentPage = 1;
            }
        } else if (this.isGraphqlEndpoint && this.paginationData?.pageInfo) {
            this.currentPage = 1;
        } else if (this.paginationData?.current_page) {
            this.currentPage = this.paginationData.current_page;
        } else {
            this.currentPage = 1;
        }
    }

    /**
     * Calculates the total number of pages based on totalItems and pageSize
     */
    private calculateTotalPages(): void {
        let itemCount = this.totalItems;
        if (
            !this.isGraphqlEndpoint &&
            !this.isFhirEndpoint &&
            this.paginationData?.count
        ) {
            itemCount = this.paginationData.count;
        }

        if (itemCount > 0 && this.pageSize > 0) {
            this.totalPages = Math.ceil(itemCount / this.pageSize);
        } else if (this.paginationData?.total_pages) {
            this.totalPages = this.paginationData.total_pages;
        } else {
            this.totalPages = 1;
        }
    }

    /**
     * Updates button states based on pagination data and endpoint type
     */
    private updateButtonStates(): void {
        this.disableNext = false;
        this.disablePrevious = false;

        let itemCount = this.totalItems;
        if (
            !this.isGraphqlEndpoint &&
            !this.isFhirEndpoint &&
            this.paginationData?.count
        ) {
            itemCount = this.paginationData.count;
        }

        if (itemCount === 0) {
            this.disableNext = true;
            this.disablePrevious = true;
            return;
        }

        if (this.isFhirEndpoint) {
            const fhirData = this.paginationData as FhirPagination;

            this.disableNext =
                !fhirData.pageInfo?.HasNextPage ||
                !fhirData.pageInfo?.EndCursor;

            this.disablePrevious =
                !fhirData.pageInfo?.HasPreviousPage ||
                !fhirData.pageInfo?.StartCursor;
        } else if (this.isGraphqlEndpoint) {
            const graphqlData = this.paginationData as GraphQLPagination;

            this.disableNext = !graphqlData.pageInfo?.HasNextPage;
            this.disablePrevious = !graphqlData.pageInfo?.HasPreviousPage;
        } else {
            const restData = this.paginationData as RestPagination;
            this.disableNext = !restData.next;
            this.disablePrevious = !restData.previous;
        }
    }

    ngOnInit() {
        if (this.namespace === undefined || this.namespace === '') {
            this.pageKey = 'page';
        } else {
            this.pageKey = `${this.namespace}_page`;
        }
    }

    /**
     * Detects changes in pagination data
     */
    ngOnChanges(changes: SimpleChanges) {
        if (_.has(changes, 'paginationData')) {
            if (this.paginationData) {
                if (
                    !this.isGraphqlEndpoint &&
                    !this.isFhirEndpoint &&
                    this.paginationData.count
                ) {
                    this.totalItems = this.paginationData.count;
                }

                this.calculateTotalPages();
                this.calculateCurrentPage();
                this.updateButtonStates();

                if (
                    !this.isGraphqlEndpoint &&
                    !this.isFhirEndpoint &&
                    this.paginationData
                ) {
                    this.populatePageList(this.paginationData);
                }
            }
        }

        if (_.has(changes, 'totalItems') || _.has(changes, 'pageSize')) {
            this.calculateTotalPages();
            this.updateButtonStates();
        }
    }
}

interface RestPagination {
    count: number;
    current_page: number;
    end_index: number;
    next: string | number;
    page_size: number;
    previous: string | number;
    start_index: number;
    total_pages: number;
}

interface GraphQLPagination {
    pageInfo: {
        EndCursor: number;
        HasNextPage: boolean;
        HasPreviousPage: boolean;
        StartCursor: string;
    };
}

interface FhirPagination {
    pageInfo: {
        EndCursor: string;
        HasNextPage: boolean;
        HasPreviousPage: boolean;
        StartCursor: string;
        totalCount?: number;
    };
}
