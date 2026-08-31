import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { UIRouterGlobals } from '@uirouter/core';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { PatientService } from '../patient.service';
import { of } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { PatientCoversComponent } from './patient-covers.component';
class NbToastrServiceStub {
    show() {
        return {};
    }
}
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
const uIRouterGlobalsStub = {
    params: {
        id: '112',
        service_request: 'wer',
        page_size: '2',
        queue: 1,
    },
};
class SilStoresServiceStub {
    get() {
        return of({
            results: [],
        });
    }

    downloadDocument() {
        return of({ response: {} });
    }

    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '2' }],
        });
    }

    list() {
        return of({
            results: {
                new_price: 18,
                amount: '18',
                product_name: 'Lipid',
                quantity: 1,
            },
        });
    }
}
describe('PatientCoversComponent', () => {
    let component: PatientCoversComponent;
    let fixture: ComponentFixture<PatientCoversComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientCoversComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: ErrorHandlerService,
                    useValue: { handleError: jasmine.createSpy() },
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },

                { provide: NbToastrService, useClass: NbToastrServiceStub },

                PatientService,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientCoversComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({
            customer_id: 1,
        });
        fixture.detectChanges();
    });

    it('should call getPatientInfo during ngOnInit', () => {
        spyOn(component, 'getPatientInfo');
        component.ngOnInit();
        expect(component.getPatientInfo).toHaveBeenCalled();
    });

    it('should set queryArg when calling setFilter', () => {
        const event = 'test event';
        component.setFilter(event);
        expect(component.queryArg).toEqual(event);
    });

    it('should toggle showModal property when calling toggleModal', () => {
        component.showModal = false;
        component.toggleModal();
        expect(component.showModal).toBe(true);
        component.toggleModal();
        expect(component.showModal).toBe(false);
    });

    it('should call showToast', () => {
        spyOn(component, 'getPatientInfo').and.callThrough();
        const position = 'top-right';
        const status = 'success';
        const title = 'Test Title';
        const context = 'Test Context';
        spyOn(component, 'showToast').and.callThrough();
        component.showToast(position, status, title, context);
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should set formOptions when calling getFormOptions', () => {
        const formOptions = {};
        component.getFormOptions(formOptions);
        expect(component.formOptions).toEqual(formOptions);
    });
});
