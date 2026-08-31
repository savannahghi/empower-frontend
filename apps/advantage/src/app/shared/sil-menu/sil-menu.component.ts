import { OnInit, Component, Input } from '@angular/core';
import { StateService } from '@uirouter/core';

/**
 * Component that is used to create the View Scheme Page
 *
 *  Component declaration that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */

@Component({
    selector: 'sil-menu',
    templateUrl: './sil-menu.component.html',
    styleUrls: ['./sil-menu.component.scss'],
    standalone: false,
})
/**
 * Class for the comparison card component
 */
export class SilMenuComponent implements OnInit {
    /**
     * defines array of sil menu items
     */
    @Input() items: Array<any> = [];
    /**
     * Component constructor
     * @param $state injects uirouter state service
     * */
    constructor(public $state: StateService) {}

    /**
     * Toggles the submenus
     * @param menutitle title of the toggled menu
     */
    toggleChildMenu(menutitle: string) {
        this.items = this.items.map(item => {
            if (item.title === menutitle) {
                item.expanded = !item.expanded;
            }
            return item;
        });
    }

    /**
     * Toggles child submenus
     * @param parentId id of the parent menu
     * @param childTitle title of the sub menu
     */
    togglegrandChildMenu(parentId: number, childTitle: string) {
        this.items = this.items.map(item => {
            if (item.id === parentId) {
                const children = item.children.map(child => {
                    if (child.title === childTitle) {
                        return { ...child, expanded: !child.expanded };
                    }
                    return child;
                });
                return {
                    ...item,
                    children,
                };
            }
            return item;
        });
    }

    /**
     * Function used to toggle menu visibility based on current state
     */
    toggleOnLoad() {
        this.items = this.items.map(item => {
            if (item.children) {
                const children = item.children.map(child => {
                    return this.$state.includes(child.baseState)
                        ? { ...child, expanded: !child.expanded }
                        : child;
                });
                return this.$state.includes(item.baseState)
                    ? { ...item, expanded: !item.expanded, children }
                    : item;
            } else {
                return this.$state.includes(item.baseState)
                    ? { ...item, expanded: !item.expanded }
                    : item;
            }
        });
    }
    /**
     * Hook that is called when the component is initialized
     */
    ngOnInit() {
        this.toggleOnLoad();
    }
}
