import { SilDatatableFiltersComponent } from './sil-datatable-filters.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { UIRouterGlobals } from '@uirouter/core';

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

describe('SilDatatableFiltersComponent', () => {
    let component: SilDatatableFiltersComponent;
    let fixture: ComponentFixture<SilDatatableFiltersComponent>;

    const uIRouterGlobalsStub = {
        params: {
            page_size: '2',
        },
        $current: {
            params: {
                page_size: '2',
            },
            parent: {
                name: 'app.advantage.visits',
            },
        },
        current: {
            name: 'app.advantage.visits.detail',
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, mockPipe('translate')],
            declarations: [SilDatatableFiltersComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({
                            params: {
                                sladecode: 123,
                            },
                        }),
                    },
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilDatatableFiltersComponent);
        component = fixture.componentInstance;
        component.statusFilter = [
            {
                active: false,
                filter: {
                    status: 'clear',
                },
                display: 'ALL',
            },
        ];
        fixture.detectChanges();
    });

    it('should test setActive method and active filter is not found', () => {
        spyOn(component, 'setActive').and.callThrough();
        // make sure active is not found
        component.statusFilter = [
            {
                active: false,
                filter: {
                    status: 'clear',
                },
                display: 'ALL',
            },
        ];
        component.setActive('ALL');
        expect(component.setActive).toHaveBeenCalled();
    });

    it('should test setActive method', () => {
        spyOn(component, 'setActive').and.callThrough();
        // make sure active is defined
        component.statusFilter = [
            {
                active: true,
                display: 'ALL',
                filter: {
                    status: 'clear',
                },
            },
            {
                display: 'key',
                filter: {
                    status: 'ACTIVE',
                },
            },
        ];
        component.setActive('key');
        // send a key that does not exist in statusFilter
        component.setActive('noKey');
        expect(component.setActive).toHaveBeenCalled();
    });

    it('should test setStatus method', () => {
        spyOn(component, 'setActive').and.callThrough();
        spyOn(component, 'clickSetStatus').and.callThrough();
        const status = {
            active: true,
            filter: { active: 'ACTIVE', status: 'clear' },
            display: 'ALL',
        };
        const inactivestatus = {
            active: true,
            filter: { active: 'NOT ACTIVE' },
            display: 'NOT ACTIVE',
        };
        component.statusFilter = [status, inactivestatus];
        component.setStatus(status);
        component.clickSetStatus(status);
        expect(component.setActive).toHaveBeenCalledWith('ALL');
        expect(component.clickSetStatus).toHaveBeenCalledWith(status);
        component.setActive(inactivestatus.display);
        expect(component.setActive).toHaveBeenCalledWith('ALL');
        component.statusFilter = [{ page_size: '2' }];
        component.setActiveFilter();
        expect(component.setActive).toHaveBeenCalled();
    });
});
