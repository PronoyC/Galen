import {Component,OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
const apiKey='AIzaSyC9ieYUxxb1a6qEfytJWGJVfr_EfDScyNY';
const geoCodeAPI='https://maps.googleapis.com/maps/api/geocode/json?key=';

const httpOptions = {
  headers: new HttpHeaders({
    'cache-control': 'no-cache',
    Accept: 'application/json',
    'Content-Type': 'application/json'
  })
};

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit {
  reqBody = {
    reportID: '',
    name: '',
    location: '',
    age: '',
    sex: '',
    lat: 'none',
    lng: 'none'
  };

  url: string = 'http://ae1112f9.ngrok.io';
  
  constructor(private http: HttpClient) {}

  ngOnInit() {

  }

  submitReport() {
    console.log("REPORT INFO: " + this.reqBody);


    this.getLatLng().then(()=>{
      console.log("REQBODY:", this.reqBody);
     this.submit();
    });


  }

  getLatLng(){
    let req = geoCodeAPI + apiKey + '&address=' + this.reqBody.location; 
    return new Promise((resolve, reject) => {
      this.http.get(req).subscribe((val) => {
        console.log("GET call successful value returned in body", val['results'][0]['formatted_address']);
        console.log("lat long", val['results'][0]['geometry']['location']);
        this.reqBody.lat = val['results'][0]['geometry']['location']['lat'];
        this.reqBody.lng = val['results'][0]['geometry']['location']['lng'];
        resolve(val);
      });
    });
  }

  submit(){
    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/api/OverdoseReport', this.reqBody, httpOptions).subscribe((val) => {
        console.log("POST call successful value returned in body", val);
        resolve(val);
      });
    });
  }

}
