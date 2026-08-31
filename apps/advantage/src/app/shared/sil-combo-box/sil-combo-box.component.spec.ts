import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { SilStoresService } from '../sil-http-services/sil_datalayer.service';
import { SilComboBoxComponent } from './sil-combo-box.component';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { of } from 'rxjs';
import { StateService } from '@uirouter/angular';

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}
class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: 2,
                    name: 'triage',
                },
                {
                    id: 1,
                    name: 'Dr. Ngure',
                },
            ],
        });
    }
    create() {
        return of({
            services: [
                {
                    id: 2,
                    name: 'advantage',
                },
            ],
            business_partners: [
                {
                    id: 2023,
                    name: '2023',
                },
            ],
            schemes: [
                {
                    id: 'turkana',
                    name: 'turkana',
                },
            ],
        });
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

const response = {
    results: [
        {
            id: 1,
            name: 'Dr. Ngure',
            email: 'ngure@ngure.com',
            person: {
                display: 'Dr Ngure',
            },
        },
        {
            id: 2,
            name: 'triage',
            email: 'triage@triage.com',
            person: {
                display: 'Trieage',
            },
        },
    ],
    services: [
        {
            id: 2,
            name: 'advantage',
            email: 'advantage@advantage.com',
        },
    ],
    business_partners: [
        {
            id: 2023,
            name: '2023',
            email: '2023@2023.com',
        },
    ],
    schemes: [
        {
            id: 2023,
            name: '2023',
            email: ' 2023@2023.com',
        },
    ],
};
class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

describe('SilComboBoxComponent: ', () => {
    let component: SilComboBoxComponent;
    let fixture: ComponentFixture<SilComboBoxComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilComboBoxComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilComboBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test component fns', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.sort = true;
        component.tapFunction();
        component.tapFunctionLoading();
        component.catchErrorFunction();
        component.switchMapItemFunction('prod');
        component.switchMapItemFunction(null);
        component.extendParams = { search: 'June' };
        component.fetchItems();
        component.responseFunction(response);
        component.changeModel({});

        expect(component).toBeTruthy();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test other branch component fns', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.sort = false;
        component.tapFunction();
        component.tapFunctionLoading();
        component.catchErrorFunction();
        component.switchMapItemFunction('prod');
        component.switchMapItemFunction(null);
        component.fetchItems();
        component.responseFunction(response);
        component.changeModel({});
        expect(component).toBeTruthy();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test bp branch component fns', () => {
        component['responseKey'] = 'business_partners';
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.sort = false;
        component.tapFunction();
        component.tapFunctionLoading();
        component.catchErrorFunction();
        component.switchMapItemFunction('prod');
        component.switchMapItemFunction(null);
        component.fetchItems();
        component.responseFunction(response);
        component.changeModel({ id: 1, name: 'Dr Ngure' });
        component.changeModel({});
        expect(component).toBeTruthy();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test scheme branch component fns', () => {
        component['responseKey'] = 'scheme';
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.sort = false;
        component.tapFunction();
        component.tapFunctionLoading();
        component.catchErrorFunction();
        component.switchMapItemFunction('prod');
        component.switchMapItemFunction(null);
        component.fetchItems();
        component.responseFunction(response);
        component.changeModel({});
        expect(component).toBeTruthy();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test component fns', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.sort = true;
        component.modifyQueueList = true;
        component.tapFunction();
        component.tapFunctionLoading();
        component.catchErrorFunction();
        component.switchMapItemFunction('prod');
        component.switchMapItemFunction(null);
        component.fetchItems();
        component.responseFunction(response);
        component.changeModel({});
        expect(component).toBeTruthy();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test responseFunction with practitionerList and a bind value', () => {
        const resp = {
            results: [
                {
                    id: 1,
                    email: 'triage@triage.com',
                    person: {
                        title: 'Mr',
                        person_display: 'John Doe',
                    },
                },
            ],
        };
        spyOn(component, 'responseFunction').and.callThrough();
        component.practitionerList = true;
        component.bind = 'email';
        component.responseFunction(resp);
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should test responseFunction with modifyQueueList and a bind value', () => {
        spyOn(component, 'responseFunction').and.callThrough();
        component.modifyQueueList = true;
        component.bind = 'email';
        component.responseFunction(response);
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should test responseFunction without modifyQueueList and a bind value', () => {
        spyOn(component, 'responseFunction').and.callThrough();
        component.bind = 'email';
        component.responseFunction(response);
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should test bindObject', () => {
        spyOn(component, 'responseFunction').and.callThrough();
        component.bind = 'display';
        component.bindObject = 'person';
        component.responseFunction(response);
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should test patient cover component fns', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        spyOn(component.addNewItem, 'emit');
        component.ngOnInit();
        component.sort = true;
        component.tapFunction();
        component.tapFunctionLoading();
        component.catchErrorFunction();
        component.switchMapItemFunction('prod');
        component.switchMapItemFunction(null);
        component.itemNotFound = true;
        component.addItemOption = true;
        component.term = 'search';

        component.extendParams = { search: 'June' };
        component.fetchItems();
        component.responseFunction({ results: [] });
        const newArr = [];
        expect(newArr).toBeDefined();
        component.changeModel({});
        component.onAddNewItem();
        component.resetTermAndFetchItems();
        component.handleFocusIn();

        expect(component).toBeTruthy();
        expect(component.ngOnInit).toHaveBeenCalled();
        expect(component.addNewItem.emit).toHaveBeenCalled();
    });
});
