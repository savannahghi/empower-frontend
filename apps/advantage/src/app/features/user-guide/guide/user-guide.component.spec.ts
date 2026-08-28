import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserGuideComponent } from './user-guide.component';
import { SilStoresService } from '../../../../app/shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { StateService } from '@uirouter/core';
import { UserGuideMenuService } from '../user-guide-menu.service';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Pipe({
    name: 'translate',
    standalone: false,
})
class MockTranslatePipe implements PipeTransform {
    transform(value: string): string {
        return value;
    }
}

class SilStoresServiceStub {
    list() {
        return of({
            count: 10,
            next: null,
            previous: null,
            page_size: 50,
            current_page: 1,
            total_pages: 1,
            start_index: 1,
            end_index: 10,
            results: [
                {
                    id: '48631a64-399a-4078-bf2a-6c98d807bd81',
                    title: 'How to Schedule an Appointment in Slade Advantage',
                    url: 'https://scribehow.com/embed/How_to_Schedule_an_Appointment_in_Slade_Advantage__QTDKB6OYTeqtcuH0OpvnIA',
                    parent: '77de9df8-ee1a-4763-84fa-6881264df811',
                    subtopics: [],
                },
                {
                    id: 'ec512f22-0f43-4636-98f1-359bf4e43e2d',
                    title: 'How To Check In A Patient Using Slade Advantage',
                    url: 'https://scribehow.com/embed/How_To_Check_In_A_Patient_Using_Slade_Advantage__kjEIAK0lQf2gOiwqnD83Og',
                    parent: '77de9df8-ee1a-4763-84fa-6881264df811',
                    subtopics: [],
                },
                {
                    id: '77de9df8-ee1a-4763-84fa-6881264df811',
                    title: 'Check-ins and Appointments',
                    url: null,
                    parent: null,
                    subtopics: [
                        {
                            id: '48631a64-399a-4078-bf2a-6c98d807bd81',
                            title: 'How to Schedule an Appointment in Slade Advantage',
                            parent: '77de9df8-ee1a-4763-84fa-6881264df811',
                            url: 'https://scribehow.com/embed/How_to_Schedule_an_Appointment_in_Slade_Advantage__QTDKB6OYTeqtcuH0OpvnIA',
                        },
                        {
                            id: 'ec512f22-0f43-4636-98f1-359bf4e43e2d',
                            title: 'How To Check In A Patient Using Slade Advantage',
                            parent: '77de9df8-ee1a-4763-84fa-6881264df811',
                            url: 'https://scribehow.com/embed/How_To_Check_In_A_Patient_Using_Slade_Advantage__kjEIAK0lQf2gOiwqnD83Og',
                        },
                    ],
                },
            ],
        });
    }
}

