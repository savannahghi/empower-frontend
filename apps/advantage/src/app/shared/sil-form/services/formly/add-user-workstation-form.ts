import { Injectable } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { AsyncValidatorService } from '../../../component-services/async-validator.service';
import { AbstractControl } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class AddUserWorkstationsFormFieldsService {
    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores user details
     */
    user: any;

    /**
     * Contains non-unique error message
     */
    duplicateErrorMessage: string =
        'This service point has already been assigned to this user';

    constructor(
        public uiglobals: UIRouterGlobals,
        public asyncValidatorService: AsyncValidatorService
    ) {
        this.user = this.uiglobals.params;
    }

    fields() {
        return [
            {
                key: 'workstation',
                type: 'combobox',
                className: 'col-12',
                props: {
                    label: 'Service Point',
                    store: 'workstations',
                    responseKey: 'results',
                    useStateParamFilters: true,
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                        },
                        {
                            key: 'org_unit_name',
                            label: 'Department',
                            newline: true,
                        },
                        {
                            key: 'branch_name',
                            label: 'Branch',
                        },
                    ],
                    extendParams: {
                        fields: 'id,name,org_unit_name,branch_name',
                        active: 'true',
                    },
                    bindValue: 'id',
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    clearSearchOnAdd: false,
                    loadingText: 'Searching workstations..',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                },
                asyncValidators: {
                    uniqueItem: {
                        expression: (control: AbstractControl) => {
                            const stateParamsID = this.user['guid'];
                            const workstation = control?.value;
                            const params = {
                                workstation,
                                user_id: this.user['id'],
                                guid: this.user['guid'],
                                health_worker: this.user['id'],
                            };

                            return this.asyncValidatorService.validateUniquenessEditMode(
                                {
                                    store: 'workstation-users',
                                    stateParamsID,
                                    params,
                                }
                            );
                        },
                        message: this.duplicateErrorMessage,
                    },
                },
                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 2000,
                    },
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
    }
}
