import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkikaFormModule } from '../../shared/sil-form/sil-form.module';

/** contains services that mock data */
const SERVICES = [];

@NgModule({
    imports: [CommonModule, SkikaFormModule],
    providers: [...SERVICES],
})
export class MockDataModule {
    static forRoot(): ModuleWithProviders<MockDataModule> {
        return {
            ngModule: MockDataModule,
            providers: [...SERVICES],
        };
    }
}
