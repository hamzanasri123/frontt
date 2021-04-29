import { AfterViewInit, Component, Input, Output, EventEmitter } from "@angular/core";
import * as L from "leaflet";
import { icon, Marker } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { Coords } from 'src/app/interfaces/posts.interface';

const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
const iconUrl = 'assets/leaflet/marker-icon.png';
const shadowUrl = 'assets/leaflet/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;
@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements AfterViewInit {

  private map;
  @Input() position: Coords
  @Output() positionChange: EventEmitter<Coords> = new EventEmitter<Coords>();

  @Input()
  draggable: boolean = true;
  mapId = Math.random();

  constructor() { }

  async ngAfterViewInit() {
    if (this.map != undefined) this.map.remove();
    if (!this.position || !this.position.hasOwnProperty('lat') || !this.position.hasOwnProperty('lng')) {
      this.position = await this.getPosition();
    }
    this.positionChange.emit(this.position);
    this.initMap(this.position);
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }
    );
    tiles.addTo(this.map);
    let positionMarker = L.marker(this.position, {
      draggable: this.draggable,
      autoPan: true
    }).addTo(this.map);
    positionMarker.on('dragend', () => {
      this.position = positionMarker.getLatLng();
      this.positionChange.emit(this.position);
    });
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      marker: positionMarker.options,
      popupFormat: ({ query, result }) => {
        positionMarker.setLatLng({ lat: Number(result.y), lng: Number(result.x) })
        this.positionChange.emit(positionMarker.getLatLng());
        return result.label;
      },
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      searchLabel: 'Where were you?',
      keepResult: false
    });
    this.map.on('geosearch_showlocation', (result) => {
      positionMarker.setLatLng(result);
    });
    this.map.addControl(searchControl);
  }

  private initMap(position): void {
    this.map = L.map(`map-${this.mapId}`, {
      center: [position.lat, position.lng],
      zoom: 8
    });
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resp => {
          resolve({ lat: resp.coords.latitude, lng: resp.coords.longitude });
        },
        err => {
          resolve({ lat: 36.7647398, lng: 10.248745399999999 });
        }
      );
    });
  }
}
