import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.less']
})
export class ConfirmationComponent implements OnInit {

  //Change this up if you wanna
  reqBody = {
    doctorName: '',
    doctorAddress: '',
    patientName: '',
    patientAddress: '',
    patientAge: '',
    patientSex: '',
    datePrescribed: '',
    drugName: '',
    drugAmount: '',
    refills: ''
  };

  url: string = 'http://eaf6f417.ngrok.io';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //TODO: NGROK @abhinav
    this.http.get(this.url + '/api/Prescription').subscribe((val) => {
      let res = val[Object.keys(val).length - 1];
      console.log(res);
      this.reqBody = {
        doctorName: res.doctor.name,
        doctorAddress: res.doctor.address,
        patientName: res.patient.name,
        patientAddress: res.patient.address,
        patientAge: res.patient.age,
        patientSex: res.patient.sex,
        datePrescribed: res.dateWritten,
        drugName: res.drug,
        drugAmount: res.amount,
        refills: res.refills
      };
    });
  }

}
