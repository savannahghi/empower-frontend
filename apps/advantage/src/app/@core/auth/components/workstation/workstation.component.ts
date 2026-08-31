import { Component, OnInit } from '@angular/core';
import { Authorization } from '../../services/authorization.service';
import _ from 'underscore';
import { StateService, Transition } from '@uirouter/core';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { NbIconLibraries } from '@nebular/theme';

interface UserErpOrganization {
    workstation__org_unit__parent__name: string;
    workstation__org_unit__parent: string;
    workstation__org_unit__parent__parent: string;
    workstation__org_unit__parent__parent__name: string;
}

/**
 * Component decorator used in templates
 * the selector, style url, and template
 */
@Component({
    selector: 'ngx-workstation',
    templateUrl: './workstation.component.html',
    styleUrls: ['./workstation.component.scss'],
    standalone: false,
})
export class WorkstationComponent implements OnInit {
    /** holds user erp organization details */
    userErpOrganizations: UserErpOrganization[];

    /** holds user branches */
    branches: any = [];

    /** holds user clusters */
    clusters: any = [];

    /** unique branches*/
    uniqueBranches: any;

    /** unique clusters*/
    uniqueClusters: any;

    /** unique clusters length */
    uniqueClustersLength: number;

    /** unique clusters length */
    uniqueBranchesLength: number;

    /** holds user departments */
    departments: any[];

    /** contains window object */
    window: any;

    /** determines if departments are unique */
    uniqueDepartments: number;

    /** holds user servicePoints */
    servicePoints: any;

    /** selected workstation */
    selectedWs: any;

    /** selected branch */
    selectedBr: any;

    /** selected cluster */
    selectedCl: any;

    /** Contains the state name the user came from before
     * loading the workstation componentW
     */
    previousState: any;

    /** Contains state params from previous state */
    previousParams: { [paramName: string]: any };

    /** check for org settings error status */
    organisationSettingsErr: boolean = false;

    /**
     * Constructor used for the WorkstationComponent class
     * @param authConfig Access instance of the authorization service
     * @param $state Access instance of the StateService from uirouter
     * @param $transition Access instance of the TransitionService from uirouter
     */
    constructor(
        public authConfig: Authorization,
        public $state: StateService,
        public dataLayer: SilStoresService,
        public $transition: Transition,
        public errorService: ErrorHandlerService,
        private iconLibraries: NbIconLibraries,
        protected cookieService: Cookies
    ) {
        this.window = window;
        this.iconLibraries.registerFontPack('font-awesome', {
            packClass: 'fa',
            iconClassPrefix: 'fa',
        });
    }

    /**
     * select workstation method
     *
     * @param ws @ workstation parameter
     */
    selectServicePoint(ws: any) {
        this.selectedWs = ws;
        this.cookieService.set(
            this.authConfig.ORGANISATION_USER_WORKSTATION,
            this.selectedWs,
            true
        );

        this.getBranchSettings();

        if (
            this.previousState.name !== '' &&
            this.previousState.name !== 'auth.complete' &&
            this.previousState.name !== 'auth.apps' &&
            this.previousState.name !== 'auth.login'
        ) {
            this.$state.go(this.previousState.name, this.previousParams, {
                reload: true,
            });
        } else if (
            this.cookieService.get('url.dump') !== undefined &&
            this.cookieService.get('url.dump') !== false
        ) {
            const url = this.cookieService.get('url.dump');
            this.cookieService.delete('url.dump');
            if (url === '/auth/apps') {
                this.$state.go('app.advantage.home', {}, { reload: true });
            } else {
                this.window.location.assign(url);
            }
        } else if (
            this.cookieService.get('dumpedState') !== undefined &&
            this.cookieService.get('dumpedState') !== false
        ) {
            const dumpedState = this.cookieService.get('dumpedState', true);
            this.cookieService.delete('dumpedState');
            const invalidDumpStates = ['auth.login', 'auth.workstations'];
            if (!invalidDumpStates.includes(dumpedState.stateName)) {
                this.$state.go(dumpedState.stateName, dumpedState.params);
            } else {
                this.$state.go('app.advantage.home', {}, { reload: true });
            }
        } else {
            this.$state.go('app.advantage.home', {}, { reload: true });
        }
    }

