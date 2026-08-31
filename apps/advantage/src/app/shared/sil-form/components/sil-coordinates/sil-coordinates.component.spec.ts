import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockComponent } from 'ng-mocks';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    InjectionToken,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { FieldTypeConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { SilFormCoordinatesComponent } from './sil-coordinates.component';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

export const GOOGLE = new InjectionToken('google');
export const googleFactory = () => google;

class MockSize {
    width: number;
    height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
    equals(other: MockSize | null) {
        other === other;
        return false;
    }
}

class MockLatLng {
    latitude: number;
    longitude: number;
    constructor(lat: number, lng: number) {
        this.latitude = lat;
        this.longitude = lng;
    }

    lat() {
        return this.latitude;
    }
    lng() {
        return this.longitude;
    }

    toJSON() {
        const obj = {
            lat: -1.2920659,
            lng: 36.8219462,
        };
        return obj;
    }

    equals(other) {
        return other === true;
    }
    toUrlValue() {
        return '12';
    }

    pixelOffset: MockSize;

    featureData: {
        author: {
            email: 'a@a.com';
            name: 'Jason';
            uri: '12';
        };
        id: '1212';
        name: '1212';
        description: '122';
        infoWindowHtml: '1212';
        snippet: 'latqw12';
    };
}

class MockMarker {
    constructor() {}
    setMap() {}
}

// Mock Google Maps Map class
class MockMap {
    constructor() {
        // Mock implementation
    }
    panTo() {}
}

// Mock Google Maps KmlMouseEvent class
class MockKmlMouseEvent {
    constructor() {
        // Mock implementation
    }
    latLng: MockLatLng;
    pixelOffset: MockSize;
    featureData: {
        author: {
            email: 'a@a.com';
            name: 'Jason';
            uri: '12';
        };
        id: '1212';
        name: '1212';
        description: '122';
        infoWindowHtml: '1212';
        snippet: 'latqw12';
    };
}

// Mock Google Maps Geocoder class
class MockGeocoder {
    geocode(_request: any, callback: (results: any[], status: string) => void) {
        // Mock implementation
        const mockResults = [{ geometry: { location: new MockLatLng(0, 0) } }];
        callback(mockResults, 'OK');
    }
}
class MockGoogleMaps {
    static MapTypeId = {
        ROADMAP: 'roadmap',
    };
    static Animation = {
        DROP: 1.0,
    };
    static LatLng = MockLatLng;
    static Map = MockMap;
    static KmlMouseEvt = MockKmlMouseEvent;
    static Marker = MockMarker;
    static Geocoder = MockGeocoder;
    MapOptions: any = {
        mapTypeId: MockGoogleMaps.MapTypeId.ROADMAP,
        zoomControl: true,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        maxZoom: 20,
        minZoom: 4,
    };
    target: any = {
        addListener: () => {},
    };
}

describe('SilFormCoordinatesComponent', () => {
    let component: SilFormCoordinatesComponent;
    let fixture: ComponentFixture<SilFormCoordinatesComponent>;
    let mockField: FieldTypeConfig;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SilFormCoordinatesComponent,
                MockComponent(GoogleMap),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [GoogleMapsModule],
            providers: [
                { provide: GOOGLE, useValue: googleFactory },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        (window as any).google = {
            maps: MockGoogleMaps,
        };
        fixture = TestBed.createComponent(SilFormCoordinatesComponent);
        component = fixture.componentInstance;
        mockField = {
            key: 'item',
            props: {
                addFile: () => {},
                fileEvent: () => {},
            },
            id: '12',
            form: new FormGroup({
                latitude: new FormControl('latitude'),
                longitude: new FormControl('longitude'),
            }),
            options: {},
            formControl: new FormControl('coordinates'),
        };
        spyOnProperty(component, 'props', 'get').and.returnValue({
            attributes: {},
            buttons: [],
            addMarker: () => {},
            latLngKeys: {
                lat: 'latitude',
                lng: 'longitude',
            },
        });
        spyOnProperty(component, 'model', 'get').and.returnValue({
            latitude: 1232,
            longitude: 123,
        });
        component.field = mockField;
        fixture.detectChanges();
        spyOn(component.map as any, 'panTo');
    });

    it('should create', fakeAsync(() => {
        const position = {
            coords: {
                latitude: 123,
                longitude: 12312,
                altitude: 1221,
                accuracy: 12,
                altitudeAccuracy: 123,
                heading: 12,
                speed: 12,
            },
            timestamp: 123213,
        } as GeolocationPosition;
        spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
            successCallback => {
                successCallback(position);
            }
        );
        spyOn(component.infoWindow as any, 'open');
        component.ngAfterViewInit();
        tick(100);
        component.isWorking;
        component.findAddress();
        component.address = '';
        component.findAddress();
        component.address = 'amsterdam';
        component.findAddress();
        component.getCurrentLocation();
        component.onMapDragEnd({ latLng: { lat: () => 122, lng: () => 122 } });
        component.updateMarker({ latLng: { lat: () => 122, lng: () => 122 } });
        component.openInfoWindow({});
        component.errorFromMarkerFromAddress({});
        const responseError = {
            status: 'NOT OK',
            error_message: 'Error',
            results: undefined,
        };
        component.setMarkerFromAddress(responseError);
        const response = {
            status: 'OK',
            error_message: 'Error',
            results: [{ geometry: { location: '12' } }],
        };
        component.setMarkerFromAddress(response);
        component.setPoint(12, 21);
        tick(500);
        expect(component).toBeTruthy();
    }));
    it('should mock successful geolocation', fakeAsync(() => {
        const mockPosition = {
            coords: {
                latitude: 40.7128,
                longitude: -74.006,
                accuracy: 1,
                altitude: 2,
                altitudeAccuracy: 1,
                heading: 1,
                speed: 1,
            },
            timestamp: 123123123,
        } as GeolocationPosition;
        component.ngAfterViewInit();
        tick(100);
        spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
            successCallback => {
                successCallback(mockPosition);
            }
        );
        component.getCurrentLocation();
        expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    }));

    it('should handle geolocation error', () => {
        const mockError: GeolocationPositionError = {
            code: 999,
            message: 'Unknown error',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
        };
        spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
            (successCallback, errorCallback) => {
                errorCallback(mockError);
            }
        );
        component.getCurrentLocation();
        expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    });
});

