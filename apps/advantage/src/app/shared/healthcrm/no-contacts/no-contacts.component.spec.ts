import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoContactsComponent } from './no-contacts.component';

describe('NoContactsComponent', () => {
    let component: NoContactsComponent;
    let fixture: ComponentFixture<NoContactsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NoContactsComponent],
        });
        fixture = TestBed.createComponent(NoContactsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
