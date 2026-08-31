import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberInvitesComponent } from './member-invites.component';

describe('MemberInvitesComponent', () => {
    let component: MemberInvitesComponent;
    let fixture: ComponentFixture<MemberInvitesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MemberInvitesComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(MemberInvitesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test sendMemberInvite method error', () => {
        const model = {
            email: 'email',
            user_type: 'user_type',
        };

        spyOn(component, 'sendMemberInvite').and.callThrough();

        component.sendMemberInvite(model);
        expect(component.sendMemberInvite).toHaveBeenCalledWith(model);
    });
});
