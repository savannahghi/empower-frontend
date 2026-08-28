import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InitialsAvatarComponent } from './initials-avatar.component';
import { UIRouterGlobals } from '@uirouter/core';
const uIRouterGlobalsStub = {
    params: { id: 1 },
    $current: {
        params: { id: 1 },
    },
    current: {
        name: 'app',
    },
};

describe('InitialsAvatarComponent', () => {
    let component: InitialsAvatarComponent;
    let fixture: ComponentFixture<InitialsAvatarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InitialsAvatarComponent],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(InitialsAvatarComponent);
        component = fixture.componentInstance;
        component.name = 'John Doe';
        fixture.detectChanges();
    });

    it('should create', () => {
        component.getInitials(undefined);
        component.getInitials('John Doe');
        component.getInitials('John Doe Doe');
        component.getInitials('John');
        expect(component).toBeTruthy();
    });
});
