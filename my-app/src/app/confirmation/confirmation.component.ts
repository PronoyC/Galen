import {
  Component,
  OnInit
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';

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
    drugAmount: 0,
    refills: 0
  };
  docName = [];
  patName = [];

  //url: string = "http://ae1112f9.ngrok.io"; // NGROK for REST API

  constructor(private http: HttpClient) {}

  ngOnInit() {
    let self = this;
    let info = {
      doctorName: "",
      doctorAddress: "",
      patientName: "",
      patientAddress: "",
      patientAge: "",
      patientSex: "",
      datePrescribed: "",
      drugName: "",
      drugAmount: 0,
      refills: 0
    };

    this.getPrescription().then(function(){
       self.getDoctorInfo().then(function(){
         self.getPatientInfo().then(function(){     
        });    
      });
    });




    // return Promise.all([getPrescription, getDoctorInfo, getPatientInfo]).then(() => {
    //   console.log("Success!");
    // });

  }

  getPrescription() {
    return new Promise((resolve, reject) => {
      this.http.get(url + '/api/Prescription').subscribe((val) => {
        let resp = Object.values(val);
        let res = {};
        for (let i = 0; i < resp.length; i++) {
          if (parseInt(resp[i]['prescriptionId']) === resp.length) {
            res = resp[i];
            i = resp.length + 1;
          }
        }
        console.log("Prescription:", res);

        //Set names
        let nameRegex = /7B(\w+)%20(\w+)/;
        this.docName = nameRegex.exec(res['doctor']);
        this.patName = nameRegex.exec(res['patient']);
        let doctor = this.docName[1] + " " + this.docName[2];
        let patient = this.patName[1] + " " + this.patName[2];

        this.reqBody = {
          doctorName: doctor,
          doctorAddress: "",
          patientName: patient,
          patientAddress: "",
          patientAge: "",
          patientSex: "",
          datePrescribed: res['dateWritten'],
          drugName: res['drug'],
          drugAmount: res['amount'],
          refills: res['refills']
        };
        resolve();
      });
    });

  }

  getDoctorInfo() {
    return new Promise((resolve, reject) => {
      this.http.get(url + '/api/Doctor?').subscribe((val) => {
        console.log("Doctors List", val);
        let resp = Object.values(val);
        let res = {};
        console.log(this.docName[1])
        for (let i = 0; i < resp.length; i++) {
          if (resp[i]['firstName'] == this.docName[1]) {
            res = resp[i];
            console.log(res);
            i = resp.length + 1;
          }
        }
        this.reqBody.doctorAddress = res['address'];
        console.log("Doctor Set", this.reqBody);
        resolve();
      });
    });
  }

  getPatientInfo() {
    //Get patient info
    return new Promise((resolve, reject) => {
      console.log(this.reqBody);
      this.http.get(url + '/api/Patient').subscribe((val) => {
        console.log("Patients List", val);
        let resp = Object.values(val);
        let res = {};
        console.log("Patient:", this.patName[1] + " " + this.patName[2]);
        for (let i = 0; i < resp.length; i++) {
          if (resp[i]['fullName'] === (this.patName[1] + " " + this.patName[2])) {
            res = resp[i];
            i = resp.length + 1;
          }
        }

        console.log(res);
        this.reqBody['patientAddress'] = res['address'];
        this.reqBody['patientAge'] = res['age'];
        this.reqBody['patientSex'] = res['sex'];
        resolve();
      });
    });
  }



}
