import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { UIRouterGlobals } from '@uirouter/angular';
import { of } from 'rxjs';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';

import { SilFormComboboxComponent } from './sil-combobox.component';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                },
            ],
        });
    }
    get() {
        return of({
            id: '143224',
        });
    }
    listNested() {
        return of({
            results: [
                {
                    id: 'nested-143224',
                },
            ],
        });
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
        data: {
            defaultFilterParams: [{ organisation: { param: 'id' } }],
        },
    },
    params() {
        return { id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { id: 1 };
        },
    },
};

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

describe('Form: SilComboboxComponent', () => {
    let component: SilFormComboboxComponent;
    let fixture: ComponentFixture<SilFormComboboxComponent>;
    let silStoresService: SilStoresService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilFormComboboxComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SilFormComboboxComponent);
        component = fixture.componentInstance;
        silStoresService = TestBed.inject(SilStoresService);

        spyOnProperty(component, 'props', 'get').and.returnValue({
            store: 'persons',
            responseKey: 'results',
            bind: 'person_name',
            bindValue: 'person_name',
            isEdit: true,
            useStateParamFilters: true,
            prefillFields: { id: 'id', name: 'Name' },
            useModelParamFilters: true,
            modelFilters: ['payer'],
        });
        spyOnProperty(component, 'model', 'get').and.returnValue({
            store: 'persons',
            payer: '12312',
        });
        spyOnProperty(component, 'key', 'get').and.returnValue('payer');
        component.field = {
            model: {
                pricelist_products: {
                    id: '1',
                    pricelist_product_id: '1',
                    unit_price: 100,
                },
                price: 10,
            },
            props: {},
            formControl: new FormControl(),
        };
        const fb = new FormBuilder();
        const myFormGroup = fb.group({
            id: fb.control('ids'),
            name: fb.control('name'),
            myFormArray: fb.array([
                { id: { value: '21' } },
                { name: { value: 'Jack' } },
            ]),
        });
        const formArray = myFormGroup.get('myFormArray') as FormArray;
        formArray.push(fb.control('23'));
        formArray.push(fb.control('Jak'));
        spyOnProperty(component, 'form', 'get').and.returnValue(
            formArray.parent
        );
        spyOnProperty(component, 'formControl', 'get').and.returnValue(
            new FormControl()
        );
        fixture.detectChanges();
    });

    it('should create component', () => {
        component.switchMapItemFunction('term', 'itemId');
        component.tapFunction();
        component.catchErrorFunction();
        component.tapFunctionLoading();
        component.changeModel({ id: '2' });
        component.responseFunction({
            results: [{ id: 1, person_name: 'John' }],
        });
        component.responseFunction({
            obj: { id: 1, person_name: 'John' },
        });
        component.removeItem();
        component.extendParams = {};
        component.itemId = '1';
        component.cancelBtnClicked = false;
        component.fetchItems();
        component.setPrefillFields({ id: '2', name: 'name' });
        expect(component).toBeTruthy();
    });

    it('should check if binding is an object with no keys', () => {
        const ob = {};
        component.isObject(ob);
        expect(component.isObject(ob)).toBe(false);
    });

    it('should check if binding is an object with keys/not empty', () => {
        const ob = { id: '1' };
        component.isObject(ob);
        expect(component.isObject(ob)).toBe(true);
    });

    it('should check if binding is not object', () => {
        const ob = 'string';
        component.isObject(ob);
        expect(component.isObject(ob)).toBe(false);
    });

    it('should test changeModel method with setSelectedItemToModel', () => {
        spyOn(component, 'changeModel').and.callThrough();
        component.setSelectedItemToModel = true;
        component.changeModel({ id: '2' });
        expect(component.changeModel).toHaveBeenCalled();
    });

    it('should remove disabled property and return array when responseKey exists', () => {
        const resp = {
            results: [
                { id: 1, name: 'John', disabled: { status: true } },
                { id: 2, name: 'Jane', disabled: { status: false } },
            ],
        };

        const result = component.responseFunction(resp);

        expect(result).toEqual([
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
        ]);

        expect(result[0].disabled).toBeUndefined();

        expect(component.term).toBe('');
    });

    it('should wrap response in array and remove disabled when responseKey does NOT exist', () => {
        component.responseKey = undefined;
        const resp = {
            id: 10,
            name: 'Solo',
            disabled: { status: true },
        };

        const result = component.responseFunction(resp);

        expect(result).toEqual([{ id: 10, name: 'Solo' }]);

        expect(result[0].disabled).toBeUndefined();

        expect(component.term).toBe('');
    });

    it('should support empty results array and still reset term', () => {
        const resp = { results: [] };

        const result = component.responseFunction(resp);

        expect(result).toEqual([]);
        expect(component.term).toBe('');
    });

    it('should test unselect method', () => {
        const item = { name: 'Jane' };
        const items = [{ name: 'Jane' }, { name: 'Kaberu' }];
        spyOn(component, 'unselect').and.callThrough();
        component.unselect(item, items);
        component.changeModel({ id: '2' });
        expect(component.unselect).toHaveBeenCalled();
    });

    it('should call listNested with correct parameters', () => {
        component.extendedNestedParams = {
            paramView: 'viewParam',
            paramValue: 'valueParam',
        };

        const listNestedSpy = spyOn(
            silStoresService,
            'listNested'
        ).and.callThrough();

        component.fetchItems('test-term').subscribe(response => {
            expect(response).toEqual([{ id: 'nested-143224' }]);
        });

        expect(listNestedSpy).toHaveBeenCalled();
    });
});

