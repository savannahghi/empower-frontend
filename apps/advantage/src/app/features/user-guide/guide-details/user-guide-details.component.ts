import { Component, OnInit } from '@angular/core';
import { StateService } from '@uirouter/core';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { UserGuideMenuService } from '../user-guide-menu.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';

@Component({
    selector: 'app-user-guide-details',
    templateUrl: './user-guide-details.component.html',
    styleUrls: ['./user-guide-details.component.scss'],
    standalone: false,
})
export class UserGuideDetailsComponent implements OnInit {
    /**
     * The topic object containing details of the selected topic.
     */
    topic: any;

    /**
     * Array to hold subtopics related to the selected topic.
     */
    subtopics: any[] = [];

    /**
     * Flag to indicate if data is being loaded.
     */
    loading = false;

    /**
     * URL for the iframe to display the selected subtopic.
     */
    iframeUrl: string = '';

    /**
     * Error message to display in case of an error.
     */
    errorMessage: string = '';

    /**
     * Flag to indicate if the sub-menu is toggled.
     */
    subMenuToggle: { [key: string]: boolean } = {};

    constructor(
        private $state: StateService,
        private dataLayer: SilStoresService,
        private userGuideMenuService: UserGuideMenuService,
        private errorHandler: ErrorHandlerService
    ) {}

    ngOnInit(): void {
        const topicId = this.$state.params['topicId'];

        if (!topicId) {
            this.errorHandler.handleError(
                new Error('No topicId found in state parameters.')
            );
            this.$state.go('app.userguide.list');
            return;
        }

        this.fetchTopicDetails(topicId);

        if (this.userGuideMenuService.iframeUrl$) {
            this.userGuideMenuService.iframeUrl$.subscribe((url: string) => {
                this.iframeUrl = url;
            });
        } else {
            console.warn('iframeUrl$ is undefined in UserGuideMenuService.');
        }
    }

    fetchTopicDetails(topicId: string): void {
        this.loading = true;

        this.dataLayer.list('userguides').subscribe({
            next: (data: any) => {
                this.topic = data.results.find(
                    (guide: any) =>
                        guide.id === topicId && guide.parent === null
                );

                if (!this.topic) {
                    this.errorMessage =
                        'The selected topic could not be found.';
                    this.loading = false;
                    return;
                }

                this.subtopics = Array.isArray(this.topic.subtopics)
                    ? this.topic.subtopics
                    : [];

                if (this.subtopics.length === 0) {
                    this.iframeUrl = '';
                    this.errorMessage =
                        'This topic does not have any subtopics.';
                    this.loading = false;
                    return;
                }

                const allTopics = data.results.filter(
                    (guide: any) => guide.parent === null
                );

                const menuItems = allTopics.map((topic: any) => ({
                    title: topic.title,
                    icon: 'book-outline',
                    id: topic.id,
                    subtopics: Array.isArray(topic.subtopics)
                        ? topic.subtopics.map((subtopic: any) => ({
                              title: subtopic.title,
                              icon: 'file-text-outline',
                              url: subtopic.url || '',
                              id: subtopic.id,
                          }))
                        : [],
                }));

                this.userGuideMenuService.setMenuItems(menuItems);

                const currentActiveId =
                    this.userGuideMenuService[
                        'activeSubtopicIdSubject'
                    ].getValue();
                let subtopicToShow: any;
                if (currentActiveId) {
                    subtopicToShow = this.subtopics.find(
                        st => st.id === currentActiveId
                    );
                } else if (this.subtopics.length > 0) {
                    subtopicToShow = this.subtopics[0];
                }

                if (subtopicToShow) {
                    if (subtopicToShow.url) {
                        this.iframeUrl = subtopicToShow.url;
                        this.userGuideMenuService.setIframeUrl(
                            subtopicToShow.url
                        );
                        this.userGuideMenuService.setActiveSubtopicId(
                            subtopicToShow.id
                        );
                    } else {
                        this.iframeUrl = '';
                        this.errorMessage =
                            'The subtopic does not have a valid URL.';
                    }
                } else {
                    this.iframeUrl = '';
                    this.errorMessage =
                        'This topic does not have any subtopics.';
                }

                this.subMenuToggle['userguide'] = true;
            },
            error: (err: any) => {
                this.errorHandler.handleError(err, this);
            },
            complete: () => {
                this.loading = false;
            },
        });
    }

    toggleSubMenu(menu: string): void {
        this.subMenuToggle[menu] = !this.subMenuToggle[menu];
    }

    goBackToList(): void {
        this.$state.go('app.userguide.list', {}, { reload: true });
    }
}
