
const formidable = require('formidable');
const express = require('express');
const medUtils = require('openhim-mediator-utils');
const winston = require('winston');
const _ = require('underscore');



var request = require('request');
var tools = require('../samlpes/utils/tools');


var options = {
    url: "http://192.168.0.10:8082/api/organisationUnits.json?level=6&fields=code,name,lastUpdated,featureType,url,parent&pageSize=3000",
    headers: {
      'Authorization': 'Basic ' + new Buffer("amza" + ":" + "district").toString('base64'),
      'Content-Type': 'application/json'
    },
};

request.get(options, function (error, response) {
    if (error) {
        console.log("An error occured on request: " + error);
    } else {
      var ResponseBody = response;
      if (ResponseBody !== null) {
        if (ResponseBody.statusCode == 200) {
            console.log ("Request succesfully sent and get response ... : ");
            const objResponse = JSON.parse(ResponseBody.body);
            console.log(tools.structureFacilityRecord(objResponse.organisationUnits));
            console.log("Le nombre des Facilities =  " + objResponse.organisationUnits.length)
        } else {
            console.log("An error occured on response: " + error);
          }
      } else {
        console.log("Error no ResponseBody found")
      }
    }
  });