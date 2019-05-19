import {Component,OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
const url = "http://ae1112f9.ngrok.io"; // NGROK for REST API

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

  //url: string = "http://ae1112f9.ngrok.io"; // NGROK for REST API

  constructor(private http: HttpClient) {}

  ngOnInit() {
    let docName = [];
    let patName = [];
    this.http.get(url + '/api/Prescription').subscribe((val) => {
      let res = val[Object.keys(val).length - 1];
      console.log(res);

      //Set names
      let nameRegex = /7B(\w+)%20(\w+)/;
      docName = nameRegex.exec(res.doctor);
      patName = nameRegex.exec(res['patient']);
      let doctor = docName[1] + " " + docName[2];
      let patient = patName[1] + " " + patName[2];


      this.reqBody = {
        doctorName: doctor,
        doctorAddress: "",
        patientName: patient,
        patientAddress: "",
        patientAge: "",
        patientSex: "",
        datePrescribed: res.dateWritten,
        drugName: res.drug,
        drugAmount: res.amount,
        refills: res.refills
      };
    });

    //Get doctor info
    this.http.get(url + '/api/Doctor', {
      params: {
        firstName: docName[1], 
        lastName: docName[2]
      }
    }).subscribe((val) => {
      let res = val[Object.keys(val).length - 1];
      console.log(res);
      this.reqBody['doctorAddress'] = res['address'];
    });

    //Get patient info
    this.http.get(url + '/api/Patient', {
      params: {
        firstName: patName[1], 
        lastName: patName[2]
      }
    }).subscribe((val) => {
      let res = val[Object.keys(val).length - 1];
      console.log(res);
      this.reqBody['patientAddress'] = res['address'];
      this.reqBody['patientAge'] = res['age'];
      this.reqBody['patientSex'] = res['sex'];
    });

  }

}