describe('UserGuideComponent', () => {
    let component: UserGuideComponent;
    let fixture: ComponentFixture<UserGuideComponent>;
    let mockToastrService: jasmine.SpyObj<NbToastrService>;
    let mockErrorHandler: jasmine.SpyObj<ErrorHandlerService>;
    let mockStateService: jasmine.SpyObj<StateService>;
    let mockUserGuideMenuService: jasmine.SpyObj<UserGuideMenuService>;
    beforeEach(async () => {
        mockToastrService = jasmine.createSpyObj('NbToastrService', [
            'success',
            'danger',
        ]);
        mockErrorHandler = jasmine.createSpyObj('ErrorHandlerService', [
            'handleError',
        ]);
        mockStateService = jasmine.createSpyObj('StateService', ['go']);
        mockUserGuideMenuService = jasmine.createSpyObj(
            'UserGuideMenuService',
            [
                'setUserGuideMenu',
                'setIframeUrl',
                'setUserGuideDetailsMenu',
                'setActiveSubtopicId',
            ]
        );

        await TestBed.configureTestingModule({
            declarations: [UserGuideComponent, MockTranslatePipe],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useValue: mockToastrService },
                { provide: ErrorHandlerService, useValue: mockErrorHandler },
                { provide: StateService, useValue: mockStateService },
                {
                    provide: UserGuideMenuService,
                    useValue: mockUserGuideMenuService,
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(UserGuideComponent);
        component = fixture.componentInstance;
    });

    it('should call fetchUserGuides on init', () => {
        spyOn(component, 'fetchUserGuides');
        component.ngOnInit();
        expect(component.fetchUserGuides).toHaveBeenCalled();
    });

    it('should fetch user guides and set topics', () => {
        spyOn(component, 'fetchUserGuides').and.callThrough();
        component.fetchUserGuides();

        expect(component.topics).toEqual([
            jasmine.objectContaining({
                id: '77de9df8-ee1a-4763-84fa-6881264df811',
                title: 'Check-ins and Appointments',
                subtopics: jasmine.arrayContaining([
                    jasmine.objectContaining({
                        id: '48631a64-399a-4078-bf2a-6c98d807bd81',
                        url: jasmine.any(String),
                    }),
                    jasmine.objectContaining({
                        id: 'ec512f22-0f43-4636-98f1-359bf4e43e2d',
                        url: jasmine.any(String),
                    }),
                ]),
            }),
        ]);
    });

    it('viewTopic: should navigate and set iframeUrl for valid topic with subtopic URL', () => {
        const topic = {
            id: '1',
            title: 'Topic',
            subtopics: [
                { id: '2', title: 'Subtopic', url: 'https://example.com' },
            ],
        };

        component.viewTopic(topic);

        expect(mockStateService.go).toHaveBeenCalledWith(
            'app.userguide.list.topic',
            { topicName: 'topic', topicId: '1' },
            { reload: true }
        );
        expect(mockUserGuideMenuService.setIframeUrl).toHaveBeenCalledWith(
            'https://example.com'
        );
    });

    it('viewTopic: should show error if topic has no subtopics', () => {
        const topic = { id: '1', title: 'Topic', subtopics: [] };

        component.viewTopic(topic);

        expect(mockUserGuideMenuService.setIframeUrl).toHaveBeenCalledWith('');
        expect(mockToastrService.danger).toHaveBeenCalledWith(
            'This topic does not have any subtopics.',
            'No Subtopics Found'
        );
    });

    it('viewTopic: should show error if subtopic has no URL', () => {
        const topic = {
            id: '1',
            title: 'Topic',
            subtopics: [{ id: '2', title: 'Subtopic' }],
        };

        component.viewTopic(topic);

        expect(mockUserGuideMenuService.setIframeUrl).toHaveBeenCalledWith('');
        expect(mockToastrService.danger).toHaveBeenCalledWith(
            'Subtopic does not have a valid URL.',
            'Invalid Subtopic URL'
        );
    });

    it('viewTopic: should do nothing if topic is null', () => {
        component.viewTopic(null);
        expect(mockStateService.go).not.toHaveBeenCalled();
        expect(mockUserGuideMenuService.setIframeUrl).not.toHaveBeenCalled();
    });

    it('viewSubtopic: should navigate to valid subtopic', () => {
        component.topics = [
            {
                id: 'parent-1',
                title: 'Parent Topic',
                subtopics: [
                    { id: '3', title: 'Sub 3', url: 'https://example.com' },
                ],
            },
        ];
        const subtopic = {
            id: '3',
            title: 'Sub 3',
            url: 'https://example.com',
        };

        component.viewSubtopic(subtopic);

        expect(mockStateService.go).toHaveBeenCalledWith(
            'app.userguide.list.topic',
            { topicName: 'parent-topic', topicId: 'parent-1', subtopicId: '3' },
            { reload: true }
        );
    });

    it('viewSubtopic: should do nothing if subtopic is invalid', () => {
        component.viewSubtopic(null);
        component.viewSubtopic({ id: null, title: 'x' });
        component.viewSubtopic({ id: '1', title: null });

        expect(mockStateService.go).not.toHaveBeenCalled();
    });

    it('getInitials: should return initials for two words', () => {
        expect(component.getInitials('John Doe')).toBe('JD');
    });
    it('getInitials: should return initial for one word', () => {
        expect(component.getInitials('Noel')).toBe('N');
    });
    it('getInitials: should return empty string for empty input', () => {
        expect(component.getInitials('')).toBe('');
    });

    it('viewSubtopic: should show error if parent topic not found', () => {
        component.topics = [
            {
                id: 'parent-1',
                title: 'Parent Topic',
                subtopics: [
                    { id: '2', title: 'Sub 2', url: 'https://example.com' },
                ],
            },
        ];
        const subtopic = {
            id: '3',
            title: 'Sub 3',
            url: 'https://example.com',
        };

        component.viewSubtopic(subtopic);

        expect(mockToastrService.danger).toHaveBeenCalledWith(
            'Parent topic not found.',
            'Error'
        );
        expect(mockStateService.go).not.toHaveBeenCalled();
    });

    it('viewSubtopic: should call setActiveSubtopicId, setIframeUrl, and navigate', () => {
        component.topics = [
            {
                id: 'parent-1',
                title: 'Parent Topic',
                subtopics: [
                    { id: '3', title: 'Sub 3', url: 'https://example.com' },
                ],
            },
        ];
        const subtopic = {
            id: '3',
            title: 'Sub 3',
            url: 'https://example.com',
        };

        component.viewSubtopic(subtopic);

        expect(
            mockUserGuideMenuService.setActiveSubtopicId
        ).toHaveBeenCalledWith('3');
        expect(mockUserGuideMenuService.setIframeUrl).toHaveBeenCalledWith(
            'https://example.com'
        );
        expect(mockStateService.go).toHaveBeenCalledWith(
            'app.userguide.list.topic',
            { topicName: 'parent-topic', topicId: 'parent-1', subtopicId: '3' },
            { reload: true }
        );
    });

    it('viewSubtopic: should set iframeUrl to empty string if subtopic has no url', () => {
        component.topics = [
            {
                id: 'parent-1',
                title: 'Parent Topic',
                subtopics: [{ id: '3', title: 'Sub 3' }],
            },
        ];
        const subtopic = { id: '3', title: 'Sub 3' };

        component.viewSubtopic(subtopic);

        expect(mockUserGuideMenuService.setIframeUrl).toHaveBeenCalledWith('');
        expect(
            mockUserGuideMenuService.setActiveSubtopicId
        ).toHaveBeenCalledWith('3');
        expect(mockStateService.go).toHaveBeenCalledWith(
            'app.userguide.list.topic',
            { topicName: 'parent-topic', topicId: 'parent-1', subtopicId: '3' },
            { reload: true }
        );
    });

    it('fetchUserGuides: should handle topics with no subtopics property (default to empty array)', () => {
        const mockResults = [
            {
                id: 't1',
                title: 'Topic 1',
                parent: null,
            },
        ];
        spyOn(component.dataLayer, 'list').and.returnValue(
            of({ results: mockResults })
        );

        component.fetchUserGuides();

        expect(component.topics).toEqual([
            {
                id: 't1',
                title: 'Topic 1',
                parent: null,
                subtopics: [],
            },
        ]);
        expect(mockUserGuideMenuService.setUserGuideMenu).toHaveBeenCalledWith([
            {
                id: 't1',
                title: 'Topic 1',
                parent: null,
                subtopics: [],
            },
        ]);
        expect(component.loading).toBeFalse();
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('UserGuideComponent with SilStoresServiceStubError', () => {
    let component: UserGuideComponent;
    let fixture: ComponentFixture<UserGuideComponent>;
    let mockToastrService: jasmine.SpyObj<NbToastrService>;
    let mockErrorHandler: jasmine.SpyObj<ErrorHandlerService>;
    let mockStateService: jasmine.SpyObj<StateService>;
    let mockUserGuideMenuService: jasmine.SpyObj<UserGuideMenuService>;

    beforeEach(async () => {
        mockToastrService = jasmine.createSpyObj('NbToastrService', [
            'success',
            'danger',
        ]);
        mockErrorHandler = jasmine.createSpyObj('ErrorHandlerService', [
            'handleError',
        ]);
        mockStateService = jasmine.createSpyObj('StateService', ['go']);
        mockUserGuideMenuService = jasmine.createSpyObj(
            'UserGuideMenuService',
            ['setUserGuideMenu', 'setIframeUrl']
        );

        await TestBed.configureTestingModule({
            declarations: [UserGuideComponent, MockTranslatePipe],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: NbToastrService, useValue: mockToastrService },
                { provide: ErrorHandlerService, useValue: mockErrorHandler },
                { provide: StateService, useValue: mockStateService },
                {
                    provide: UserGuideMenuService,
                    useValue: mockUserGuideMenuService,
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(UserGuideComponent);
        component = fixture.componentInstance;
    });

    it('should handle error when fetchUserGuides fails', () => {
        component.fetchUserGuides();

        expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
            jasmine.any(Error),
            component
        );
        expect(component.loading).toBeFalse();
    });
});