describe('SilFormCoordinatesComponent: model', () => {
    let component: SilFormCoordinatesComponent;
    let fixture: ComponentFixture<SilFormCoordinatesComponent>;
    let mockField: FieldTypeConfig;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SilFormCoordinatesComponent,
                MockComponent(GoogleMap),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [GoogleMapsModule],
            providers: [
                { provide: GOOGLE, useValue: googleFactory },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
        (window as any).google = {
            maps: MockGoogleMaps,
        };
        fixture = TestBed.createComponent(SilFormCoordinatesComponent);
        component = fixture.componentInstance;
        mockField = {
            key: 'item',
            props: {
                addFile: () => {},
                fileEvent: () => {},
            },
            id: '12',
            form: new FormGroup({
                latitude: new FormControl('latitude'),
                longitude: new FormControl('longitude'),
            }),
            options: {},
            formControl: new FormControl('coordinates'),
        };
        spyOnProperty(component, 'props', 'get').and.returnValue({
            attributes: {},
            buttons: [],
            addMarker: () => {},
            latLngKeys: {
                lat: 'latitude',
                lng: 'longitude',
            },
        });
        spyOnProperty(component, 'model', 'get').and.returnValue({
            coordinates: {
                lat: 1232,
                lng: 123,
            },
        });
        component.field = mockField;
        fixture.detectChanges();
        spyOn(component.map as any, 'panTo');
    });

    it('set model with coordinates', fakeAsync(() => {
        component.ngAfterViewInit();
        tick(100);
        expect(component.geolocationWorking).toBe(false);
    }));

    it('should mock getLocation', fakeAsync(() => {
        spyOn(component, 'getLocation').and.returnValue(
            of({
                status: 'OK',
                error_message: 'Oh no',
                results: [
                    {
                        geometry: { location: '12' },
                        address_components: {
                            long_name: 'adafas',
                            short_name: 'asdf',
                            types: ['ts'],
                        },
                        formatted_address: '123123',
                        place_id: '12312',
                        types: ['ts'],
                    },
                ],
            })
        );
        component.geolocationWorking = true;
        const isWorking = component.isWorking;
        expect(isWorking).toEqual(false);
        component.findAddress();
        expect(component.geolocationWorking).toBe(true);
    }));

    it('should mock getLocation not OKAY', fakeAsync(() => {
        spyOn(component, 'getLocation').and.returnValue(
            of({
                status: 'Not OK',
                error_message: 'Oh no',
                results: [
                    {
                        geometry: { location: '12' },
                        address_components: {
                            long_name: 'adafas',
                            short_name: 'asdf',
                            types: ['ts'],
                        },
                        formatted_address: '123123',
                        place_id: '12312',
                        types: ['ts'],
                    },
                ],
            })
        );
        component.geolocationWorking = true;
        const isWorking = component.isWorking;
        expect(isWorking).toEqual(false);
        component.findAddress();
        expect(component.geolocationWorking).toBe(true);
    }));
});
