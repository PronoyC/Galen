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
  //console.log(req.body.prescriptionImg);
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
        console.log("POST REQUEST OCR SUCCESSFUL:");
        resolve(body['responses'][0]['textAnnotations'][0]['description']);
      });

    });
  }
  apiCall().then((data)=>{
    console.log(data);
    console.log(typeof data);
    let res = data.split("\n");
    for(let i = 0; i < res.length; i++){
      res[i] = res[i].split(": ");
    }
    console.log("PARSED", res);
  });

  // function parse() {
  //   return new Promise((resolve, reject) => {
  //     apiCall().then((data) => {
  //       console.log(JSON.stringify((JSON.parse(data).responses[0])['textAnnotations'][0]['description']));

  //       resolve(JSON.parse(data).responses[0]);
  //     });
  //   });
  // }

  // function stringify() {
  //   return new Promise((resolve, reject) => {
  //     parse().then((data) => {
  //       console.log(JSON.stringify(data['textAnnotations'][0]['description']));

  //       resolve(JSON.stringify(data['textAnnotations'][0]['description']));
  //     });
  //   });
  // }

  // function parsePres() {
  //   let result = {};
  //   return new Promise((resolve, reject) => {
  //     stringify().then((data) => {
  //       resolve(data.split('\n'));
  //     });
  //   });
  // }

  // return new Promise((resolve, reject) => {
  //   parsePres().then((data) => {
  //     console.log(data);
  //     res.send(data);
  //   });
  // });
});

// .forEach((data) => {
//     let arr = data.split(': ');
//     arr[1] && (result[arr[0]] = arr[1]);
// })
