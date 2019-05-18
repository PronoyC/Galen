import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.less']
})
export class ConfirmationComponent implements OnInit {

  //Change this up if you wanna
  reqBody = {
    doctorName: 'Dev Patel',
    doctorAddress: '8 Adelaide St W Toronto',
    patientName: 'Mindy Sharpe',
    patientAddress: '12 Adelaide St Toronto',
    patientAge: '30',
    patientSex: 'F',
    datePrescribed: '16-02-2019',
    drugName: 'Amphetamins',
    drugAmount: '500mg',
    refills: 'None'
  };

  constructor() { }

  ngOnInit() {
  }

}
