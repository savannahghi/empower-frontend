import { TestBed } from '@angular/core/testing';

import { OperatingSystemDetectionService } from './operating-system-detection.service';

describe('OperatingSystemDetectionService', () => {
    let service: OperatingSystemDetectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OperatingSystemDetectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should test getCurrentOS function', () => {
        spyOn(service, 'getCurrentOS').and.callThrough();
        spyOnProperty(window.navigator, 'userAgent').and.returnValue(
            'Windows NT'
        );
        service.getCurrentOS();
        expect(service.getCurrentOS).toHaveBeenCalled();
    });

    it('should test isCurrentOsSupported function', () => {
        const currentOS = 'Windows';

        spyOn(service, 'isCurrentOsSupported').and.callThrough();
        service.isCurrentOsSupported(currentOS);
        expect(service.isCurrentOsSupported).toHaveBeenCalledWith(currentOS);
    });
});

describe('OperatingSystemDetectionService if OS is Android', () => {
    let service: OperatingSystemDetectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OperatingSystemDetectionService);
    });

    it('should test getCurrentOS function', () => {
        spyOn(service, 'getCurrentOS').and.callThrough();
        spyOnProperty(window.navigator, 'userAgent').and.returnValue('Android');
        service.getCurrentOS();
        expect(service.getCurrentOS).toHaveBeenCalled();
    });

    it('should test isCurrentOsSupported function', () => {
        const currentOS = 'Android';

        spyOn(service, 'isCurrentOsSupported').and.callThrough();
        service.isCurrentOsSupported(currentOS);
        expect(service.isCurrentOsSupported).toHaveBeenCalledWith(currentOS);
    });
});

describe('OperatingSystemDetectionService if OS is iOS', () => {
    let service: OperatingSystemDetectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OperatingSystemDetectionService);
    });

    it('should test getCurrentOS function', () => {
        spyOn(service, 'getCurrentOS').and.callThrough();
        spyOnProperty(window.navigator, 'userAgent').and.returnValue(
            'iPhone|iPad|iPod'
        );
        service.getCurrentOS();
        expect(service.getCurrentOS).toHaveBeenCalled();
    });

    it('should test isCurrentOsSupported function', () => {
        const currentOS = 'iOS';

        spyOn(service, 'isCurrentOsSupported').and.callThrough();
        service.isCurrentOsSupported(currentOS);
        expect(service.isCurrentOsSupported).toHaveBeenCalledWith(currentOS);
    });
});

describe('OperatingSystemDetectionService if OS is Mac OS X', () => {
    let service: OperatingSystemDetectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OperatingSystemDetectionService);
    });

    it('should test getCurrentOS function', () => {
        spyOn(service, 'getCurrentOS').and.callThrough();
        spyOnProperty(window.navigator, 'userAgent').and.returnValue(
            'Mac OS X'
        );

        spyOnProperty(window.navigator, 'maxTouchPoints').and.returnValue(2);

        service.getCurrentOS();
        expect(service.getCurrentOS).toHaveBeenCalled();
    });

    it('should test isCurrentOsSupported function', () => {
        const currentOS = 'Mac OS X';

        spyOn(service, 'isCurrentOsSupported').and.callThrough();
        service.isCurrentOsSupported(currentOS);
        expect(service.isCurrentOsSupported).toHaveBeenCalledWith(currentOS);
    });

    it('should test getCurrentOS function when its Mac', () => {
        spyOn(service, 'getCurrentOS').and.callThrough();
        spyOnProperty(window.navigator, 'userAgent').and.returnValue(
            'Mac OS X'
        );

        spyOnProperty(window.navigator, 'maxTouchPoints').and.returnValue(0);

        service.getCurrentOS();
        expect(service.getCurrentOS).toHaveBeenCalled();
    });
});

describe('OperatingSystemDetectionService if OS is Linux', () => {
    let service: OperatingSystemDetectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OperatingSystemDetectionService);
    });

    it('should test getCurrentOS function', () => {
        spyOn(service, 'getCurrentOS').and.callThrough();
        spyOnProperty(window.navigator, 'userAgent').and.returnValue('Linux');
        service.getCurrentOS();
        expect(service.getCurrentOS).toHaveBeenCalled();
    });

    it('should test isCurrentOsSupported function', () => {
        const currentOS = 'Linux';

        spyOn(service, 'isCurrentOsSupported').and.callThrough();
        service.isCurrentOsSupported(currentOS);
        expect(service.isCurrentOsSupported).toHaveBeenCalledWith(currentOS);
    });
});

describe('OperatingSystemDetectionService if OS is Unknown OS', () => {
    let service: OperatingSystemDetectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OperatingSystemDetectionService);
    });

    it('should test getCurrentOS function', () => {
        spyOn(service, 'getCurrentOS').and.callThrough();
        spyOnProperty(window.navigator, 'userAgent').and.returnValue('');
        service.getCurrentOS();
        expect(service.getCurrentOS).toHaveBeenCalled();
    });

    it('should test isCurrentOsSupported function', () => {
        const currentOS = 'Unknown OS';

        spyOn(service, 'isCurrentOsSupported').and.callThrough();
        service.isCurrentOsSupported(currentOS);
        expect(service.isCurrentOsSupported).toHaveBeenCalledWith(currentOS);
    });
});
