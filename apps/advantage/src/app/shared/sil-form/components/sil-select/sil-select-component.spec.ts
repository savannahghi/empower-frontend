import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { UIRouterGlobals } from '@uirouter/angular';
import { of } from 'rxjs';

import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { SilFormSelectComponent } from './sil-select.component';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                    name: 'Test Item',
                },
            ],
        });
    }
    get() {
        return of({
            id: '143224',
            name: 'Test Item',
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
    params: { id: 1 },
    $current: {
        is: () => true,
        params: { id: 1 },
    },
};

describe('Form: SilSelectComponent', () => {
    let component: SilFormSelectComponent;
    let fixture: ComponentFixture<SilFormSelectComponent>;
    let silStoresService: SilStoresService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilFormSelectComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SilFormSelectComponent);
        component = fixture.componentInstance;
        silStoresService = TestBed.inject(SilStoresService);

        spyOnProperty(component, 'props', 'get').and.returnValue({
            store: 'persons',
            responseKey: 'results',
            bindLabel: 'name',
            bindValue: 'id',
            isEdit: true,
            useStateParamFilters: true,
            prefillFields: { id: 'id', name: 'name' },
            modifyItemNotFound: false,
            buttonText: 'Add New',
        });
        spyOnProperty(component, 'model', 'get').and.returnValue({
            person: '12312',
        });
        spyOnProperty(component, 'key', 'get').and.returnValue('person');
        component.field = {
            model: {},
            props: {},
            formControl: new FormControl(),
            defaultValue: null,
        };
        const fb = new FormBuilder();
        const myFormGroup = fb.group({
            id: fb.control(''),
            name: fb.control(''),
        });
        spyOnProperty(component, 'form', 'get').and.returnValue(myFormGroup);
        fixture.detectChanges();
    });

    it('should create component', () => {
        component.switchMapItemFunction('term', 'itemId');
        component.tapFunction();
        component.catchErrorFunction();
        component.tapFunctionLoading();
        component.changeModel({ id: '2', name: 'Test' });
        component.responseFunction({
            results: [{ id: 1, name: 'John' }],
        });
        component.responseFunction({
            obj: { id: 1, name: 'John' },
        });
        component.removeItem();
        component.extendParams = {};
        component.itemId = '1';
        component.cancelBtnClicked = false;
        component.fetchItems();
        component.setPrefillFields({ id: '2', name: 'name' });
        expect(component).toBeTruthy();
    });

    it('should test changeModel method with setSelectedItemToModel', () => {
        spyOn(component.filteredItemResponse, 'emit');
        component.setSelectedItemToModel = true;
        component.changeModel({ id: '2', name: 'Test' });
        expect(component.filteredItemResponse.emit).toHaveBeenCalled();
    });

    it('should test unselect method', () => {
        const item = { name: 'Jane' };
        const items = [{ name: 'Jane' }, { name: 'Kaberu' }];
        spyOn(component.field.formControl, 'setValue');
        component.unselect(item, items);
        expect(component.field.formControl.setValue).toHaveBeenCalled();
    });

    it('should fetch items with search term', fakeAsync(() => {
        component.responseKey = 'results';

        const result$ = component.fetchItems('test');
        let result: any;

        result$.subscribe(data => (result = data));
        tick();

        expect(result).toEqual([{ id: '143224', name: 'Test Item' }]);
    }));

    it('should handle single item response when no responseKey', fakeAsync(() => {
        const simpleResponse = { id: '143224', name: 'Test Item' };
        spyOn(silStoresService, 'list').and.returnValue(of(simpleResponse));
        component.responseKey = undefined;

        const result$ = component.fetchItems('test');
        let result: any;

        result$.subscribe(data => (result = data));
        tick();

        expect(result).toEqual([simpleResponse]);
    }));

    it('should add event to events array in onChange', () => {
        const testEvent = { type: 'change', value: 'test' } as any;
        component.events = [];

        component.onChange(testEvent);

        expect(component.events.length).toEqual(1);
    });

    it('should set default value in ngAfterViewInit', () => {
        const formControl = new FormControl();
        component.field.formControl = formControl;
        component.field.defaultValue = 'defaultValue';
        spyOn(formControl, 'setValue');

        component.ngAfterViewInit();

        expect(formControl.setValue).toHaveBeenCalledWith('defaultValue');
    });
});

const uIRouterGlobalsStub2 = {
    current: {
        name: 'state',
        data: {
            defaultFilterParams: [{ organisation: '12' }],
        },
    },
    params: { id: 1 },
    $current: {
        is: () => true,
        params: { id: 1 },
    },
};

