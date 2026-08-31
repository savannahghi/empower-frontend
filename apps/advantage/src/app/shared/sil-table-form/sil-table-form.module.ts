import { NgModule } from '@angular/core';

import { SilTableFormComponent } from './components/sil-table-form.component';
import { SilDatatableModule } from '../sil-datatable/sil-datatable.module';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
    imports: [SilDatatableModule, ThemeModule],
    declarations: [SilTableFormComponent],
    exports: [SilTableFormComponent],
    providers: [],
})
export class SilTableFormModule {}
