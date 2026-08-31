import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserGuideMenuService {
    /**
     * BehaviorSubject to hold the menu items for the side menu
     */
    private menuItemsSubject = new BehaviorSubject<any[]>([]);

    /**
     * Observable for the menu items
     */
    userGuideMenuItems$ = this.menuItemsSubject.asObservable();

    /**
     * BehaviorSubject to hold the URL for the iframe to display the selected subtopic
     */
    private iframeUrlSubject = new BehaviorSubject<string>('');
    /**
     * URL for the iframe to display the selected subtopic.
     */
    iframeUrl$ = this.iframeUrlSubject.asObservable();

    /**
     * Variable to hold the active subtopic ID
     */
    public activeSubtopicIdSubject = new BehaviorSubject<string | null>(null);

    /**
     * Observable for the active subtopic ID
     */
    activeSubtopicId$ = this.activeSubtopicIdSubject.asObservable();

    /**
     * Set menu items for the side menu
     * @param items Menu items to set
     */
    setMenuItems(items: any[]): void {
        this.menuItemsSubject.next(items);
    }

    /**
     * Get the current menu items synchronously
     */
    getMenuItems(): any[] {
        return this.menuItemsSubject.getValue();
    }

    /**
     * Set iframe URL for the User Guide Details component
     * @param url URL to set
     */
    setIframeUrl(url: string): void {
        this.iframeUrlSubject.next(url);
    }

    /**
     * Set active subtopic ID
     * @param id Subtopic ID
     */
    setActiveSubtopicId(id: string): void {
        this.activeSubtopicIdSubject.next(id);
    }

    /**
     * Set menu items for the User Guide component
     * @param topics Array of topics with subtopics
     */
    setUserGuideMenu(topics: any[]): void {
        const userGuideMenuItems = topics.map((topic: any) => {
            const item: any = {
                title: topic.title,
                icon: 'book-outline',
                subtopics: topic.subtopics || [],
            };
            if (topic.id !== undefined) {
                item.id = topic.id;
            }
            return item;
        });
        this.setMenuItems(userGuideMenuItems);
    }

    /**
     * Set menu items for the User Guide Details component
     * @param selectedGuide The selected guide
     */
    setUserGuideDetailsMenu(selectedGuide: any): void {
        const userGuideMenuItems = [
            {
                title: selectedGuide.title,
                icon: 'book-outline',
                subtopics: selectedGuide.subtopics || [],
            },
        ];
        this.setMenuItems(userGuideMenuItems);
    }
}
