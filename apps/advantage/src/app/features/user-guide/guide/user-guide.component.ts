import { Component, OnInit } from '@angular/core';
import { SilStoresService } from '../../../../app/shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { StateService } from '@uirouter/core';
import { UserGuideMenuService } from '../user-guide-menu.service';

@Component({
    selector: 'app-user-guide',
    templateUrl: './user-guide.component.html',
    styleUrls: ['./user-guide.component.scss'],
    standalone: false,
})
export class UserGuideComponent implements OnInit {
    /**
     * Array to hold all user guides
     */
    userGuides: any[] = [];

    /**
     * Array to hold topics (items with no parent)
     */
    topics: any[] = [];

    /**
     * Flag to indicate if data is being loaded
     */
    loading = false;

    constructor(
        public dataLayer: SilStoresService,
        public errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public $state: StateService,
        private userGuideMenuService: UserGuideMenuService
    ) {}

    ngOnInit() {
        this.fetchUserGuides();
    }

    /**
     * Fetch user guides from the 'userguides' store
     */
    fetchUserGuides() {
        this.loading = true;
        this.dataLayer.list('userguides').subscribe({
            next: (data: any) => {
                this.userGuides = data.results;

                this.topics = this.userGuides
                    .filter((guide: any) => guide.parent === null)
                    .map((topic: any) => ({
                        ...topic,
                        subtopics: Array.isArray(topic.subtopics)
                            ? topic.subtopics
                            : [],
                    }));

                this.userGuideMenuService.setUserGuideMenu(this.topics);
                this.loading = false;
            },
            error: (err: any) => {
                this.errorHandler.handleError(err, this);
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            },
        });
    }
    /**
     * View topic details
     * @param topic The topic to view
     */
    viewTopic(topic: any): void {
        if (!topic || !topic.id || !topic.title) {
            console.error('Invalid topic or topic data:', topic);
            return;
        }

        const topicName = topic.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');

        this.$state.go(
            'app.userguide.list.topic',
            { topicName: topicName, topicId: topic.id },
            { reload: true }
        );

        const firstSubtopic = topic.subtopics?.[0];

        if (firstSubtopic) {
            if (firstSubtopic.url) {
                this.userGuideMenuService.setIframeUrl(firstSubtopic.url);
            } else {
                this.userGuideMenuService.setIframeUrl('');
                this.toastrService.danger(
                    'Subtopic does not have a valid URL.',
                    'Invalid Subtopic URL'
                );
            }

            topic.subtopics.forEach((sub: any) => (sub.active = false));
            firstSubtopic.active = true;
        } else {
            this.userGuideMenuService.setIframeUrl('');
            this.toastrService.danger(
                'This topic does not have any subtopics.',
                'No Subtopics Found'
            );
        }
    }

    /**
     * Navigate to the User Guide Details state for a subtopic
     * @param subtopic The subtopic to navigate to
     */
    viewSubtopic(subtopic: any): void {
        if (!subtopic || !subtopic.id || !subtopic.title) {
            return;
        }

        const parentTopic = this.topics.find(topic =>
            topic.subtopics.some((sub: any) => sub.id === subtopic.id)
        );

        if (!parentTopic) {
            this.toastrService.danger('Parent topic not found.', 'Error');
            return;
        }

        this.userGuideMenuService.setActiveSubtopicId(subtopic.id);
        this.userGuideMenuService.setIframeUrl(subtopic.url || '');

        const topicName = parentTopic.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');

        this.$state.go(
            'app.userguide.list.topic',
            {
                topicName: topicName,
                topicId: parentTopic.id,
                subtopicId: subtopic.id,
            },
            { reload: true }
        );
    }

    /**
     * Get the initials of a name
     * @param name The name to get initials from
     * @returns The initials of the name
     */
    getInitials(name: string): string {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);
    }
}
