import { Component, Input, OnInit } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';

@Component({
    selector: 'ngx-enrollment-banner',
    templateUrl: './enrollment-banner.component.html',
    styleUrl: './enrollment-banner.component.scss',
    standalone: false,
})
export class EnrollmentBannerComponent implements OnInit {
    constructor(
        public uiglobals: UIRouterGlobals,
        private errorHandler: ErrorHandlerService
    ) {}

    @Input() patientObservable: any;

    patientId: string = '';

    loading: boolean = false;

    patientData: any;

    globalHealthId: any;

    handleErrorFxn = (err: any) => {
        this.loading = false;
        this.errorHandler.handleError(err, this);
    };

    getPatientData() {
        this.loading = true;

        this.patientObservable.subscribe({
            next: (response: any) => {
                this.patientData = response;

                this.globalHealthId = response.global_health_id;

                this.loading = false;
            },
            error: this.handleErrorFxn,
        });
    }

    ngOnInit() {
        this.patientId = this.uiglobals.params.id;

        this.getPatientData();
    }
}
