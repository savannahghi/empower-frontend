import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropDirectiveModule } from '@ks89/ngx-drag-n-drop';
import { NbStatusService } from '@nebular/theme';
import { JsonFormBuilderComponent } from './json-form-builder.component';

class NbStatusServiceStub {
    isCustomStatus() {}
}

describe('JsonFormBuilderComponent', () => {
    let component: JsonFormBuilderComponent;
    let fixture: ComponentFixture<JsonFormBuilderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                JsonFormBuilderComponent,
                CommonModule,
                DragDropDirectiveModule,
            ],
            providers: [
                { provide: NbStatusService, useClass: NbStatusServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(JsonFormBuilderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    const formTextarea = {
        type: 'textarea',
        props: {
            label: 'Textarea label',
        },
    };

    it('should test form builder methods', () => {
        component.addFormOptionToList('textarea');
        component.startDrag(0);
        component.releaseDrop();
        component.addDropItemTop(formTextarea, formTextarea, 0);
        component.addDropItemBottom(formTextarea, formTextarea, 0);
        expect(component).toBeTruthy();
    });
});