    /**
     * select branch method
     *
     * @param br @ branch parameter
     */
    selectBranch(br: any) {
        this.selectedBr = br;
        /** get all workstations within a specific branch */
        this.servicePoints = this.userErpOrganizations.filter((org: any) => {
            return (
                org.workstation__org_unit__parent ===
                br.workstation__org_unit__parent
            );
        });
    }

    /**
     * select cluster method
     */
    selectCluster(cl: any) {
        this.selectedCl = cl;
        /** get all branches within a specific cluster */
        this.branches = this.userErpOrganizations.filter((org: any) => {
            return (
                org.workstation__org_unit__parent__parent ===
                cl.workstation__org_unit__parent__parent
            );
        });

        /** get all unique branches */
        this.uniqueBranches = _.uniq(
            this.branches,
            branch => branch.workstation__org_unit__parent
        );

        this.uniqueBranchesLength = _.uniq(this.uniqueBranches).length;

        if (this.uniqueBranchesLength === 1) {
            this.selectBranch(this.uniqueBranches[0]);
        }
    }

    /**
     * Checks if a user contains a workstation
     * @param noWorkstation boolean used to logout the user if they have no workstations
     */
    redirectToLogin(noWorkstation?) {
        if (noWorkstation) {
            this.authConfig.logout();
            this.$state.go('auth.logout', {}, { reload: true });
        } else {
            this.$state.go('auth.logout', {}, { reload: true });
        }
    }

    /** Fetch organisation settings */
    getOrganisationSettings() {
        this.dataLayer.list('settings').subscribe({
            next: this.settingsRetrieved,
            error: this.handleOrganisationSettingsErr,
        });
    }
    /** Fetch branch settings */
    getBranchSettings() {
        this.dataLayer.list('branch-settings').subscribe({
            next: this.branchSettingsRetrieved,
            error: this.handleErr,
        });
    }

    /** When settings are retrieved */
    settingsRetrieved = data => {
        this.organisationSettingsErr = false;
        this.authConfig.setOrganisationSettings(data);
    };

    /** When settings are retrieved */
    branchSettingsRetrieved = data => {
        this.authConfig.setBranchSettings(data);
    };

    /** Fetch workstations from api */
    fetchWorkstations = () => {
        /** Fetch all data from the erp */
        this.dataLayer.list('erp-me').subscribe({
            next: this.workstationsRetrieved,
            error: this.handleErr,
        });
    };

    /** handle api error */
    handleErr = err => {
        this.errorService.handleError(err);
    };

    /** handle org settings api error */
    handleOrganisationSettingsErr = err => {
        this.organisationSettingsErr = true;
        this.errorService.handleError(err);
    };

    /** When workstations are retrieved */
    workstationsRetrieved = data => {
        /** get user erp organization details when component mounts */
        this.userErpOrganizations = data.user_workstations;
        /** set org details from fetching /me from ERP */
        this.authConfig.setOrganisation(data);
        /** set user details from fetching /me from ERP */
        this.authConfig.setUser(data);

        /** Select the workstation for the user if they only have one workstation */
        if (this.userErpOrganizations.length === 1) {
            this.selectServicePoint(this.userErpOrganizations[0]);
        }

        this.servicePoints = this.userErpOrganizations.map((org: any) => {
            if (org['workstation__name'] === "Cashier's Desk") {
                const workstation: any = org;
                return { ...workstation, workstation__name: 'Billing' };
            }
            return org;
        });

        /** get all clusters */
        this.clusters = _.pluck(
            this.userErpOrganizations,
            'workstation__org_unit__parent__parent'
        );

        /** get all unique clusters */
        this.uniqueClusters = _.uniq(
            this.userErpOrganizations,
            org => org.workstation__org_unit__parent__parent
        );

        /** get unique clusters length */
        this.uniqueClustersLength = _.uniq(this.uniqueClusters).length;

        /** get all departments */
        this.departments = _.pluck(
            this.userErpOrganizations,
            'workstation__org_unit'
        );

        /** get length of unique departments */
        this.uniqueDepartments = _.uniq(this.departments).length;

        /** Select the cluster for the user if they only have one cluster */
        if (this.uniqueClustersLength === 1) {
            this.selectCluster(this.uniqueClusters[0]);
        }
    };

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.previousState = this.$transition.from();
        this.previousParams = this.$transition.params('from');
        this.previousParams = JSON.parse(JSON.stringify(this.previousParams));

        this.fetchWorkstations();
        this.getOrganisationSettings();
    }
}
