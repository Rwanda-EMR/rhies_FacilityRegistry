
var request = require('request');
var tools = require('./utils/tools');
var config = require('./config/config')
var apiConfig = config.serviceConfig;
var fRecModel = require('../../models/facilityModel')

exports.structureFacilityRecord =  function  (responseBody) {
    
    var tbFRecords = [];
    i = 0;
    
    for(i = 0; i < responseBody.length; i++) {

        var modelFRecord = fRecModel.facRecordModel

        modelFRecord.fosaCode = responseBody[i].code;
        modelFRecord.name = responseBody[i].name;
        modelFRecord.description = "FOSAID: " + responseBody[i].code + " TYPE: " + "XX";
        modelFRecord.lastUpdated = responseBody[i].lastUpdated;

        tbFRecords.push(modelFRecord);

    }

    return tbFRecords;
}


exports.getFacilityRecordFromDHIS2 = function () {
    
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
}