const uIRouterGlobalsStub2 = {
    current: {
        name: 'state',
        data: {
            defaultFilterParams: [{ organisation: '12' }],
        },
    },
    params() {
        return { id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { id: 1 };
        },
    },
};

describe('Form: SilComboboxComponent with no prefill fields', () => {
    let component: SilFormComboboxComponent;
    let fixture: ComponentFixture<SilFormComboboxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilFormComboboxComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SilFormComboboxComponent);
        component = fixture.componentInstance;
        spyOnProperty(component, 'props', 'get').and.returnValue({
            store: 'persons',
            responseKey: 'results',
            bind: 'person_name',
            isEdit: false,

            bindValue: 'person_name',
            buttonEvent: () => {},
            useStateParamFilters: true,
        });
        spyOnProperty(component, 'model', 'get').and.returnValue({
            store: 'persons',
        });

        const fb = new FormBuilder();
        const myFormGroup = fb.group({
            id: fb.control('ids'),
            name: fb.control('name'),
            myFormArray: fb.array([
                { id: { value: '21' } },
                { name: { value: 'Jack' } },
            ]),
        });
        const formArray = myFormGroup.get('myFormArray') as FormArray;
        formArray.push(fb.control('23'));
        formArray.push(fb.control('Jak'));
        spyOnProperty(component, 'form', 'get').and.returnValue(
            formArray.parent
        );
        spyOnProperty(component, 'formControl', 'get').and.returnValue(
            new FormControl()
        );
        fixture.detectChanges();
    });

    it('should create component', () => {
        component.switchMapItemFunction('term', 'itemId');
        component.tapFunction();
        component.buttonTrigger();
        component.catchErrorFunction();
        component.tapFunctionLoading();
        component.changeModel({ id: '2' });
        component.responseFunction({
            results: [{ id: 1, person_name: 'John' }],
        });
        component.extendParams = {};
        component.fetchItems();
        component.setPrefillFields({ id: '2', name: 'name' });
        expect(component).toBeTruthy();
    });
});

