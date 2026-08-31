import { Injectable, OnDestroy } from '@angular/core';
import { of as observableOf, Observable, BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import _ from 'underscore';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';
import { UIRouterGlobals } from '@uirouter/angular';

@Injectable()
export class LocalStateService implements OnDestroy {
    protected layouts: any = [
        {
            name: 'One Column',
            icon: 'nb-layout-default',
            id: 'one-column',
            selected: true,
        },
        {
            name: 'Two Column',
            icon: 'nb-layout-two-column',
            id: 'two-column',
        },
        {
            name: 'Center Column',
            icon: 'nb-layout-centre',
            id: 'center-column',
        },
    ];

    protected sidebars: any = [
        {
            name: 'Sidebar at layout start',
            icon: 'nb-layout-sidebar-left',
            id: 'start',
            selected: true,
        },
        {
            name: 'Sidebar at layout end',
            icon: 'nb-layout-sidebar-right',
            id: 'end',
        },
    ];

    protected layoutState$ = new BehaviorSubject(this.layouts[0]);
    protected sidebarState$ = new BehaviorSubject(this.sidebars[0]);

    alive = true;

    constructor(
        directionService: NbLayoutDirectionService,
        public uiglobals: UIRouterGlobals
    ) {
        directionService
            .onDirectionChange()
            .pipe(takeWhile(() => this.alive))
            .subscribe(direction => this.updateSidebarIcons(direction));

        this.updateSidebarIcons(directionService.getDirection());
    }

    /**
     *  getFinalFilters
     * @returns filters that should be used in the api
     */
    getFinalFilters() {
        let finalFilters = {};
        /**
         * If the default params and the new params match
         * then use state params as filter params this is because
         * there are times the defaultparams may want to override
         * params coming from the filter form
         * */
        const stateparams = _.omit(this.uiglobals.params, '#');
        const filters = JSON.parse(JSON.stringify(stateparams));
        const stateParams = _.clone(this.uiglobals.$current.params);
        // Check if stateparams are empty
        if (_.isEmpty(stateParams) || _.isEmpty(filters)) {
            finalFilters = {};
        } else {
            const stateKeys = _.intersection(
                _.keys(filters),
                _.keys(stateParams)
            );
            const newFilter = {};
            if (stateKeys.length > 0) {
                for (let i = 0; i < stateKeys.length; i++) {
                    newFilter[stateKeys[i]] = filters[stateKeys[i]];
                }
            }
            finalFilters = _.extendOwn(newFilter, filters);
        }
        return finalFilters;
    }

    ngOnDestroy() {
        this.alive = false;
    }

    private updateSidebarIcons(direction: NbLayoutDirection) {
        const [startSidebar, endSidebar] = this.sidebars;
        const isLtr = direction === NbLayoutDirection.LTR;
        const startIconClass = isLtr
            ? 'nb-layout-sidebar-left'
            : 'nb-layout-sidebar-right';
        const endIconClass = isLtr
            ? 'nb-layout-sidebar-right'
            : 'nb-layout-sidebar-left';
        startSidebar.icon = startIconClass;
        endSidebar.icon = endIconClass;
    }

    setLayoutState(state: any): any {
        this.layoutState$.next(state);
    }

    getLayoutStates(): Observable<any[]> {
        return observableOf(this.layouts);
    }

    onLayoutState(): Observable<any> {
        return this.layoutState$.asObservable();
    }

    setSidebarState(state: any): any {
        this.sidebarState$.next(state);
    }

    getSidebarStates(): Observable<any[]> {
        return observableOf(this.sidebars);
    }

    onSidebarState(): Observable<any> {
        return this.sidebarState$.asObservable();
    }
}
