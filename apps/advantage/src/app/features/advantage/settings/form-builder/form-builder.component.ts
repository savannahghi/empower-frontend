import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { AnalyticsService } from '../../../../@core/utils';
import { PageComponent } from '../../../../shared/page/page.component';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import _ from 'underscore';

@Component({
    selector: 'ngx-form-builder',
    templateUrl: './form-builder.component.html',
    styleUrls: ['./form-builder.component.scss'],
    standalone: false,
})
export class FormBuilderComponent extends PageComponent implements OnInit {
    form = new FormGroup({});
    options: FormlyFormOptions = {};
    model: any;
    fields: FormlyFieldConfig[];
    showDefaultSurveyQuestions: boolean = false;
    /** Contains survey json data */
    survey: any;

    /**
     * Constructor fo class
     * @param toastrService
     * @param uiglobals
     * @param $state
     * @param analytics
     * @param dataLayer
     */
    constructor(
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public analytics: AnalyticsService,
        public dataLayer: SilStoresService
    ) {
        super(toastrService, uiglobals, $state, analytics);
    }
    /**
     * Hook that is called when the component is initialized
     */
    ngOnInit() {
        this.fetchSettings();
    }

    /** Fetch settings */
    fetchSettings() {
        this.dataLayer
            .list('settings')
            .subscribe({ next: this.settingsResponse });
    }

    settingsResponse = resp => {
        this.survey = _.findWhere(resp, {
            name: 'visits:post_visit_survey_template',
        });
    };
}
