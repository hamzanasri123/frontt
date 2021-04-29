import { AfterViewInit, OnInit, Component, Input, Output, EventEmitter } from "@angular/core";
import * as L from "leaflet";
import { icon, Marker } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { Coords, Post } from 'src/app/interfaces/posts.interface';
import { Options, LabelType } from 'ng5-slider';
import { PostService } from "src/app/services/post.service";
import { EquipmentService } from "src/app/services/equipment.service";
import { EventService } from "src/app/services/event.service";
import { Hebergement } from "src/app/interfaces/equipments.interface";
import { Event } from "src/app/interfaces/event.interface";

declare var initContent, initSidebar: any;

declare var $: any;

const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
const homeIconUrl = 'assets/leaflet/home-icon.png';
const eventIconUrl = 'assets/leaflet/event-icon.png';
const iconUrl = 'assets/leaflet/position-icon.png';
const shadowUrl = 'assets/leaflet/marker-shadow.png';
const postUrl = 'assets/leaflet/post-icon.png'
const iconDefault = icon({
  iconUrl,
  shadowUrl: shadowUrl,
  iconSize: [35, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

var postIcon = L.icon({
  iconUrl: postUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

var homeIcon = L.icon({
  iconUrl: homeIconUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

var eventIcon = L.icon({
  iconUrl: eventIconUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;
@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements AfterViewInit {
  private map;
  constructor(private postService: PostService,
    private equipmentService: EquipmentService,
    private eventService: EventService,
  ) { }
  position: any;

  posts: Post[];
  homes: Hebergement[];
  events: Event[];
  showFilters = true;
  showPosts = true;
  showEvents = true;
  showHomes = true;

  eventsMarker: Marker[] = [];
  postsMarker: Marker[] = [];
  homesMarker: Marker[] = [];
  currentPositionMarker: Marker;
  circleRadius: number = 20;
  showCircle: false;
  circle: L.Circle;
  options: Options = {
    floor: 0,
    ceil: 500,
    translate: (value: number, label: LabelType): string => {
      return value + ' Km'
    }
  };

  async ngAfterViewInit() {
    initContent();
    initSidebar();
    this.position = await this.getCurrentPosition();
    this.initMap(this.position);
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 25,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }
    );
    tiles.addTo(this.map);
    const provider = new OpenStreetMapProvider();
    this.currentPositionMarker = L.marker(this.position, {
      draggable: true,
      icon: iconDefault
    });
    this.currentPositionMarker.addTo(this.map).bindPopup('My current position');
    this.circle = L.circle(this.position, {
      color: 'blue',
      fillColor: '#686868',
      fillOpacity: 0.3,
      radius: this.circleRadius * 1000,
    });
    if (this.showCircle) {
      this.circle.addTo(this.map);
    }
    this.currentPositionMarker.on('dragend', (event) => {
      this.currentPositionMarker = event.target;
      this.circle.setLatLng(this.currentPositionMarker.getLatLng());
      this.toggleEvents();
      this.toggleHomes();
      this.togglePosts();
      if (this.showCircle) {
        this.updateCircle();
      }
      this.map.panTo(this.currentPositionMarker.getLatLng());
    });
    this.equipmentService.getHebergements().subscribe(
      (res) => {
        this.homes = res.data;
        let i = 0;
        this.homes.forEach(hebergement => {
          if (!hebergement.position) return;
          this.homesMarker.push(L.marker(hebergement.position.coordinates, {
            icon: homeIcon,
            draggable: false,
            autoPan: true
          }).bindPopup(`<h1>${hebergement.name}</h1> by <a target="_blank" href="/profile/${hebergement?.owner?.slug}">
                      ${hebergement?.owner?.fullName}</a>`));
          this.homesMarker[i].addTo(this.map);
          i++
        });
      },
      error => console.log(error)
    );

    this.eventService.getAll().subscribe(
      res => {
        this.events = res.data;
        console.log(this.events)
        let i = 0;
        this.events.forEach(event => {
          if (!event.position) return;
          this.eventsMarker.push(L.marker(event.position.coordinates, {
            icon: eventIcon,
            draggable: false,
            autoPan: true
          }).bindPopup(`<a target="_blank" href="/events"> ${event.name}</a>`));
          this.eventsMarker[i].addTo(this.map);
          i++;
        });
      },
      error => console.log(error)

    )

  }

  private initMap(position): void {
    this.map = L.map("map", {
      center: [position.lat, position.lng],
      zoom: 9
    });
  }

  getCurrentPosition(): Promise<any> {
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

  toggleFilter() {
    this.showFilters = !this.showFilters;
    $("#popup").toggleClass("reduced");
  }

  togglePosts() {
    if (this.showPosts) {
      this.postsMarker.forEach(marker => marker.addTo(this.map));
    } else {
      this.postsMarker.forEach(marker => this.map.removeLayer(marker));
    }
  }
  toggleEvents() {
    if (this.showEvents) {
      this.eventsMarker.forEach(marker => marker.addTo(this.map));
    } else {
      this.eventsMarker.forEach(marker => this.map.removeLayer(marker));
    }
  }
  toggleHomes() {
    if (this.showHomes) {
      this.homesMarker.forEach(marker => {
        console.log(marker.getLatLng());
        marker.addTo(this.map)
      });
    } else {
      this.homesMarker.forEach(marker => this.map.removeLayer(marker));
    }
  }

  updateCircle() {
    this.eventsMarker.forEach(marker => this.map.removeLayer(marker));
    this.homesMarker.forEach(marker => this.map.removeLayer(marker));
    this.postsMarker.forEach(marker => this.map.removeLayer(marker));

    this.circle.setRadius(this.circleRadius * 1000);
    if (this.showPosts) {
      this.postsMarker.forEach(
        marker => {
          let distance = this.getDistanceFromLatLonInKm(this.currentPositionMarker, marker);
          if (distance <= this.circleRadius) {
            marker.addTo(this.map)
          }
        });
    }
    if (this.showEvents) {
      this.eventsMarker.forEach(
        marker => {
          let distance = this.getDistanceFromLatLonInKm(this.currentPositionMarker, marker);
          if (distance <= this.circleRadius) {
            marker.addTo(this.map)
          }
        });
    }
    if (this.showHomes) {
      this.homesMarker.forEach(
        marker => {
          let distance = this.getDistanceFromLatLonInKm(this.currentPositionMarker, marker);
          if (distance <= this.circleRadius) {
            marker.addTo(this.map)
          }
        });
    }
  }

  getDistanceFromLatLonInKm(A: Marker, B: Marker) {

    let lat1 = A.getLatLng().lat,
      lon1 = A.getLatLng().lng,
      lat2 = B.getLatLng().lat,
      lon2 = B.getLatLng().lng;
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // this.deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  toggleCircle() {
    if (this.showCircle) {
      this.circle.addTo(this.map);
      this.updateCircle();
      return;
    }
    this.map.removeLayer(this.circle);
    this.toggleEvents();
    this.toggleHomes();
    this.togglePosts();
  }
}
