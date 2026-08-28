import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SkikaAuthComponent } from './components/skika-auth/skika-auth.component';
import { SkikaLoginComponent } from './components/login/login.component';
import { SkikaRegisterComponent } from './components/register/register.component';
import { CompleteAuthComponent } from './components/complete/complete.component';
import { SilLogoutComponent } from './components/logout/logout.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { EmpowerWelcomeComponent } from './components/welcome/empower-welcome.component';

export const routes: Routes = [
    {
        path: '',
        component: SkikaAuthComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
            {
                path: 'login',
                component: SkikaLoginComponent,
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent,
            },
            {
                path: 'sign-up',
                component: SignUpComponent,
            },
            {
                path: 'complete',
                component: CompleteAuthComponent,
            },
            {
                path: 'logout',
                component: SilLogoutComponent,
            },
            {
                path: 'register',
                component: SkikaRegisterComponent,
            },
            { path: 'welcome', component: EmpowerWelcomeComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SkikaAuthRoutingModule {}
