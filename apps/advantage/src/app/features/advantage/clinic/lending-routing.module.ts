import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LendingBaseComponent } from './lending.component';
import { ProviderListingComponent } from '../home/provider-listing/provider-listing.component';

const routes: Routes = [
    {
        path: '',
        component: LendingBaseComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'patient-list' },
            {
                path: 'providers',
                component: ProviderListingComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LendingRoutingModule {}
