'use strict'

//Body parser for req-body
let bodyParser = require('body-parser');

// Express routing
const express = require('express');
let request = require('request');
let http = require('http');
let app = express();
let apiKey = "AIzaSyBuBIYaXJxNOzqeIgXNkJZu0e9GZmQZQeA";

const cors = require('cors')

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(bodyParser.json({
  limit: '10mb'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));

// app.use(bodyParser({
//   limit: '10mb'
// }));




const server = app.listen(9001, () => {
  console.log(`Server running at port PORT ${server.address().port}`);
});


app.get('/', (req, res) => {
  res.send("Landing Page");
});



app.post('/submitPrescription', function (req, res) { //req from angular front end

  function apiCall() {
    return new Promise((resolve, reject) => {
      let img = req.body.prescriptionImg;
      console.log('https://vision.googleapis.com/v1/images:annotate?key=' + apiKey);

      let options = {
        method: 'POST',
        url: 'https://vision.googleapis.com/v1/images:annotate',
        qs: {
          key: apiKey
        },
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json'
        },
        body: {
          requests: [{
            image: {
              content: '' + img
            },
            features: [{
              type: 'DOCUMENT_TEXT_DETECTION'
            }]
          }]
        },
        json: true
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        //console.log("POST REQUEST OCR SUCCESSFUL:");
        console.log(body['responses'][0]['textAnnotations']);
        resolve(body['responses'][0]['textAnnotations'][0]['description']);
      });

    });
  }

  apiCall().then((data) => {
    console.log(data);
    console.log(typeof data);
    let resp = data.split("\n");
    console.log("PARSING");
    for (let i = 0; i < resp.length; i++) {
      resp[i] = resp[i].split(": ");
      console.log(i, resp[i]);
    }
    
    return resp;
  }).then((resp) => {
    return getAllPrescriptions().then((data) => {
      console.log("PRES: ", data);
      console.log(data.length);
      let prescription = {
        "prescriptionId": "" + (data.length+1),
        "patient": '{'+ resp[3][1] +'}',
        "doctor": '{'+ resp[1][1] +'}',
        "pharmacy": '{1}',
        "drug": resp[8][1],
        "amount": parseInt((resp[9][1]).match(/\d+/)) ,
        "refills": resp[10][1] === 'none' ? 0 : parseInt(resp[10][1]),
        "dateWritten": resp[7][1] ,
        "dateIssued": "string",
        "refillable": resp[9][1] === "none" ? false : true,
        "doctorRecommendations": "None",
        "fulfilled": true
      };
      return prescription;
    }).then((data) => {
      console.log("PARSED PRESCRIPTION OBJ:", data);
      return storePrescription(data);
    });

  });

});

function getAllPrescriptions() {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: 'http://localhost:3000/api/Prescription',

    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(JSON.parse(body));
      resolve(JSON.parse(body));
    });
  });
}

function getDoctor(name) {
  name = name.split(" ");
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: 'http://localhost:3000/api/Doctor',
      qs: {
        filter: '%7B%22firstName%22%3A%20%22' + name[0] + '%22%2C%20%22lastName%22%3A%20%22'+ name[1] +'%22%7D'
      },
      headers: {
        'cache-control': 'no-cache',
        Accept: 'application/json'
      }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });
  });
}

function storePrescription(data) {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'POST',
      url: 'http://localhost:3000/api/Prescription',
      headers: {
        'cache-control': 'no-cache',
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: data,
      json: true
    };
    console.log("STORING PRESCRIPTION:", data);
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
      resolve(body);
    });
  });
}
