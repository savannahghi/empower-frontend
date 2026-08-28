import { Component } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { SkikaFormModule } from 'app/shared/sil-form/sil-form.module';

@Component({
    selector: 'ngx-visit-diagnostic',
    imports: [NbCardModule, SkikaFormModule],
    templateUrl: './visit-diagnostic.component.html',
    styleUrl: './visit-diagnostic.component.scss',
})
export class VisitDiagnosticComponent {
    /**
     * Component constructor
     */
    constructor() {}

    /**
     * Stores the form model data
     */
    model: any = {};

    /**
     * Used to tell when form is loading
     */
    loading: boolean = false;

    /**
     * holds the formData
     */
    formData: any;

    /**
     * @description used to get the form data
     * @param event form event
     */
    getModelData(event) {
        this.formData = event;
    }
}
