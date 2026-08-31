import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermcheckerDirective } from './permchecker.directive';
import { FlagCheckerDirective } from './flagchecker.directive';
import { ScrollToBottomDirective } from './scrolltobottom.directive';
import { InviewDirective } from './inview.directive';
import { VariantFlagCheckerDirective } from './advancedflagchecker.directive';
import { VariantPipe } from '../../@theme/pipes/variant/variant.pipe';

@NgModule({
    declarations: [
        PermcheckerDirective,
        FlagCheckerDirective,
        VariantFlagCheckerDirective,
        ScrollToBottomDirective,
        InviewDirective,
    ],
    exports: [
        PermcheckerDirective,
        FlagCheckerDirective,
        VariantFlagCheckerDirective,
        ScrollToBottomDirective,
        InviewDirective,
    ],
    imports: [CommonModule, VariantPipe],
    providers: [VariantPipe],
})
export class DirectivesModule {}
