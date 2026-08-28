import { HttpClient } from '@angular/common/http';
import {
    Component,
    Output,
    EventEmitter,
    ViewChild,
    AfterViewInit,
} from '@angular/core';
import { GeocoderResponse } from './geocoder-response.model';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { environment } from '../../../../../environments/environment';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in the component template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'sil-form-coordinates',
    templateUrl: './sil-coordinates.component.html',
    styleUrls: ['./sil-coordinates.component.scss'],
    standalone: false,
})
/**
 * Constructor for the coordinates and map component
 */
export class SilFormCoordinatesComponent
    extends FieldType<FieldTypeConfig>
    implements AfterViewInit
{
    /**
     * Contains the coordinates from google maps api
     */
    @Output() display;

    /**
     * Contains the coordinates from google maps api
     */
    @Output() latLong = new EventEmitter();

    /**
     * Sets the center part of the map
     */
    public center: google.maps.LatLngLiteral;

    /**
     * Contains latitude model reference
     */
    public latitude: string;

    /**
     * Contains longitude model reference
     */
    public longitude: string;

    /**
     * Sets the marker positions
     */
    public markerPositions: google.maps.LatLngLiteral[];

    /**
     * Sets the level of zoom on the map
     */
    public zoom;

    /**
     * Boolean used to indicate if geo location is working
     */
    public geolocationWorking: boolean = false;

    /**
     * Boolean used to indicate if geocoder is working
     */
    public geocoderWorking: boolean = false;

    /**
     * Object containing lat and lng object
     */
    locationCoords: google.maps.LatLng;

    /**
     * Coordinates used by the pin
     */
    mapCenter: google.maps.LatLng;

    /**
     * Location address
     */
    address: string;

    /**
     * Formatted Location address
     */
    formattedAddress: string;

    /**
     * Checks if response has been loaded
     */
    loading: boolean = false;

    /**
     * Contains selector that is used to access the Google map component
     * used in the component
     */
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

    /**
     * Contains selector that is used to access the Google map info window component
     * used in the component
     */
    @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;

    /**
     * Parmater used to define how zoomed the map is
     */
    mapZoom = 15;

    /**
     * Sets google maps options
     */
    mapOptions: google.maps.MapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        maxZoom: 20,
        minZoom: 4,
    };

    /**
     * Address content used to display the label
     */
    markerInfoContent = '';

    /**
     * Sets the marker options as defined in the google maps api
     */
    markerOptions: google.maps.MarkerOptions = {
        draggable: false,
        animation: google.maps.Animation.DROP,
    };

    /**
     * The component constructor
     * @param http Initilizes a http client to send request to google maps api
     */
    constructor(private http: HttpClient) {
        super();
    }

    /** Hook after component view is drawn */
    ngAfterViewInit() {
        let lat, lng;
        this.zoom = 9;
        this.markerOptions = {
            draggable: true,
            animation: google.maps.Animation.DROP,
        };

        const point: google.maps.LatLngLiteral = {
            lat: -1.2920659,
            lng: 36.8219462,
        };

        setTimeout(() => {
            // default to Nairobi coordinates
            this.locationCoords = new google.maps.LatLng(point);
            this.props?.addMarker(this.locationCoords.toJSON());
            if (this.model['coordinates']) {
                lat = this.model['coordinates']['lat'];
                lng = this.model['coordinates']['lng'];
                this.setPoint(lat, lng);
            } else if (this.model['latitude']) {
                lat = this.model['latitude'];
                lng = this.model['longitude'];
                this.setPoint(lat, lng);
            }
            this.latitude = this.props?.latLngKeys?.lat;
            this.longitude = this.props?.latLngKeys?.lng;
            this.markerPositions = [];
        });
    }

    /**
     * Used to set point on the map
     * @param lat the latitude coordinate
     * @param lng the longitude coordinate
     */
    setPoint(lat, lng) {
        const point: google.maps.LatLngLiteral = {
            lat: lat,
            lng: lng,
        };
        this.mapCenter = new google.maps.LatLng(point);
        this.getLocationByPoint(point);
    }

    /**
     * Getter used to check if geo locater is working
     * @returns boolean indicating if geo locater is working
     */
    get isWorking(): boolean {
        return this.geolocationWorking && this.geocoderWorking;
    }

    /**
     * Function that initializes the maps info window
     * @param marker component used to render the Maps Marker
     */
    openInfoWindow(marker) {
        this.infoWindow.open(marker);
    }

    /**
     * Adds marker on the map after event
     * @param event maps element event
     */
    updateMarker(event) {
        const point: google.maps.LatLngLiteral = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        this.geocoderWorking = true;
        this.getLocationByPoint(point);
    }

    /**
     * Function which when given coordinates returns details on a location
     * @param location a location coordinates
     * @returns Promise that when resolved returns a response with location details
     */
    geocodeLatLng(
        location: google.maps.LatLngLiteral
    ): Promise<GeocoderResponse> {
        const geocoder = new google.maps.Geocoder();

        return new Promise(resolve => {
            geocoder.geocode({ location: location }, (results, status) => {
                const response = new GeocoderResponse(status, results);
                resolve(response);
            });
        });
    }

    /**
     * Function used to get location when user clicks on a map
     * @param point coordinates object
     */
    getLocationByPoint(point) {
        /**
         * geocodeLatLng abstract method used in several methods
         */
        this.geocodeLatLng(point).then((response: GeocoderResponse) => {
            if (response.status === 'OK' && response.results?.length) {
                const value = response.results[0];

                this.locationCoords = new google.maps.LatLng(point);
                this.props?.addMarker(this.locationCoords.toJSON());
                this.field?.form?.controls[this.latitude]?.setValue(
                    this.locationCoords.toJSON().lat.toFixed(16)
                );
                this.field?.form?.controls[this.longitude]?.setValue(
                    this.locationCoords.toJSON().lng.toFixed(16)
                );
                this.field?.form?.controls[this.latitude]?.markAsTouched();
                this.field?.form?.controls[this.longitude]?.markAsTouched();
                this.mapCenter = new google.maps.LatLng(point);
                this.map.panTo(point);

                this.address = value.formatted_address;
                this.formattedAddress = value.formatted_address;
                this.markerInfoContent = value.formatted_address;

                this.markerOptions = {
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                };

                this.loading = false;
            }
        });
    }

    /**
     * Function used to search for a location's details and
     * return a location estimate closest to the searched term/city/town
     */
    findAddress() {
        if (!this.address || this.address.length === 0) {
            return;
        }

        this.geocoderWorking = true;
        this.getLocation(this.address).subscribe({
            next: this.setMarkerFromAddress,
            error: this.errorFromMarkerFromAddress,
        });
    }

    /** Handles response from the search feature */
    setMarkerFromAddress = response => {
        this.geocoderWorking = false;
        if (response.status === 'OK' && response.results?.length) {
            const location = response.results[0];
            const loc: any = location.geometry.location;

            this.locationCoords = new google.maps.LatLng(loc.lat, loc.lng);
            this.props?.addMarker(this.locationCoords.toJSON());
            this.field?.form?.controls[this.latitude]?.setValue(
                this.locationCoords.toJSON().lat.toFixed(16)
            );
            this.field?.form?.controls[this.longitude]?.setValue(
                this.locationCoords.toJSON().lng.toFixed(16)
            );
            this.field?.form?.controls[this.latitude]?.markAsTouched();
            this.field?.form?.controls[this.longitude]?.markAsTouched();
            this.mapCenter = location.geometry.location;

            setTimeout(() => {
                if (this.map !== undefined) {
                    this.map.panTo(location.geometry.location);
                }
            }, 500);

            this.address = location.formatted_address;
            this.formattedAddress = location.formatted_address;
            this.markerInfoContent = location.formatted_address;

            this.markerOptions = {
                draggable: true,
                animation: google.maps.Animation.DROP,
            };
        } else {
            console.error(response.error_message, response.status);
        }
    };

    /** Handles error from the search feature */
    errorFromMarkerFromAddress = err => {
        this.geocoderWorking = false;
        console.error('geocoder error', err);
    };

    /**
     * Function used to update the coordinates when marker is dragged
     * @param event maps drag event
     */
    onMapDragEnd(event) {
        const point: google.maps.LatLngLiteral = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };

        this.geocoderWorking = true;
        this.getLocationByPoint(point);
    }

    /**
     * Function used to make the api call to google maps api
     * @param term the town/city/region searched
     * @returns response from google maps api
     */
    getLocation(term: string) {
        const url = `https://maps.google.com/maps/api/geocode/json?address=${term}&sensor=false&key=${environment.googleMapsApiKey}`;
        return this.http.get<any>(url);
    }

    /**
     * Function used to get current location using inbuilt device location feature
     */
    getCurrentLocation() {
        this.geolocationWorking = true;
        this.loading = true;
        navigator.geolocation.getCurrentPosition(
            position => {
                this.geolocationWorking = false;

                const point: google.maps.LatLngLiteral = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                this.geocoderWorking = true;
                this.getLocationByPoint(point);
            },
            error => {
                this.geolocationWorking = false;
                this.loading = false;
                console.error(error.message, `Error: ${error.code}`);
            },
            { enableHighAccuracy: true }
        );
    }
}
