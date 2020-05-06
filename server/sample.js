
var request = require('../server/app/node_modules/request');
var tools = require('./utils/tools');
var config = require('./config/config')
var apiConfig = config;

var endPoint = "/api/organisationUnits.json?level=6&fields=code,name,lastUpdated,featureType,url,parent&pageSize=30000"
var options = {
    url: apiConfig.api.dhis2.url + endPoint,
    headers: {
      'Authorization': 'Basic ' + new Buffer(apiConfig.api.dhis2.user.name + ":" + apiConfig.api.dhis2.user.pwd).toString('base64'),
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
            var objResponse = JSON.parse(ResponseBody.body);
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