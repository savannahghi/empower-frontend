import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilMenuComponent } from './sil-menu.component';
import { StateService } from '@uirouter/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

class StateServiceStub {
    includes() {
        return true;
    }
}

class StateServiceStub2 {
    includes() {
        return false;
    }
}
describe('Display basic SilMenuComponent', () => {
    let component: SilMenuComponent;
    let fixture: ComponentFixture<SilMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilMenuComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [{ provide: StateService, useClass: StateServiceStub }],
        }).compileComponents();

        fixture = TestBed.createComponent(SilMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test toggleChildMenu Fxn', () => {
        component.items = [
            {
                id: 1,
                title: 'Analytics',
                expanded: false,
                children: [
                    {
                        title: 'Visits',
                        expanded: false,
                        url: '',
                    },
                ],
            },
        ];
        spyOn(component, 'toggleChildMenu').and.callThrough();
        component.toggleChildMenu('Analytics');
        expect(component.items[0].expanded).toBeTrue();
        expect(component.toggleChildMenu).toHaveBeenCalled();
    });

    it('should toggle toggleOnLoad function', () => {
        component.items = [
            {
                id: 1,
                title: 'Analytics',
                expanded: false,
                children: [
                    {
                        title: 'Visits',
                        expanded: false,
                        url: '',
                    },
                ],
            },
        ];
        spyOn(component, 'toggleOnLoad').and.callThrough();
        component.toggleOnLoad();
        expect(component.toggleOnLoad).toHaveBeenCalled();
    });

    it('should test togglegrandChildMenu Fxn and toggle the expanded property of a grandchild', () => {
        component.items = [
            {
                id: 1,
                title: 'Analytics',
                expanded: false,
                children: [
                    {
                        title: 'Visits',
                        expanded: false,
                        url: '',
                    },
                ],
            },
        ];
        spyOn(component, 'togglegrandChildMenu').and.callThrough();
        component.togglegrandChildMenu(1, 'Visits');
        expect(component.items).toEqual([
            {
                id: 1,
                title: 'Analytics',
                expanded: false,
                children: [
                    {
                        title: 'Visits',
                        expanded: true,
                        url: '',
                    },
                ],
            },
        ]);
        expect(component.togglegrandChildMenu).toHaveBeenCalled();
    });

    it('should test togglegrandChildMenu and not modify items if parentId is found and childTitle is not found', () => {
        component.items = [
            {
                id: 1,
                title: 'Analytics',
                expanded: false,
                children: [
                    {
                        title: 'Visits',
                        expanded: false,
                        url: '',
                    },
                ],
            },
        ];
        spyOn(component, 'togglegrandChildMenu').and.callThrough();
        component.togglegrandChildMenu(1, 'Test');
        expect(component.items).toEqual([
            {
                id: 1,
                title: 'Analytics',
                expanded: false,
                children: [
                    {
                        title: 'Visits',
                        expanded: false,
                        url: '',
                    },
                ],
            },
        ]);
        expect(component.togglegrandChildMenu).toHaveBeenCalled();
    });

    it('should test when the item does not have children & state not included', () => {
        spyOn(component, 'toggleOnLoad').and.callThrough();
        component.items = [
            {
                id: 1,
                title: 'Analytics',
                expanded: false,
                baseState: 'app',
            },
        ];
        component.toggleOnLoad();
        expect(component.toggleOnLoad).toHaveBeenCalled();
    });

    it('should test togglegrandChildMenu and not modify items if parentId or childTitle is not found', () => {
        component.items = [
            {
                id: 1,
                title: 'Analytics',
                expanded: false,
                children: [
                    {
                        title: 'Visits',
                        expanded: false,
                        url: '',
                    },
                ],
            },
        ];
        spyOn(component, 'togglegrandChildMenu').and.callThrough();
        component.togglegrandChildMenu(3, 'Test');
        expect(component.items).toEqual([
            {
                id: 1,
                title: 'Analytics',
                expanded: false,
                children: [
                    {
                        title: 'Visits',
                        expanded: false,
                        url: '',
                    },
                ],
            },
        ]);
        expect(component.togglegrandChildMenu).toHaveBeenCalled();
    });
});

describe('SilMenuComponent menu state is included', () => {
    let component: SilMenuComponent;
    let fixture: ComponentFixture<SilMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilMenuComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [{ provide: StateService, useClass: StateServiceStub }],
        }).compileComponents();

        fixture = TestBed.createComponent(SilMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should toggle toggleOnLoad function and update if state includes menu basestate and submenu basestate', () => {
        component.items = [
            {
                id: 1,
                title: 'Analytics',
                expanded: false,
                baseState: 'app.quintus.home.providerAnalytics',
                children: [
                    {
                        title: 'Visits',
                        expanded: false,
                        url: '',
                        baseState:
                            'app.quintus.home.providerAnalytics.schemeInformation',
                    },
                ],
            },
        ];
        spyOn(component, 'toggleOnLoad').and.callThrough();
        component.toggleOnLoad();
        expect(component.items).toEqual([
            {
                id: 1,
                title: 'Analytics',
                expanded: true,
                baseState: 'app.quintus.home.providerAnalytics',
                children: [
                    {
                        title: 'Visits',
                        expanded: true,
                        baseState:
                            'app.quintus.home.providerAnalytics.schemeInformation',
                        url: '',
                    },
                ],
            },
        ]);
    });
});

describe('SilMenuComponent menu state is not included', () => {
    let component: SilMenuComponent;
    let fixture: ComponentFixture<SilMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SilMenuComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [{ provide: StateService, useClass: StateServiceStub2 }],
        }).compileComponents();

        fixture = TestBed.createComponent(SilMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test when the item does not have children', () => {
        spyOn(component, 'toggleOnLoad').and.callThrough();
        component.items = [
            {
                id: 1,
                title: 'Analytics',
                expanded: false,
                baseState: 'app',
            },
        ];
        component.toggleOnLoad();
        expect(component.toggleOnLoad).toHaveBeenCalled();
    });

    it('should toggle toggleOnLoad function and update if state includes menu basestate and submenu basestate', () => {
        component.items = [
            {
                id: 1,
                title: 'Analytics',
                expanded: false,
                baseState: 'app.quintus.home.providerAnalytics',
                children: [
                    {
                        title: 'Visits',
                        expanded: false,
                        url: '',
                        baseState:
                            'app.quintus.home.providerAnalytics.schemeInformation',
                    },
                ],
            },
        ];
        spyOn(component, 'toggleOnLoad').and.callThrough();
        component.toggleOnLoad();
        expect(component.items).toEqual([
            {
                id: 1,
                title: 'Analytics',
                expanded: false,
                baseState: 'app.quintus.home.providerAnalytics',
                children: [
                    {
                        title: 'Visits',
                        expanded: false,
                        baseState:
                            'app.quintus.home.providerAnalytics.schemeInformation',
                        url: '',
                    },
                ],
            },
        ]);
    });
});
