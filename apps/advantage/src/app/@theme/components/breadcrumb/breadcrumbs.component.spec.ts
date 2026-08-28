import { BreadcrumbsComponent } from './breadcrumbs.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UIRouter, Transition } from '@uirouter/core';

const transitionStub = {
    params: () => {
        return { id: 1 };
    },
    treeChanges: () => {
        const nodes = [
            {
                state: {
                    breadcrumb: () => 'Home',
                },
            },
        ];
        return nodes;
    },
};

const uIRouterStub = {
    globals: {
        successfulTransitions: {
            peekTail: () => {
                const obj = {
                    treeChanges: () => {
                        const nodes = [
                            {
                                state: {
                                    breadcrumb: () => 'Home',
                                },
                            },
                        ];
                        return nodes;
                    },
                };

                return obj;
            },
        },
    },
    transitionService: {
        onSuccess: (criteria, transition) => {
            const params = {
                transition: transition,
                treeChanges: () => {
                    const nodes = [
                        {
                            state: {
                                breadcrumb: () => 'Home',
                            },
                        },
                    ];
                    return nodes;
                },
            };

            return params;
        },
    },
};

describe('BreadcrumbsComponent', () => {
    let component: BreadcrumbsComponent;
    let fixture: ComponentFixture<BreadcrumbsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BreadcrumbsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Transition, useValue: transitionStub },
                { provide: UIRouter, useValue: uIRouterStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BreadcrumbsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create BreadcrumbComponent', () => {
        component.unsub = () => {};
        spyOn(component, 'updateCrumbs').and.callThrough();
        component.hookCriteria(transitionStub);
        expect(component.updateCrumbs).toHaveBeenCalled();
    });
});
