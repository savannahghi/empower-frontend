import { ThemeModule } from './theme.module';
import { TestBed } from '@angular/core/testing';
import { NbThemeModule } from '@nebular/theme';

describe('ThemeModule', () => {
    let service: ThemeModule;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [NbThemeModule],
            imports: [ThemeModule.forRoot()],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(ThemeModule);
    });

    it('should test theme module', () => {
        service = TestBed.inject(ThemeModule);
        expect(service).toBeDefined();
    });
});
