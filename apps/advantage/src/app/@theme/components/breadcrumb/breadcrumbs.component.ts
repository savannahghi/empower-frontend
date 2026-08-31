/**
 * Imports used in the component
 */
import { Component, OnDestroy } from '@angular/core';
import { UIRouter, Transition } from '@uirouter/core';

/**
 * Add `breadcrumb` to typescript definitions for StateObject
 * */
declare module '@uirouter/core/lib/state/stateObject' {
    /**
     * Describes the state object interface used in the breadcrumb object
     */
    interface StateObject {
        /** Contains the transition object including a string for the breadcrum text */
        breadcrumb?: (trans: Transition) => string;
    }
}

/**
 * Add `breadcrumb` to typescript definitions for StateDeclaration
 * */
declare module '@uirouter/core/lib/state/interface' {
    /**
     * Describes the state declaration interface used in the breadcrumb object
     */
    interface StateDeclaration {
        /**
         * Contains the transition object including a string for the breadcrum text
         * */
        breadcrumb?: (trans: Transition) => string;
    }
}

/**
 * Interface that defines the data structure of a single breadcrumb
 * */
interface Crumb {
    /**
     * Contains the router state information
     * */
    state: string;
    /**
     * Contains the text to be rendered
     * */
    text: string;
}

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - style: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 */
@Component({
    selector: 'sil-breadcrumbs',
    template: `
        <ul class="breadcrumbs">
            <li *ngFor="let crumb of crumbs; let i = index; let last = last">
                <a
                    class="mulish breadcrumb-link"
                    [uiSref]="crumb.state"
                    [ngClass]="{
                        'disabled-link': last
                    }"
                    >{{ crumb.text }}</a
                >
            </li>
        </ul>
    `,
    styleUrls: ['./breadcrumbs.component.scss'],
    standalone: false,
})

/**
 * This is the class definition of the component
 */
export class BreadcrumbsComponent implements OnDestroy {
    /**
     * contains the active breadcrumbs
     */
    public crumbs: Crumb[] = [];
    /**
     * defines the router hook that triggers the breadcrumb logic
     */
    hookCriteria: (trans: any) => void;
    /**
     * used when the component is destroyed
     */
    unsub: Function;

    /**
     * Contains the component constructor
     * @param router gets an instance of UIRouter
     */
    constructor(public router: UIRouter) {
        this.updateCrumbs(router.globals.successfulTransitions.peekTail());
        this.hookCriteria = trans => this.updateCrumbs(trans);
        this.unsub = router.transitionService.onSuccess({}, this.hookCriteria);
    }
    /**
     * Method that updates the breadcrumb as you transition from state to state.
     * It takes the breadcrumb definition and then renders it for each state and its children
     * @param trans contains the transition definition from uirouter/core as a parameter
     */
    public updateCrumbs(trans: Transition) {
        this.crumbs = trans
            .treeChanges('to')
            .filter(node => node.state.breadcrumb)
            .map(node => {
                return {
                    state: node.state.name,
                    text: node.state.breadcrumb(trans),
                };
            });
    }

    /**
     * Component lifecycle hook that contains a method that
     * adds a hook for the successful state transitions.
     */
    ngOnDestroy() {
        this.unsub();
    }
}