describe('Form: SilSelectComponent with no prefill fields', () => {
    let component: SilFormSelectComponent;
    let fixture: ComponentFixture<SilFormSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilFormSelectComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SilFormSelectComponent);
        component = fixture.componentInstance;
        spyOnProperty(component, 'props', 'get').and.returnValue({
            store: 'persons',
            responseKey: 'results',
            bindLabel: 'name',
            bindValue: 'id',
            isEdit: false,
            buttonEvent: () => {},
            useStateParamFilters: true,
        });

        const fb = new FormBuilder();
        const myFormGroup = fb.group({
            id: fb.control(''),
            name: fb.control(''),
        });
        spyOnProperty(component, 'form', 'get').and.returnValue(myFormGroup);
        fixture.detectChanges();
    });

    it('should create component', () => {
        spyOnProperty(component, 'model', 'get').and.returnValue({
            store: 'persons',
        });
        component.switchMapItemFunction('term', 'itemId');
        component.tapFunction();
        component.buttonTrigger();
        component.catchErrorFunction();
        component.tapFunctionLoading();
        component.changeModel({ id: '2', name: 'Test' });
        component.responseFunction({
            results: [{ id: 1, name: 'John' }],
        });
        component.isEdit = true;
        component.extendParams = {};
        component.fetchItems();
        component.setPrefillFields({ id: '2', name: 'name' });
        expect(component).toBeTruthy();
    });
    it('should create event with id as null when isEdit is true and model has no keyValue', () => {
        component.isEdit = true;
        spyOnProperty(component, 'key', 'get').and.returnValue('missingKey');
        spyOnProperty(component, 'model', 'get').and.returnValue({});

        spyOn(component, 'loadItems');

        component.ngOnInit();

        expect(component.loadItems).toHaveBeenCalledWith({
            term: '',
            id: null,
        });
    });
});

const uIRouterGlobalsStub3 = {
    current: {
        name: 'state',
        data: {
            defaultFilterParams: [],
        },
    },
    params: { id: 1 },
    $current: {
        is: () => true,
        params: { id: 1 },
    },
};

describe('Form: SilSelectComponent with prefill fields', () => {
    let component: SilFormSelectComponent;
    let fixture: ComponentFixture<SilFormSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilFormSelectComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub3 },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SilFormSelectComponent);
        component = fixture.componentInstance;
        spyOnProperty(component, 'props', 'get').and.returnValue({
            store: 'persons',
            responseKey: 'results',
            bindLabel: 'name',
            bindValue: 'id',
            isEdit: true,
            prefillKeys: ['id', 'name'],
            prefillFields: { id: 'id', name: 'name' },
            buttonEvent: () => {},
            useStateParamFilters: true,
        });
        spyOnProperty(component, 'model', 'get').and.returnValue({
            store: 'persons',
        });

        component.prefillKeys = ['id', 'name'];
        component.prefillFields = { id: 'id', name: 'name' };

        const fb = new FormBuilder();
        const myFormGroup = fb.group({
            id: fb.control(''),
            name: fb.control(''),
        });
        spyOnProperty(component, 'form', 'get').and.returnValue(myFormGroup);
        fixture.detectChanges();
    });

    it('should create component', () => {
        component.switchMapItemFunction('term', 'itemId');
        component.tapFunction();
        component.catchErrorFunction();
        component.tapFunctionLoading();
        component.changeModel({ id: '2', name: 'Test' });
        component.responseFunction({
            results: [{ id: 1, name: 'John' }],
        });
        component.responseFunction({
            obj: { id: 1, name: 'John' },
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
describe('Form: SilSelectComponent with modifyItemNotFound', () => {
    let component: SilFormSelectComponent;
    let fixture: ComponentFixture<SilFormSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilFormSelectComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub3 },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SilFormSelectComponent);
        component = fixture.componentInstance;
        spyOnProperty(component, 'props', 'get').and.returnValue({
            store: 'persons',
            responseKey: 'results',
            bindLabel: 'name',
            bindValue: 'id',
            modifyItemNotFound: true,
            buttonText: 'Create New',
        });
        spyOnProperty(component, 'model', 'get').and.returnValue({});

        const fb = new FormBuilder();
        const myFormGroup = fb.group({});
        spyOnProperty(component, 'form', 'get').and.returnValue(myFormGroup);
        fixture.detectChanges();
    });

    it('should set modifyItemNotFound and buttonText from props', () => {
        component.ngOnInit();

        expect(component.modifyItemNotFound).toEqual(true);
        expect(component.buttonText).toEqual('Create New');
    });
});