const uIRouterGlobalsStub3 = {
    current: {
        name: 'state',
        data: {
            defaultFilterParams: [],
        },
    },
    params() {
        return { id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { id: 1 };
        },
    },
};
describe('Form: SilComboboxComponent with no prefill fields', () => {
    let component: SilFormComboboxComponent;
    let fixture: ComponentFixture<SilFormComboboxComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilFormComboboxComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub3 },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SilFormComboboxComponent);
        component = fixture.componentInstance;
        spyOnProperty(component, 'props', 'get').and.returnValue({
            store: 'persons',
            responseKey: 'results',
            bind: 'person_name',
            bindValue: 'person_name',
            prefillKeys: ['id', 'name'],
            prefillFields: { id: 'id', name: 'name' },
            buttonEvent: () => {},
            useStateParamFilters: true,
        });
        spyOnProperty(component, 'model', 'get').and.returnValue({
            store: 'persons',
        });

        component.prefillKeys = ['key1', 'key2'];
        component.prefillFields = { key1: 'field1', key2: 'field2' };

        const fb = new FormBuilder();
        const myFormGroup = fb.group({
            id: fb.control('ids'),
            name: fb.control('name'),
            myFormArray: fb.array([
                { id: { value: '21' } },
                { name: { value: 'Jack' } },
            ]),
        });
        const formArray = myFormGroup.get('myFormArray') as FormArray;
        formArray.push(fb.control('23'));
        formArray.push(fb.control('Jak'));
        spyOnProperty(component, 'form', 'get').and.returnValue(
            formArray.parent
        );
        spyOnProperty(component, 'formControl', 'get').and.returnValue(
            new FormControl()
        );
        fixture.detectChanges();
    });

    it('should create component', () => {
        component.switchMapItemFunction('term', 'itemId');
        component.tapFunction();
        component.catchErrorFunction();
        component.tapFunctionLoading();
        component.changeModel({ id: '2' });
        component.responseFunction({
            results: [{ id: 1, person_name: 'John' }],
        });
        component.responseFunction({
            obj: { id: 1, person_name: 'John' },
        });
        component.removeItem();
        component.extendParams = {};
        component.itemId = '1';
        component.isEdit = true;

        component.cancelBtnClicked = false;
        component.fetchItems();
        component.setPrefillFields({ id: '2', name: 'name' });
        expect(component).toBeTruthy();
    });
});

describe('Form: SilComboboxComponent with no prefill fields', () => {
    let component: SilFormComboboxComponent;
    let fixture: ComponentFixture<SilFormComboboxComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilFormComboboxComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub3 },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SilFormComboboxComponent);
        component = fixture.componentInstance;
        spyOnProperty(component, 'props', 'get').and.returnValue({
            store: 'persons',
            responseKey: 'results',
            bind: 'person_name',
            bindValue: 'person_name',
            isEdit: true,
            useStateParamFilters: true,
            prefillFields: { id: 'id', name: 'Name' },
            useModelParamFilters: true,
            modelFilters: ['payer'],
        });
        spyOnProperty(component, 'key', 'get').and.returnValue('payer');
        spyOnProperty(component, 'model', 'get').and.returnValue({});

        component.prefillKeys = ['key1', 'key2'];
        component.prefillFields = { key1: 'field1', key2: 'field2' };

        const fb = new FormBuilder();
        const myFormGroup = fb.group({
            id: fb.control('ids'),
            name: fb.control('name'),
            myFormArray: fb.array([
                { id: { value: '21' } },
                { name: { value: 'Jack' } },
            ]),
        });
        const formArray = myFormGroup.get('myFormArray') as FormArray;
        formArray.push(fb.control('23'));
        formArray.push(fb.control('Jak'));
        spyOnProperty(component, 'form', 'get').and.returnValue(
            formArray.parent
        );
        spyOnProperty(component, 'formControl', 'get').and.returnValue(
            new FormControl()
        );
        fixture.detectChanges();
    });

    it('should cover ngOnInit when model does not contain the key (id fallback to null)', () => {
        component.ngOnInit();
        expect(component.isEdit).toBeTrue();
    });
});
