import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { UserGuideDetailsComponent } from './user-guide-details.component';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { StateService } from '@uirouter/core';
import { UserGuideMenuService } from '../user-guide-menu.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'translate',
    standalone: false,
})
class MockTranslatePipe implements PipeTransform {
    transform(value: string): string {
        return value;
    }
}

describe('UserGuideDetailsComponent', () => {
    let component: UserGuideDetailsComponent;
    let fixture: ComponentFixture<UserGuideDetailsComponent>;
    let mockDataLayer: jasmine.SpyObj<SilStoresService>;
    let mockStateService: jasmine.SpyObj<StateService>;
    let mockUserGuideMenuService: jasmine.SpyObj<UserGuideMenuService>;
    let mockErrorHandler: jasmine.SpyObj<ErrorHandlerService>;
    let iframeUrlSubject: BehaviorSubject<string>;

    beforeEach(async () => {
        mockDataLayer = jasmine.createSpyObj('SilStoresService', ['list']);
        mockStateService = jasmine.createSpyObj('StateService', ['go'], {
            params: { topicId: '1' },
        });

        iframeUrlSubject = new BehaviorSubject<string>('https://example.com');
        mockUserGuideMenuService = jasmine.createSpyObj(
            'UserGuideMenuService',
            ['setMenuItems', 'setIframeUrl', 'setActiveSubtopicId']
        );
        Object.defineProperty(mockUserGuideMenuService, 'iframeUrl$', {
            get: () => iframeUrlSubject.asObservable(),
            configurable: true,
        });
        mockUserGuideMenuService.setIframeUrl.and.callFake((url: string) => {
            iframeUrlSubject.next(url);
        });

        const activeSubtopicIdSubject = new BehaviorSubject<string | undefined>(
            undefined
        );
        mockUserGuideMenuService.activeSubtopicIdSubject =
            activeSubtopicIdSubject;

        mockErrorHandler = jasmine.createSpyObj('ErrorHandlerService', [
            'handleError',
        ]);

        await TestBed.configureTestingModule({
            declarations: [UserGuideDetailsComponent, MockTranslatePipe],
            providers: [
                { provide: SilStoresService, useValue: mockDataLayer },
                { provide: StateService, useValue: mockStateService },
                {
                    provide: UserGuideMenuService,
                    useValue: mockUserGuideMenuService,
                },
                { provide: ErrorHandlerService, useValue: mockErrorHandler },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(UserGuideDetailsComponent);
        component = fixture.componentInstance;
    });

    it('should handle missing topicId in state parameters', () => {
        Object.defineProperty(mockStateService, 'params', { value: {} });

        component.ngOnInit();

        expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
            new Error('No topicId found in state parameters.')
        );
        expect(mockStateService.go).toHaveBeenCalledWith('app.userguide.list');
    });

    it('should call fetchTopicDetails with the correct topicId on init', () => {
        spyOn(component, 'fetchTopicDetails');
        component.ngOnInit();
        expect(component.fetchTopicDetails).toHaveBeenCalledWith('1');
    });

    it('should subscribe to iframeUrl$ and update iframeUrl', () => {
        mockDataLayer.list.and.returnValue(
            of({
                results: [
                    { id: '1', title: 'Topic 1', parent: null },
                    {
                        id: '2',
                        title: 'Subtopic 1-1',
                        parent: '1',
                        url: 'https://example.com',
                    },
                ],
            })
        );

        component.ngOnInit();
        expect(component.iframeUrl).toBe('https://example.com');

        iframeUrlSubject.next('https://new-example.com');
        expect(component.iframeUrl).toBe('https://new-example.com');
    });

    it('should warn if iframeUrl$ is undefined in UserGuideMenuService', () => {
        Object.defineProperty(mockUserGuideMenuService, 'iframeUrl$', {
            get: () => undefined,
            configurable: true,
        });

        const warnSpy = spyOn(console, 'warn');

        mockDataLayer.list.and.returnValue(
            of({
                results: [
                    { id: '1', title: 'Topic 1', parent: null },
                    {
                        id: '2',
                        title: 'Subtopic 1-1',
                        parent: '1',
                        url: 'https://example.com',
                    },
                ],
            })
        );

        component.ngOnInit();

        expect(warnSpy).toHaveBeenCalledWith(
            'iframeUrl$ is undefined in UserGuideMenuService.'
        );
    });

    it('should fetch topic details and set menu items', () => {
        const mockData = {
            results: [
                {
                    id: '1',
                    title: 'Topic 1',
                    parent: null,
                    subtopics: [
                        {
                            id: '2',
                            title: 'Subtopic 1-1',
                            url: 'https://example.com',
                        },
                    ],
                },
            ],
        };
        mockDataLayer.list.and.returnValue(of(mockData));

        component.fetchTopicDetails('1');

        expect(mockDataLayer.list).toHaveBeenCalledWith('userguides');
        expect(component.topic).toEqual({
            id: '1',
            title: 'Topic 1',
            parent: null,
            subtopics: [
                {
                    id: '2',
                    title: 'Subtopic 1-1',
                    url: 'https://example.com',
                },
            ],
        });
        expect(component.subtopics).toEqual([
            {
                id: '2',
                title: 'Subtopic 1-1',
                url: 'https://example.com',
            },
        ]);
        expect(mockUserGuideMenuService.setMenuItems).toHaveBeenCalledWith([
            {
                title: 'Topic 1',
                icon: 'book-outline',
                id: '1',
                subtopics: [
                    {
                        title: 'Subtopic 1-1',
                        icon: 'file-text-outline',
                        url: 'https://example.com',
                        id: '2',
                    },
                ],
            },
        ]);
        expect(mockUserGuideMenuService.setIframeUrl).toHaveBeenCalledWith(
            'https://example.com'
        );
        expect(
            mockUserGuideMenuService.setActiveSubtopicId
        ).toHaveBeenCalledWith('2');
    });

    it('should handle topic not found', () => {
        const mockData = { results: [] };
        mockDataLayer.list.and.returnValue(of(mockData));

        component.fetchTopicDetails('1');

        expect(component.topic).toBeUndefined();
        expect(component.errorMessage).toBe(
            'The selected topic could not be found.'
        );
        expect(component.loading).toBeFalse();
    });

    it('should handle topic with no subtopics', fakeAsync(() => {
        const mockData = {
            results: [
                { id: '1', title: 'Topic 1', parent: null, subtopics: [] },
            ],
        };
        mockDataLayer.list.and.returnValue(of(mockData));

        component.fetchTopicDetails('1');
        tick();

        expect(component.subtopics).toEqual([]);
        expect(component.iframeUrl).toBe('');
        expect(component.errorMessage).toBe(
            'This topic does not have any subtopics.'
        );
    }));

    it('should handle topic with missing subtopics property', fakeAsync(() => {
        const mockData = {
            results: [{ id: '1', title: 'Topic 1', parent: null }],
        };
        mockDataLayer.list.and.returnValue(of(mockData));

        component.fetchTopicDetails('1');
        tick();

        expect(component.subtopics).toEqual([]);
        expect(component.iframeUrl).toBe('');
        expect(component.errorMessage).toBe(
            'This topic does not have any subtopics.'
        );
    }));

    it('should handle when active subtopic id does not match any subtopic', fakeAsync(() => {
        const mockData = {
            results: [
                { id: '1', title: 'Topic 1', parent: null },
                {
                    id: '2',
                    title: 'Subtopic 1-1',
                    parent: '1',
                    url: 'https://example.com',
                },
            ],
        };
        mockDataLayer.list.and.returnValue(of(mockData));
        mockUserGuideMenuService.activeSubtopicIdSubject.next(
            'non-existent-id'
        );
        component.fetchTopicDetails('1');
        tick();

        expect(component.iframeUrl).toBe('');
        expect(component.errorMessage).toBe(
            'This topic does not have any subtopics.'
        );
    }));

    it('should handle subtopic with no URL', fakeAsync(() => {
        const mockData = {
            results: [
                {
                    id: '1',
                    title: 'Topic 1',
                    parent: null,
                    subtopics: [{ id: '2', title: 'Subtopic 1-1' }],
                },
            ],
        };
        mockDataLayer.list.and.returnValue(of(mockData));

        component.fetchTopicDetails('1');
        tick();

        expect(component.iframeUrl).toBe('');
        expect(component.errorMessage).toBe(
            'The subtopic does not have a valid URL.'
        );
    }));

    it('should handle errors during fetchTopicDetails', () => {
        mockDataLayer.list.and.returnValue(
            throwError(() => new Error('Fetch error'))
        );

        component.fetchTopicDetails('1');

        expect(mockErrorHandler.handleError).toHaveBeenCalled();
    });

    it('should handle topic in menuItems with no subtopics property (empty array branch)', fakeAsync(() => {
        const mockData = {
            results: [
                {
                    id: '1',
                    title: 'Topic 1',
                    parent: null,
                    subtopics: [
                        {
                            id: '2',
                            title: 'Subtopic 1-1',
                            url: 'https://example.com',
                        },
                    ],
                },
                { id: '2', title: 'Topic 2', parent: null },
            ],
        };
        mockDataLayer.list.and.returnValue(of(mockData));

        component.fetchTopicDetails('1');
        tick();

        expect(mockUserGuideMenuService.setMenuItems).toHaveBeenCalledWith([
            {
                title: 'Topic 1',
                icon: 'book-outline',
                id: '1',
                subtopics: [
                    {
                        title: 'Subtopic 1-1',
                        icon: 'file-text-outline',
                        url: 'https://example.com',
                        id: '2',
                    },
                ],
            },
            {
                title: 'Topic 2',
                icon: 'book-outline',
                id: '2',
                subtopics: [],
            },
        ]);
    }));

    it('should select subtopic by activeSubtopicId if set', fakeAsync(() => {
        const mockData = {
            results: [
                {
                    id: '1',
                    title: 'Topic 1',
                    parent: null,
                    subtopics: [
                        {
                            id: '2',
                            title: 'Subtopic 1-1',
                            url: 'https://example.com',
                        },
                        {
                            id: '3',
                            title: 'Subtopic 1-2',
                            url: 'https://example2.com',
                        },
                    ],
                },
            ],
        };
        mockDataLayer.list.and.returnValue(of(mockData));
        mockUserGuideMenuService.activeSubtopicIdSubject.next('3');

        component.fetchTopicDetails('1');
        tick();

        expect(component.iframeUrl).toBe('https://example2.com');
        expect(mockUserGuideMenuService.setIframeUrl).toHaveBeenCalledWith(
            'https://example2.com'
        );
        expect(
            mockUserGuideMenuService.setActiveSubtopicId
        ).toHaveBeenCalledWith('3');
    }));

    it('should show error if activeSubtopicId does not match any subtopic', fakeAsync(() => {
        const mockData = {
            results: [
                {
                    id: '1',
                    title: 'Topic 1',
                    parent: null,
                    subtopics: [
                        {
                            id: '2',
                            title: 'Subtopic 1-1',
                            url: 'https://example.com',
                        },
                    ],
                },
            ],
        };
        mockDataLayer.list.and.returnValue(of(mockData));
        mockUserGuideMenuService.activeSubtopicIdSubject.next(
            'non-existent-id'
        );

        component.fetchTopicDetails('1');
        tick();

        expect(component.iframeUrl).toBe('');
        expect(component.errorMessage).toBe(
            'This topic does not have any subtopics.'
        );
    }));

    it('should toggle submenus', () => {
        component.toggleSubMenu('menu1');
        expect(component.subMenuToggle['menu1']).toBeTrue();

        component.toggleSubMenu('menu1');
        expect(component.subMenuToggle['menu1']).toBeFalse();
    });

    it('should navigate back to the list', () => {
        component.goBackToList();

        expect(mockStateService.go).toHaveBeenCalledWith(
            'app.userguide.list',
            {},
            { reload: true }
        );
    });
});
