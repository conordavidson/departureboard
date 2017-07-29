var express = require('express');
var http = require('http');
var request = require('request');
var csv = require('csvtojson');

var app = express();
var server = app.listen(3000)
app.use(express.static('app'));


// Render json at '/departures' URI via fetchData function.

app.get('/departures', fetchData);

function fetchData(req, res){
  var output = '';

// Get and parse the departure times CSV.

  csv()
    .fromStream(request.get('http://developer.mbta.com/lib/gtrtfs/Departures.csv'))
      .on('end_parsed', (json) => {
          output = json;
      })
      .on('done', (error) => {
          if (error){
            console.log(error);
          }
          else{
            res.json(output);
          }
      });
}
