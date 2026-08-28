import {
    Component,
    ChangeDetectorRef,
    OnInit,
    Input,
    Output,
    EventEmitter,
    SimpleChanges,
    OnChanges,
    Inject,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { FormlyConfig } from '@ngx-formly/core';

import _ from 'underscore';

import { SilFormlyService } from '../../services/skika-formly-service';
import { loginForm } from '../../constants/skika-login-form.constant';

import { CurrencyPipe } from '@angular/common';
import { NbComponentSize } from '@nebular/theme';

interface MultiStepType {
    skip: { name: undefined };
    back: { name: undefined };
}

/** Component decorator */
@Component({
    selector: 'skika-form',
    styleUrls: ['./sil-form.component.scss'],
    templateUrl: './sil-form.component.html',
    providers: [SilFormlyService, CurrencyPipe],
    standalone: false,
})
export class SilFormComponent implements OnInit, OnChanges {
    /** Used to change the button text */
    @Input() btnText: string | string[] = 'Save';
    /** Used in autorecon module to display the Export button in the Filter Drawer */
    @Input() exportBtnText: string | string[] = 'Export';
    /** Used to change the cancel button text */
    @Input() cancelText: string = 'Cancel';
    /** Used to display the cancel button; default is to display */
    @Input() cancelBtn: boolean;
    /** Used to customize the cancel button status */
    @Input() cancelBtnStatus?: string;
    /** Used to display the save button; default is to display */
    @Input() saveText: boolean = true;
    /** Used to determine if a service loads the form fields */
    @Input() service: boolean;
    /** Used to set the intention of the button e.g. warning, success etc */
    @Input() btnStatus: string;
    /** Used to set up the form as part of a stepper*/
    @Input() isStepper: boolean = false;
    /** Used to set the size of the button e.g. small, medium, large, giant etc */
    @Input() btnSize: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
    medium: NbComponentSize = 'medium';
    /** Used to hide action section on the form */
    @Input('no-action') noAction: boolean;
    /** Used to set a formly fields file loaded from the assets folder */
    @Input() store: string;
    /** Used to determine if the form has submitted its content */
    @Input() submitted: boolean = false;
    /** Used to disable the submit button */
    @Input() disableSubmit: boolean = false;
    /** Used to determine if the form is part of a multistep process */
    @Input() multiStep: MultiStepType | boolean;

    isMultiStepObject(value: true | MultiStepType): value is MultiStepType {
        return typeof value === 'object';
    }
    /** Used to change the form config */
    @Input() config: string = undefined;
    /** Used to load the model of a form */
    @Input() model: any = {};
    /** Used to load the fields of a form */
    @Input() storedFields: any = {};
    /** Used to load to change the form model */
    @Input() modelData: any = {};
    /** Used to load extra data into the form */
    @Input() formData: any = {};
    /** Used to tell the form what model object to submit when
     * submitForm method is called
     */
    @Input() submitFormModel: boolean = false;
    @Input() saveOnChange: boolean = false;
    /** Contains secondary data required in the form */
    @Input() secondaryData: any = {};
    @Input() btnContClass: string;
    /** Submit button class */
    @Input() submitBtnClass?: string;
    /** Used to determine if the form's UI needs modification*/
    @Input() isformattedForm?: boolean = false;
    @Input() resetModel: boolean = false;
    @Input() fullWidth: boolean = false;
    /** Triggers ngDoCheck */
    @Input() checkExpressionOn: any;
    /** Used to disable fields */
    @Input() disabledFields: Array<string> = [];
    /** set custom button styles */
    @Input() btnStyles?: Object;

    /** configures the export button */
    @Input() hasFormExportButton? = false;

    @Output() submitModel = new EventEmitter();
    @Output() refresh = new EventEmitter();
    /** Emits an event when the skip action is used */
    @Output() onSkip = new EventEmitter();
    /** Emits an event when the go back action is used  */
    @Output() onBack = new EventEmitter();
    /** Emits an event when the cancel action is used */
    @Output() cancelFxn = new EventEmitter();
    /** Emits an event when the model data is required */
    @Output() getModelData = new EventEmitter();
    /** Emits an event with the options data */
    @Output() formOptions = new EventEmitter();
    /** Emits the export event */
    @Output() exportEvent = new EventEmitter();

    onDestroy$ = new Subject<void>();

    self = this;

    form = new UntypedFormGroup({});
    options: FormlyFormOptions = {
        formState: {
            awesomeIsForced: false,
        },
    };

    /** This is the model from the form as given
     * by the modelChange Output from formly
     */
    modelFromEvent: any;

    formlyServ: SilFormlyService;

    fields: FormlyFieldConfig[] = [];

    loanAmount: number;
    formlyConfigSet: boolean = false;

    constructor(
        @Inject(SilFormlyService) _formServ: SilFormlyService,
        public cd: ChangeDetectorRef,
        public formConfig: FormlyConfig,
        private currencyPipe: CurrencyPipe
    ) {
        this.formlyServ = _formServ;
    }

    /** Used to set the field configs */
    setFieldsConfigs() {
        if (!_.isUndefined(this.config)) {
            this.formlyServ[this.config](this.self);
        }
    }

    /** Used to format currency */
    formatMoneyBase(value) {
        if (value === undefined) {
            return;
        }
        const temp = `${value}`.replace(/\,/g, '');
        return this.currencyPipe.transform(temp).replace('$', '');
    }

    /** This will get the form fields */
    getFields() {
        if (this.store === 'login') {
            this.fields = loginForm;
        } else if (this.service) {
            this.fields = this.formlyServ.getServiceFields(this.store);
            this.form = new UntypedFormGroup({});
            this.setFieldsConfigs();
            this.cd.detectChanges();
        } else if (!_.isEmpty(this.storedFields)) {
            this.fields = this.storedFields;
            this.form = new UntypedFormGroup({});
            this.setFieldsConfigs();
            this.cd.detectChanges();
        } else {
            this.formlyServ.getFields(this.store).subscribe(fields => {
                this.fields = fields;
                this.form = new UntypedFormGroup({});
                this.setFieldsConfigs();
                this.cd.detectChanges();
            });
        }
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.formlyServ.setComponent(this);
        this.model = this.modelData;
        this.setFormlyConfig();
        this.getFields();
    }

    /** sets the formly config expression function */
    setFormlyConfig() {
        this.checkExpressionOn = _.isUndefined(this.checkExpressionOn)
            ? 'modelChange'
            : this.checkExpressionOn;
        this.formConfig.addConfig({
            extras: { checkExpressionOn: this.checkExpressionOn },
        });
        this.formlyConfigSet = true;
    }

    /** Hook to the OnChanges lifecycle hook */
    ngOnChanges(changes: SimpleChanges) {
        !_.isUndefined(changes.model)
            ? this.setModel(changes.model.currentValue)
            : '';
        !_.isUndefined(changes.disableSubmit)
            ? this.setDisableSubmit(changes.disableSubmit.currentValue)
            : '';
    }

    /** sets the model data */
    setModel(val) {
        this.model = val;
        this.fields = undefined;
        this.getFields();
    }

    /** disables the submit button */
    setDisableSubmit(val) {
        this.disableSubmit = val;
    }

    /** emits the onSkip event */
    skip() {
        this.onSkip.emit();
    }

    /** emits the onBack event */
    back() {
        this.onBack.emit();
    }

    /** emits the getModelData event */
    getModel(event) {
        this.modelFromEvent = event;
        this.getModelData.emit(event);
    }

    /** emits the cancel event */
    cancelForm() {
        this.cancelFxn.emit();
    }

    /** emits the refresh event */
    refreshFxn() {
        this.refresh.emit();
    }

    /** emits formOptions and submitModel events */
    submitForm(model, form) {
        const selectedModel = this.submitFormModel
            ? model
            : this.modelFromEvent;
        const resultModel = selectedModel || form.value;
        this.setDisableSubmit(true);
        this.formOptions.emit(this.options);
        this.submitModel.emit(resultModel);
        if (this.resetModel) {
            this.options.resetModel();
        }
    }

    /**
     * Export function event
     * @param model the form data
     */
    exportFxn(model: any) {
        this.exportEvent.emit(model);
    }
}
