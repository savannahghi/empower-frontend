import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';

/**
 * GeocodingService class.
 * https://developers.google.com/maps/documentation/javascript/
 */
// google: any;
@Injectable()
export class GeocodingService {
    geocoder: google.maps.Geocoder;

    constructor() {
        this.geocoder = new google.maps.Geocoder();
    }
    /**
     * Reverse geocoding by location.
     *
     * Wraps the Google Maps API geocoding service into an observable.
     *
     * @param latLng Location
     * @return An observable of GeocoderResult
     */
    geocode(latLng: any): Observable<google.maps.GeocoderResult[]> {
        const obj = { lat: latLng[0], lng: latLng[1] };
        return Observable.create(
            (observer: Observer<google.maps.GeocoderResult[]>) => {
                // Invokes geocodes method of Google Maps API geocoding
                this.geocoder.geocode(
                    { location: obj },
                    (
                        results: google.maps.GeocoderResult[],
                        status: google.maps.GeocoderStatus
                    ) => {
                        if (status === google.maps.GeocoderStatus.OK) {
                            observer.next(results);
                            observer.complete();
                        } else {
                            observer.error(status);
                        }
                    }
                );
            }
        );
    }
}
