import { Component, OnInit } from '@angular/core';
import { StateService } from '@uirouter/angular';
import { environment } from '../../../../../environments/environment';
import { Authorization } from '../../services/authorization.service';
import { CompleteService } from '../../services/login.service';

@Component({
    selector: 'ngx-apps',
    templateUrl: './apps.component.html',
    styleUrls: ['./apps.component.scss'],
    providers: [CompleteService],
    standalone: false,
})
export class AppsComponent implements OnInit {
    /** Contains user information */
    user: any;
    /** Contains the variant information */
    variant: any;
    /** Contains information about available apps */
    availableApps: any;
    constructor(
        public completeService: CompleteService,
        public authConfig: Authorization,
        public state: StateService
    ) {}

    /** Initialize hook */
    ngOnInit() {
        this.variant = environment.variant;
        this.user = this.authConfig.getUser();
        this.completeService.determineApplicationAccess(this.user);
        this.completeService.determineAppsNavigation();
        this.availableApps = this.completeService.availableApps;
    }

    /** Navigate to app */
    goToApp(app) {
        this.completeService.goToApp(app);
    }
}
