'use strict';

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var routes = require('./routes');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var cars = [
  {
    image: '',
    brandModel: 'Toyota/Corolla',
    year: '2011',
    plate: 'BMX2020',
    color: 'preto'
  },

  {
    image: '',
    brandModel: ' Chevrolet/Astra',
    year: '2015',
    plate: 'BMX2020',
    color: 'prata'
  },
]

app.get('/car', function(req, res) {
  res.json(cars);
});

app.post('/car', function(req, res) {
  var image = req.body.image;
  var brandModel = req.body.brandModel;
  var year = req.body.year;
  var plate = req.body.plate;
  var color = req.body.color;

  cars.push({ 
    image: image,
    brandModel: brandModel,
    year: year,
    plate: plate,
    color: color
  });

  res.json(cars);
});

app.use('/car', routes);

app.listen(port, function() {
  console.log('Listening on port http://localhost:%d', port);
});
