import {Component,OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

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
    sex: ''
  }
  

  constructor(private http: HttpClient) {}

  ngOnInit() {

  }

  submitReport() {
    console.log("REPORT INFO: "+this.reqBody);


    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/OverdoseReport', this.reqBody, httpOptions).subscribe((val) => {
        console.log("POST call successful value returned in body", val);
        resolve(val);
      });
    });


  }

}
