import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserGuideMenuService } from './user-guide-menu.service';

describe('UserGuideMenuService', () => {
    let service: UserGuideMenuService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UserGuideMenuService],
        });
        service = TestBed.inject(UserGuideMenuService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set and get menu items', () => {
        const mockMenuItems = [
            { title: 'Menu 1', subtopics: [] },
            { title: 'Menu 2', subtopics: [] },
        ];

        service.setMenuItems(mockMenuItems);

        service.userGuideMenuItems$.subscribe(menuItems => {
            expect(menuItems).toEqual(mockMenuItems);
        });

        expect(service.getMenuItems()).toEqual(mockMenuItems);
    });

    it('should set iframe URL', () => {
        const mockUrl = 'https://example.com';

        service.setIframeUrl(mockUrl);

        service.iframeUrl$.subscribe(url => {
            expect(url).toBe(mockUrl);
        });
    });

    it('should set active subtopic ID', () => {
        const mockSubtopicId = '12345';

        service.setActiveSubtopicId(mockSubtopicId);

        service.activeSubtopicId$.subscribe(id => {
            expect(id).toBe(mockSubtopicId);
        });
    });

    it('should map API topics with id to menu items including id', () => {
        const apiTopics = [
            {
                id: '234b44b7-b831-4043-9ede-0a4d03acaaa1',
                title: 'Provider Onboarding',
                subtopics: [
                    {
                        id: 'ab61c18f-f5af-4325-a307-10f38c5c0900',
                        title: 'How to Create Departments in Slade Advantage',
                        url: 'https://scribehow.com/embed/How_to_Create_Departments_in_Slade_Advantage__He0qtTuOTiOObgJZ3hTmug',
                        permission: null,
                    },
                ],
            },
            {
                id: 'b30f3db8-bc20-430f-a977-b3e05a18dc65',
                title: 'Settings',
                subtopics: [
                    {
                        id: 'ea9e956b-a98d-4c8b-949b-b45f276a3da7',
                        title: 'Organization Settings On Slade Advantage',
                        url: 'https://scribehow.com/embed/Organization_Settings_On_Slade_Advantage__lDeIJD1eScunq2gDcF6iUQ',
                        permission: null,
                    },
                ],
            },
        ];

        const expectedMenuItems = [
            {
                title: 'Provider Onboarding',
                icon: 'book-outline',
                subtopics: apiTopics[0].subtopics,
                id: '234b44b7-b831-4043-9ede-0a4d03acaaa1',
            },
            {
                title: 'Settings',
                icon: 'book-outline',
                subtopics: apiTopics[1].subtopics,
                id: 'b30f3db8-bc20-430f-a977-b3e05a18dc65',
            },
        ];

        let result: any[] = [];
        service.setUserGuideMenu(apiTopics);
        service.userGuideMenuItems$.subscribe(menuItems => {
            result = menuItems;
        });

        expect(result).toEqual(expectedMenuItems);
    });

    it('should handle an empty array in setUserGuideMenu', () => {
        const emptyTopics: any[] = [];

        service.setUserGuideMenu(emptyTopics);

        service.userGuideMenuItems$.subscribe(menuItems => {
            expect(menuItems).toEqual([]);
        });
    });

    it('should set user guide details menu', () => {
        const mockSelectedGuide = {
            title: 'Selected Guide',
            subtopics: [
                { id: '1-1', title: 'Subtopic 1-1' },
                { id: '1-2', title: 'Subtopic 1-2' },
            ],
        };

        const expectedMenuItems = [
            {
                title: 'Selected Guide',
                icon: 'book-outline',
                subtopics: mockSelectedGuide.subtopics,
            },
        ];

        service.setUserGuideDetailsMenu(mockSelectedGuide);

        service.userGuideMenuItems$.subscribe(menuItems => {
            expect(menuItems).toEqual(expectedMenuItems);
        });
    });

    it('should handle an empty subtopics array in setUserGuideDetailsMenu', () => {
        const mockSelectedGuide = {
            title: 'Selected Guide',
            subtopics: [],
        };

        const expectedMenuItems = [
            {
                title: 'Selected Guide',
                icon: 'book-outline',
                subtopics: [],
            },
        ];

        service.setUserGuideDetailsMenu(mockSelectedGuide);

        service.userGuideMenuItems$.subscribe(menuItems => {
            expect(menuItems).toEqual(expectedMenuItems);
        });
    });

    it('should handle a selected guide with no subtopics property in setUserGuideDetailsMenu', () => {
        const mockSelectedGuide = {
            title: 'Selected Guide',
        };

        const expectedMenuItems = [
            {
                title: 'Selected Guide',
                icon: 'book-outline',
                subtopics: [],
            },
        ];

        service.setUserGuideDetailsMenu(mockSelectedGuide);

        service.userGuideMenuItems$.subscribe(menuItems => {
            expect(menuItems).toEqual(expectedMenuItems);
        });
    });

    it('should default subtopics to empty array if not provided in setUserGuideMenu', fakeAsync(() => {
        const topics = [
            {
                title: 'Topic without subtopics',
            },
        ];

        const expectedMenuItems = [
            {
                title: 'Topic without subtopics',
                icon: 'book-outline',
                subtopics: [],
            },
        ];

        let result: any[] = [];

        service.setUserGuideMenu(topics);

        service.userGuideMenuItems$.subscribe(menuItems => {
            result = menuItems;
        });

        tick();

        expect(result).toEqual(expectedMenuItems);
    }));
    it('should include id property if topic has id in setUserGuideMenu', () => {
        const topics = [
            {
                title: 'Topic with id',
                id: 'abc123',
                subtopics: [{ id: 'sub-1', title: 'Subtopic 1' }],
            },
        ];

        const expectedMenuItems = [
            {
                title: 'Topic with id',
                icon: 'book-outline',
                subtopics: [{ id: 'sub-1', title: 'Subtopic 1' }],
                id: 'abc123',
            },
        ];

        let result: any[] = [];

        service.setUserGuideMenu(topics);

        service.userGuideMenuItems$.subscribe(menuItems => {
            result = menuItems;
        });

        expect(result).toEqual(expectedMenuItems);
    });
});
