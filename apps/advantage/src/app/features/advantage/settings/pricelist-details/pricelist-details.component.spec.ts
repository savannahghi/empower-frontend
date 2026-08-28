import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'translate',
    standalone: false,
})
class TranslatePipeStub implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

@Pipe({
    name: 'titleCase',
    standalone: false,
})
class TitleCasePipeStub implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}
import { TranslateService } from '@ngx-translate/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { of, throwError } from 'rxjs';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilFormlyService } from '../../../../shared/sil-form/services/skika-formly-service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';

import { PricelistDetailsComponent } from './pricelist-details.component';

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class NbToastrServiceStub {
    show() {
        return 'toast shown';
    }
}

describe('PricelistDetailsComponent', () => {
    let component: PricelistDetailsComponent;
    let fixture: ComponentFixture<PricelistDetailsComponent>;
    let silStoresService: any;
    let toastrService: any;
    let errorHandler: any;
    let uiglobals: any;

    const pricelistResponse = {
        id: '1',
        name: 'Test Pricelist',
        effective_from: '2025-07-24T00:00:00+03:00',
        effective_to: '2025-07-30T00:00:00+03:00',
        description: 'desc',
    };

    beforeEach(() => {
        silStoresService = {
            get: jasmine
                .createSpy('get')
                .and.returnValue(of({ ...pricelistResponse })),
            update: jasmine
                .createSpy('update')
                .and.returnValue(
                    of({ ...pricelistResponse, name: 'Updated Pricelist' })
                ),
        };
        toastrService = new NbToastrServiceStub();
        errorHandler = { handleError: jasmine.createSpy('handleError') };
        uiglobals = { params: { id: '1' } };

        TestBed.configureTestingModule({
            declarations: [
                PricelistDetailsComponent,
                TranslatePipeStub,
                TitleCasePipeStub,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: ErrorHandlerService, useValue: errorHandler },
                { provide: SilFormlyService, useValue: {} },
                { provide: SilStoresService, useValue: silStoresService },
                { provide: NbToastrService, useValue: toastrService },
                { provide: UIRouterGlobals, useValue: uiglobals },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PricelistDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch pricelist info on init', () => {
        spyOn(component, 'getPricelistInfo').and.callThrough();
        component.ngOnInit();
        expect(component.getPricelistInfo).toHaveBeenCalled();
        expect(silStoresService.get).toHaveBeenCalledWith('pricelists', '1');
        expect(component.pricelist.name).toBe('Test Pricelist');
        expect(component.loading).toBe(false);
    });

    it('should not fetch pricelist info if id is missing', () => {
        uiglobals.params.id = undefined;
        component.getPricelistInfo();
        expect(silStoresService.get).not.toHaveBeenCalledWith(
            'pricelists',
            undefined
        );
    });

    it('should handle error when fetching pricelist info', () => {
        silStoresService.get.and.returnValue(throwError('error'));
        component.getPricelistInfo();
        expect(errorHandler.handleError).toHaveBeenCalled();
        expect(component.loading).toBe(false);
    });

    it('should open edit modal if pricelist exists and has name', () => {
        component.pricelist = { name: 'Test Pricelist' };
        component.showEditPricelistModal = false;
        component.editPricelistDetails();
        expect(component.showEditPricelistModal).toBe(true);
    });

    it('should fetch pricelist info if pricelist is missing or has no name', () => {
        component.pricelist = undefined;
        spyOn(component, 'getPricelistInfo');
        component.editPricelistDetails();
        expect(component.getPricelistInfo).toHaveBeenCalled();

        component.pricelist = { name: '' };
        component.editPricelistDetails();
        expect(component.getPricelistInfo).toHaveBeenCalled();
    });

    it('should submit edit pricelist details and show success toast', () => {
        spyOn(component, 'showToast');
        component.submitEditPricelistDetails({ name: 'Updated Pricelist' });
        expect(silStoresService.update).toHaveBeenCalledWith(
            'pricelists',
            '1',
            { name: 'Updated Pricelist' }
        );
        expect(component.pricelist.name).toBe('Updated Pricelist');
        expect(component.loading).toBe(false);
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Pricelist details updated successfully.',
            'Pricelist'
        );
    });

    it('should handle error on submitEditPricelistDetails and show error toast', () => {
        silStoresService.update.and.returnValue(throwError('error'));
        spyOn(component, 'showToast');
        component.submitEditPricelistDetails({ name: 'Updated Pricelist' });
        expect(errorHandler.handleError).toHaveBeenCalled();
        expect(component.loading).toBe(false);
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Failed to update pricelist details.',
            'Pricelist'
        );
    });

    it('should show toast with correct params', () => {
        const spy = spyOn(toastrService, 'show').and.callThrough();
        component.showToast('top-right', 'info', 'Test message', 'TestContext');
        expect(spy).toHaveBeenCalledWith('TestContext', 'Test message', {
            position: 'top-right',
            status: 'info',
            duration: component.toastTime,
        });
    });

    it('should submit edit pricelist details and show success toast', () => {
        spyOn(component, 'showToast');
        component.submitEditPricelistDetails({ name: 'Updated Pricelist' });
        expect(silStoresService.update).toHaveBeenCalledWith(
            'pricelists',
            '1',
            { name: 'Updated Pricelist' }
        );
        expect(component.pricelist.name).toBe('Updated Pricelist');
        expect(component.loading).toBe(false);
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Pricelist details updated successfully.',
            'Pricelist'
        );
    });

    it('should handle error on submitEditPricelistDetails and show error toast', () => {
        silStoresService.update.and.returnValue(throwError('error'));
        spyOn(component, 'showToast');
        component.submitEditPricelistDetails({ name: 'Updated Pricelist' });
        expect(errorHandler.handleError).toHaveBeenCalled();
        expect(component.loading).toBe(false);
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Failed to update pricelist details.',
            'Pricelist'
        );
    });

    it('should show toast with correct params', () => {
        const spy = spyOn(toastrService, 'show').and.callThrough();
        component.showToast('top-right', 'info', 'Test message', 'TestContext');
        expect(spy).toHaveBeenCalledWith('TestContext', 'Test message', {
            position: 'top-right',
            status: 'info',
            duration: component.toastTime,
        });
    });

    it('should close the edit pricelist modal', () => {
        component.showEditPricelistModal = true;
        component.closeEditPricelistModal();
        expect(component.showEditPricelistModal).toBe(false);
    });
});
