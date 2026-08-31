import { CommonModule } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    SimpleChange,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { PaginationComponent } from './pagination.component';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('PaginationComponent', () => {
    let component: PaginationComponent;
    let fixture: ComponentFixture<PaginationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            declarations: [PaginationComponent],
            imports: [CommonModule],
            providers: [
                Authorization,
                AppConfigService,
                Oauth2Service,
                DataLayerUtils,
                { provide: SilStoresService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { params: { id: '24fkzrw3487943uf358lovd' } },
                    },
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;
    });

    it('should disable next button when paginationData.next is null', () => {
        component.paginationData = {
            next: null,
            previous: 'url',
            pageInfo: {
                EndCursor: 'url',
                HasNextPage: true,
                HasPreviousPage: true,
            },
        };
        component.ngOnChanges({
            paginationData: new SimpleChange(
                { next: 'url', previous: null, pageInfo: {} },
                component.paginationData,
                false
            ),
        });
        expect(component.disableNext).toBe(true);
    });

    it('should disable previous button when paginationData.previous is null', () => {
        component.paginationData = {
            next: 'url',
            previous: null,
            pageInfo: {
                EndCursor: 'url',
                HasNextPage: true,
                HasPreviousPage: true,
            },
        };
        component.ngOnChanges({
            paginationData: new SimpleChange(
                { next: null, previous: 'url', pageInfo: {} },
                component.paginationData,
                false
            ),
        });
        expect(component.disablePrevious).toBe(true);
    });

    it('should enable both next and previous buttons when paginationData.next and paginationData.previous are not null', () => {
        component.paginationData = {
            next: 'url',
            previous: 'url',
            pageInfo: {
                EndCursor: 'url',
                HasNextPage: true,
                HasPreviousPage: true,
            },
            current_page: 1,
            total_pages: 5,
            count: 100,
            page_size: 20,
        };
        component.totalItems = 100;
        component.pageSize = 20;
        component.ngOnChanges({
            paginationData: new SimpleChange(
                { next: null, previous: null, pageInfo: {} },
                component.paginationData,
                false
            ),
        });
        expect(component.disableNext).toBe(false);
        expect(component.disablePrevious).toBe(false);
    });

    it('should emit the next page data when goToNext is called', () => {
        component.paginationData = {
            current_page: 1,
            next: 'https://example.com/api/endpoint?page=2',
            pageInfo: {
                EndCursor: 'url',
                HasNextPage: true,
                HasPreviousPage: true,
            },
        };
        component.pageKey = 'page';
        spyOn(component.pageEvent, 'emit');
        component.goToNext();
        expect(component.pageEvent.emit).toHaveBeenCalledWith({ page: 2 });
    });

    it('should emit the previous page data when goToPrevious is called', () => {
        component.paginationData = {
            current_page: 2,
            previous: 'https://example.com/api/endpoint?page=1',
            pageInfo: {
                EndCursor: 'url',
                HasNextPage: true,
                HasPreviousPage: true,
            },
        };
        component.pageKey = 'page';
        spyOn(component.pageEvent, 'emit');
        component.goToPrevious();
        expect(component.pageEvent.emit).toHaveBeenCalledWith({ page: 1 });
    });

    it('should emit the next page data with "after" property when isGraphqlEndpoint is true', () => {
        component.isGraphqlEndpoint = true;
        component.paginationData = {
            current_page: 1,
            pageInfo: {
                EndCursor: 'url',
                HasNextPage: true,
                HasPreviousPage: true,
            },
        };
        spyOn(component.pageEvent, 'emit');
        component.goToNext();
        expect(component.pageEvent.emit).toHaveBeenCalledWith({ after: 'url' });
    });

    it('should emit the previous page data with "before" property when isGraphqlEndpoint is true', () => {
        component.isGraphqlEndpoint = true;
        component.paginationData = {
            current_page: 2,
            pageInfo: {
                EndCursor: 'url',
                HasNextPage: true,
                HasPreviousPage: true,
                StartCursor: 'url',
            },
        };
        spyOn(component.pageEvent, 'emit');
        component.goToPrevious();
        expect(component.pageEvent.emit).toHaveBeenCalledWith({
            before: 'url',
        });
    });

    it('should disable next button when isGraphqlEndpoint is true and pageInfo.HasNextPage is false', () => {
        component.isGraphqlEndpoint = true;
        component.paginationData = {
            current_page: 1,
            pageInfo: {
                EndCursor: 'url',
                HasNextPage: false,
                HasPreviousPage: true,
            },
        };
        component.ngOnChanges({
            paginationData: new SimpleChange(
                { next: null, previous: null, pageInfo: {} },
                component.paginationData,
                false
            ),
        });
        expect(component.disableNext).toBe(true);
    });

    it('getPageGroup: should group pages correctly', () => {
        expect(component.getPageGroup(1, 10, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(component.getPageGroup(9, 10, 5)).toEqual([6, 7, 8, 9, 10]);
    });

    it('goToPage: should emit target page event', () => {
        component.isGraphqlEndpoint = false;
        component.isFhirEndpoint = false;
        component.pageKey = 'page';
        spyOn(component.pageEvent, 'emit');

        component.goToPage(2);

        expect(component.pageEvent.emit).toHaveBeenCalledWith({
            page: 2,
        });
    });

    it('goToPage: should return early if isGraphQLEndpoint or isFhirEndpoint', () => {
        component.isGraphqlEndpoint = true;
        component.isFhirEndpoint = false;
        spyOn(component.pageEvent, 'emit');

        component.goToPage(2);

        expect(component.pageEvent.emit).not.toHaveBeenCalled();

        component.isGraphqlEndpoint = false;
        component.isFhirEndpoint = true;
        component.goToPage(2);
        expect(component.pageEvent.emit).not.toHaveBeenCalled();
    });

    it('populatePageList', () => {
        component.isGraphqlEndpoint = false;
        component.isFhirEndpoint = false;
        component.pageGroupSize = 5;
        const paginationData = {
            current_page: 1,
            total_pages: 20,
        };

        component.populatePageList(paginationData as any);
        const expected = component.getPageGroup(
            paginationData.current_page,
            paginationData.total_pages,
            component.pageGroupSize
        );

        expect(component.pageList).toEqual(expected);
    });

    it('populatePageList: should return early if isGraphQLEndpoint or isFhirEndpoint', () => {
        component.isGraphqlEndpoint = true;
        component.isFhirEndpoint = false;
        component.pageGroupSize = 5;
        const paginationData = {
            current_page: 1,
            total_pages: 20,
        };
        spyOn(component, 'getPageGroup');

        component.populatePageList(paginationData as any);
        expect(component.getPageGroup).not.toHaveBeenCalled();

        component.isGraphqlEndpoint = false;
        component.isFhirEndpoint = true;
        component.populatePageList(paginationData as any);
        expect(component.getPageGroup).not.toHaveBeenCalled();
    });

    it('ngOnChanges: should populate navigatable page list when pageData changes', () => {
        component.isGraphqlEndpoint = false;
        component.isFhirEndpoint = false;
        component.pageGroupSize = 5;
        component.paginationData = {
            current_page: 1,
            total_pages: 20,
            count: 200,
            page_size: 10,
            next: 'url',
            previous: null,
            start_index: 0,
            end_index: 0,
        };
        component.totalItems = 200;
        component.pageSize = 10;

        spyOn(component, 'populatePageList');

        component.ngOnChanges({
            paginationData: new SimpleChange(
                null,
                component.paginationData,
                true
            ),
        });

        expect(component.populatePageList).toHaveBeenCalledWith(
            component.paginationData
        );
    });

    it('should emit FHIR next page data when goToNext is called and isFhirEndpoint is true', () => {
        component.isFhirEndpoint = true;
        component.paginationData = {
            pageInfo: {
                EndCursor:
                    'http://example.com?_getpagesoffset=20&_count=10&_getpages=some_id',
                HasNextPage: true,
                HasPreviousPage: true,
            },
        };
        spyOn(component.pageEvent, 'emit');
        component.goToNext();
        expect(component.pageEvent.emit).toHaveBeenCalledWith({
            offset: 20,
            count: 10,
            _getpages: 'some_id',
        });
    });

    it('should emit FHIR previous page data when goToPrevious is called and isFhirEndpoint is true', () => {
        component.isFhirEndpoint = true;
        component.paginationData = {
            pageInfo: {
                StartCursor:
                    'http://example.com?_getpagesoffset=0&_count=10&_getpages=another_id',
                HasNextPage: true,
                HasPreviousPage: true,
            },
        };
        spyOn(component.pageEvent, 'emit');
        component.goToPrevious();
        expect(component.pageEvent.emit).toHaveBeenCalledWith({
            offset: 0,
            count: 10,
            _getpages: 'another_id',
        });
    });

    it('should disable next button when isFhirEndpoint is true and pageInfo.HasNextPage is false', () => {
        component.isFhirEndpoint = true;
        component.paginationData = {
            pageInfo: {
                EndCursor: 'url',
                HasNextPage: false,
                HasPreviousPage: true,
            },
        };
        component.ngOnChanges({
            paginationData: new SimpleChange(
                { next: null, previous: null, pageInfo: {} },
                component.paginationData,
                false
            ),
        });
        expect(component.disableNext).toBe(true);
    });

    it('should disable next button when isFhirEndpoint is true and pageInfo.EndCursor is null', () => {
        component.isFhirEndpoint = true;
        component.paginationData = {
            pageInfo: {
                EndCursor: null,
                HasNextPage: true,
                HasPreviousPage: true,
            },
        };
        component.ngOnChanges({
            paginationData: new SimpleChange(
                { next: null, previous: null, pageInfo: {} },
                component.paginationData,
                false
            ),
        });
        expect(component.disableNext).toBe(true);
    });

    it('should disable previous button when isFhirEndpoint is true and pageInfo.HasPreviousPage is false', () => {
        component.isFhirEndpoint = true;
        component.paginationData = {
            pageInfo: {
                EndCursor: 'url',
                HasNextPage: true,
                HasPreviousPage: false,
            },
        };
        component.ngOnChanges({
            paginationData: new SimpleChange(
                { next: null, previous: null, pageInfo: {} },
                component.paginationData,
                false
            ),
        });
        expect(component.disablePrevious).toBe(true);
    });

    it('should enable next and previous buttons when isFhirEndpoint is true and both HasNextPage/HasPreviousPage and EndCursor/StartCursor are present', () => {
        component.isFhirEndpoint = true;
        component.paginationData = {
            pageInfo: {
                EndCursor: 'http://example.com?_getpagesoffset=20&_count=10',
                HasNextPage: true,
                StartCursor: 'http://example.com?_getpagesoffset=0&_count=10',
                HasPreviousPage: true,
            },
        };
        component.totalItems = 50;
        component.pageSize = 10;
        component.ngOnChanges({
            paginationData: new SimpleChange(
                {
                    pageInfo: {
                        EndCursor: null,
                        HasNextPage: false,
                        StartCursor: null,
                        HasPreviousPage: false,
                    },
                },
                component.paginationData,
                false
            ),
        });
        expect(component.disableNext).toBe(false);
        expect(component.disablePrevious).toBe(false);
    });

    it('should disable both buttons if totalItems is 0', () => {
        component.totalItems = 0;
        component.pageSize = 20;
        component.paginationData = {};
        component.ngOnChanges({
            totalItems: new SimpleChange(10, 0, false),
            paginationData: new SimpleChange(
                null,
                component.paginationData,
                true
            ),
        });
        expect(component.disableNext).toBe(true);
        expect(component.disablePrevious).toBe(true);
    });

    it('should disable both buttons if totalItems is less than or equal to pageSize (and > 0)', () => {
        component.totalItems = 15;
        component.pageSize = 20;
        component.paginationData = {};
        component.ngOnChanges({
            totalItems: new SimpleChange(30, 15, false),
            paginationData: new SimpleChange(
                null,
                component.paginationData,
                true
            ),
        });
        expect(component.disableNext).toBe(true);
        expect(component.disablePrevious).toBe(true);
    });

    it('should not emit event when goToNext is called with disableNext=true', () => {
        component.disableNext = true;
        spyOn(component.pageEvent, 'emit');

        component.goToNext();

        expect(component.pageEvent.emit).not.toHaveBeenCalled();
    });

    it('should not emit event when goToPrevious is called with disablePrevious=true', () => {
        component.disablePrevious = true;
        spyOn(component.pageEvent, 'emit');

        component.goToPrevious();

        expect(component.pageEvent.emit).not.toHaveBeenCalled();
    });

    it('should update button states correctly for GraphQL endpoints', () => {
        component.isGraphqlEndpoint = true;
        component.isFhirEndpoint = false;
        component.paginationData = {
            pageInfo: {
                HasNextPage: false,
                HasPreviousPage: true,
            },
        };
        component.totalItems = 100;
        component.pageSize = 10;

        component.ngOnChanges({
            paginationData: new SimpleChange(
                null,
                component.paginationData,
                true
            ),
        });

        expect(component.disableNext).toBe(true);
        expect(component.disablePrevious).toBe(false);
    });

    describe('calculateCurrentPage', () => {
        it('should calculate current page for FHIR endpoint based on offset and pageSize', () => {
            component.isFhirEndpoint = true;
            component.pageSize = 10;
            component.paginationData = {
                pageInfo: {
                    StartCursor:
                        'http://example.com?_getpagesoffset=20&_count=10',
                },
            };
            component.ngOnChanges({
                paginationData: new SimpleChange(
                    null,
                    component.paginationData,
                    true
                ),
            });
            expect(component.currentPage).toBe(3);
        });

        it('should default to 1 for FHIR endpoint if StartCursor or params are invalid', () => {
            component.isFhirEndpoint = true;
            component.pageSize = 10;
            component.paginationData = {
                pageInfo: {
                    StartCursor: 'invalid-url',
                },
            };
            component.ngOnChanges({
                paginationData: new SimpleChange(
                    null,
                    component.paginationData,
                    true
                ),
            });
            expect(component.currentPage).toBe(1);

            component.paginationData = {
                pageInfo: {
                    StartCursor: null,
                },
            };
            component.ngOnChanges({
                paginationData: new SimpleChange(
                    null,
                    component.paginationData,
                    true
                ),
            });
            expect(component.currentPage).toBe(1);
        });

        it('should set current page to 1 for GraphQL endpoint', () => {
            component.isGraphqlEndpoint = true;
            component.paginationData = {
                pageInfo: {
                    /* any page info */
                },
            };
            component.ngOnChanges({
                paginationData: new SimpleChange(
                    null,
                    component.paginationData,
                    true
                ),
            });
            expect(component.currentPage).toBe(1);
        });

        it('should use current_page for non-GraphQL/FHIR endpoints', () => {
            component.isGraphqlEndpoint = false;
            component.isFhirEndpoint = false;
            component.paginationData = {
                current_page: 5,
            };
            component.ngOnChanges({
                paginationData: new SimpleChange(
                    null,
                    component.paginationData,
                    true
                ),
            });
            expect(component.currentPage).toBe(5);
        });

        it('should default current page to 1 if no relevant pagination data is present', () => {
            component.isGraphqlEndpoint = false;
            component.isFhirEndpoint = false;
            component.paginationData = {};
            component.ngOnChanges({
                paginationData: new SimpleChange(
                    null,
                    component.paginationData,
                    true
                ),
            });
            expect(component.currentPage).toBe(1);
        });
    });

    describe('calculateTotalPages', () => {
        it('should calculate total pages based on totalItems and pageSize', () => {
            component.totalItems = 100;
            component.pageSize = 10;
            component.paginationData = {};
            component.ngOnChanges({
                totalItems: new SimpleChange(0, 100, true),
                paginationData: new SimpleChange(
                    null,
                    component.paginationData,
                    true
                ),
            });
            expect(component.totalPages).toBe(10);

            component.totalItems = 101;
            component.pageSize = 10;
            component.ngOnChanges({
                totalItems: new SimpleChange(100, 101, true),
                paginationData: new SimpleChange(
                    null,
                    component.paginationData,
                    true
                ),
            });
            expect(component.totalPages).toBe(11);
        });

        it('should default total pages to 1 if totalItems is 0 or pageSize is 0', () => {
            component.totalItems = 0;
            component.pageSize = 10;
            component.paginationData = {};
            component.ngOnChanges({
                totalItems: new SimpleChange(10, 0, true),
                paginationData: new SimpleChange(
                    null,
                    component.paginationData,
                    true
                ),
            });
            expect(component.totalPages).toBe(1);

            component.totalItems = 100;
            component.pageSize = 0;
            component.paginationData = {};
            component.ngOnChanges({
                pageSize: new SimpleChange(10, 0, true),
                paginationData: new SimpleChange(
                    null,
                    component.paginationData,
                    true
                ),
            });
            expect(component.totalPages).toBe(1);
        });
    });

    describe('extractFhirPaginationParams', () => {
        it('should correctly extract parameters from a valid FHIR URL', () => {
            const params = component['extractFhirPaginationParams'](
                'http://example.com/fhir?_getpagesoffset=30&_count=15&_getpages=xyz'
            );
            expect(params).toEqual({ offset: 30, count: 15, getpages: 'xyz' });
        });

        it('should handle missing _getpages parameter', () => {
            const params = component['extractFhirPaginationParams'](
                'http://example.com/fhir?_getpagesoffset=30&_count=15'
            );
            expect(params).toEqual({
                offset: 30,
                count: 15,
                getpages: undefined,
            });
        });

        it('should default offset to 0 and count to 20 if not present', () => {
            const params = component['extractFhirPaginationParams'](
                'http://example.com/fhir'
            );
            expect(params).toEqual({
                offset: 0,
                count: 20,
                getpages: undefined,
            });
        });

        it('should return null for an invalid URL', () => {
            const params =
                component['extractFhirPaginationParams']('invalid-url');
            expect(params).toBeNull();
        });

        it('should return null for an empty string URL', () => {
            const params = component['extractFhirPaginationParams']('');
            expect(params).toBeNull();
        });

        it('should return null for a null URL', () => {
            const params = component['extractFhirPaginationParams'](
                null as any
            );
            expect(params).toBeNull();
        });
    });

    it('should return null when extractPageFromUrl is called with invalid URL', () => {
        const result = component['extractPageFromUrl']('invalid-url');
        expect(result).toBeNull();
    });

    it('should return null when extractPageFromUrl is called with empty URL', () => {
        const result = component['extractPageFromUrl']('');
        expect(result).toBeNull();
    });

    it('should return null when extractPageFromUrl is called with null URL', () => {
        const result = component['extractPageFromUrl'](null as any);
        expect(result).toBeNull();
    });

    it('should not emit event when goToNext is called with isGraphqlEndpoint=true but missing EndCursor', () => {
        component.isGraphqlEndpoint = true;
        component.paginationData = {
            pageInfo: {
                EndCursor: null,
                HasNextPage: true,
            },
        };
        spyOn(component.pageEvent, 'emit');

        component.goToNext();

        expect(component.pageEvent.emit).not.toHaveBeenCalled();
    });

    it('should handle error when goToNext is called with isFhirEndpoint=true but extractFhirPaginationParams returns null', () => {
        component.isFhirEndpoint = true;
        component.paginationData = {
            pageInfo: {
                EndCursor: 'invalid-url',
                HasNextPage: true,
            },
        };
        spyOn(component.pageEvent, 'emit');
        spyOn(console, 'error');

        component.goToNext();

        expect(component.pageEvent.emit).not.toHaveBeenCalled();
    });

    it('should handle error when goToNext is called with missing next URL for REST endpoint', () => {
        component.isGraphqlEndpoint = false;
        component.isFhirEndpoint = false;
        component.paginationData = {
            next: null,
        };
        spyOn(component.pageEvent, 'emit');
        spyOn(console, 'error');

        component.goToNext();

        expect(console.error).toHaveBeenCalled();
        expect(component.pageEvent.emit).not.toHaveBeenCalled();
    });

    it('should use current_page + 1 when goToNext is called with invalid next URL for REST endpoint', () => {
        component.ngOnInit();
        component.pageKey = 'page';
        component.isGraphqlEndpoint = false;
        component.isFhirEndpoint = false;
        component.paginationData = {
            next: 'invalid-url',
            current_page: 1,
        };
        spyOn(component.pageEvent, 'emit');

        component.goToNext();

        expect(component.pageEvent.emit).toHaveBeenCalledWith({ page: 2 });
    });

    it('should not emit event when goToPrevious is called with isGraphqlEndpoint=true but missing StartCursor', () => {
        component.isGraphqlEndpoint = true;
        component.paginationData = {
            pageInfo: {
                StartCursor: null,
                HasPreviousPage: true,
            },
        };
        spyOn(component.pageEvent, 'emit');

        component.goToPrevious();

        expect(component.pageEvent.emit).not.toHaveBeenCalled();
    });

    it('should handle error when goToPrevious is called with isFhirEndpoint=true but missing StartCursor', () => {
        component.isFhirEndpoint = true;
        component.paginationData = {
            pageInfo: {
                StartCursor: null,
                HasPreviousPage: true,
            },
        };
        spyOn(component.pageEvent, 'emit');
        spyOn(console, 'error');

        component.goToPrevious();

        expect(console.error).toHaveBeenCalled();
        expect(component.pageEvent.emit).not.toHaveBeenCalled();
    });

    it('should handle error when goToPrevious is called with isFhirEndpoint=true but extractFhirPaginationParams returns null', () => {
        component.isFhirEndpoint = true;
        component.paginationData = {
            pageInfo: {
                StartCursor: 'invalid-url',
                HasPreviousPage: true,
            },
        };
        spyOn(component.pageEvent, 'emit');
        spyOn(console, 'error');

        component.goToPrevious();

        expect(console.error).toHaveBeenCalled();
        expect(component.pageEvent.emit).not.toHaveBeenCalled();
    });

    it('should go to page 1 when goToPrevious is called with current_page > 1 but no previous URL', () => {
        component.isGraphqlEndpoint = false;
        component.isFhirEndpoint = false;
        component.pageKey = 'page';
        component.paginationData = {
            previous: null,
            current_page: 2,
        };
        spyOn(component.pageEvent, 'emit');

        component.goToPrevious();

        expect(component.pageEvent.emit).toHaveBeenCalledWith({ page: 1 });
    });

    it('should handle error when goToPrevious is called with missing previous URL for REST endpoint', () => {
        component.isGraphqlEndpoint = false;
        component.isFhirEndpoint = false;
        component.paginationData = {
            previous: null,
            current_page: 1,
        };
        spyOn(component.pageEvent, 'emit');
        spyOn(console, 'error');

        component.goToPrevious();

        expect(console.error).toHaveBeenCalled();
        expect(component.pageEvent.emit).not.toHaveBeenCalled();
    });

    it('should use current_page - 1 when goToPrevious is called with invalid previous URL for REST endpoint', () => {
        component.isGraphqlEndpoint = false;
        component.isFhirEndpoint = false;
        component.pageKey = 'page';
        component.paginationData = {
            previous: 'invalid-url',
            current_page: 2,
        };
        spyOn(component.pageEvent, 'emit');

        component.goToPrevious();

        expect(component.pageEvent.emit).toHaveBeenCalledWith({ page: 1 });
    });

    it('should use total_pages from paginationData when available', () => {
        component.isGraphqlEndpoint = false;
        component.isFhirEndpoint = false;
        component.totalItems = 0;
        component.pageSize = 0;
        component.paginationData = {
            total_pages: 15,
        };

        component.ngOnChanges({
            paginationData: new SimpleChange(
                null,
                component.paginationData,
                true
            ),
        });

        expect(component.totalPages).toBe(15);
    });

    it('should not emit event when goToNext is called with isFhirEndpoint=true but missing EndCursor', () => {
        component.isFhirEndpoint = true;
        component.isGraphqlEndpoint = false;
        component.paginationData = {
            pageInfo: {
                EndCursor: null,
                HasNextPage: true,
            },
        };
        spyOn(component.pageEvent, 'emit');

        component.goToNext();

        expect(component.pageEvent.emit).not.toHaveBeenCalled();
    });

    it('should test when a namespace is added to page param', () => {
        component.namespace = 'member_detail';
        component.ngOnInit();
        expect(component.pageKey).toBe('member_detail_page');
    });
});
