import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})

export class MapComponent implements OnInit {
  lat: number = 0;
  lng: number = 0;
  zoom: number = 14;
  url: string = 'http://ae1112f9.ngrok.io';

  riskZones = [
    // {lat: 43.663470 + 0.0025, lng: -79.419980 - 0.003}, //Christie Pits Park
    // {lat: 43.648400 + 0.0025, lng: -79.397310 - 0.003}, //Grafitti Alley
    {lat: 43.664456 + 0.0025, lng: -79.390442 - 0.003}, //UofT
    {lat: 43.655640 + 0.0025, lng: -79.386800 - 0.003} //Younge-Dundas
  ];

  safeZones = [];

  infoWindow: any;
  service: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {

  }

  mapReady(map: any) {
    let self = this;
    let x = 0;
    let y = 0;
    //TODO: NGROK
    this.http.get(this.url + '/api/OverdoseReport').subscribe((val) => {
      console.log("POST call successful value returned in body", val);
      for (let i = 0; i < Object.keys(val).length; i++ ) {
        this.riskZones.push({
          'lat': parseFloat(val[i]['lat']),
          'lng': parseFloat(val[i]['lng'])
        });
        console.log("VAL:", val[i]);
      }
      console.log("Risk Zones:", this.riskZones);
      for (let i = 0; i < this.riskZones.length; i++) {
        x += this.riskZones[i]['lat'];
        y += this.riskZones[i]['lng'];
      }
      this.safeZones.push({
        'lat': x/this.riskZones.length,
        'lng' : y/this.riskZones.length
      });

      this.infoWindow = new google.maps.InfoWindow();

      this.infoWindow.setPosition({
        lat: this.lat,
        lng: this.lng
      });
      this.infoWindow.setContent(
        "<span class='font-italic'>[You are here]</span><br><span><span class='font-weight-bold'>Orange</span> - Incidents</span><br><span class='font-weight-bold'>Blue</span> - Relief Centre</span></div>"
      );
      this.infoWindow.open(map);

      this.service = new google.maps.places.PlacesService(map);

      //Search for parks
      this.service.nearbySearch({
        location: {
          lat: this.safeZones[0]['lat'],
          lng: this.safeZones[0]['lng']
        },
        radius: 1000,
        type: 'park'
      }, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          let index = 0;
          let minLat = Math.abs(self.safeZones[0].lat - results[0].geometry.location.lat()) ;
          let minLng = Math.abs(self.safeZones[0].lng - results[0].geometry.location.lng());
          for (let i = 0; i < results.length; i++) {
            let lat = Math.abs(self.safeZones[0].lat - results[i].geometry.location.lat());
            let lng = Math.abs(self.safeZones[0].lng - results[i].geometry.location.lng());
            if ((minLat + minLng) > (lat + lng)) {
              minLat = lat;
              minLng = lng;
              index = i;
            }
          }
          self.safeZones[0].lat = results[index].geometry.location.lat() + 0.0025;
          self.safeZones[0].lng = results[index].geometry.location.lng() - 0.003;
          createMarker(results[index]);
        }
      });

      //Search for pharmacies
      this.service.nearbySearch({
        location: {
          lat: this.lat,
          lng: this.lng
        },
        radius: 2000,
        type: 'doctor'
      }, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      });

      function createMarker(loc) {
        let marker = new google.maps.Marker({
          map: map,
          position: loc.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function () {
          self.infoWindow.setContent('<div><strong>' + loc.name + '</strong><br>' +
            'Located at ' + loc.vicinity
            + '</div>');
          self.infoWindow.open(map, this);
        });
      }
    });
  }

  setPosition(event = undefined) {
    let self = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;
        self.mapReady(event);
      });
    }
  }
}
