
var request = require('../app/node_modules/request');
var config = require('../config/config')
var fRecModel = require('../../models/facilityModel')

var apiConfig = config;


exports.structureFacilityRecord =  function  (responseBody) {
    
    var tbFRecords = [];
    var z=0;
    while( z < responseBody.length) {

        let modelFRecord = new fRecModel.facRecordModel.constructor();
        var parentTab = [];
        parentTab = responseBody[z].path.split("/");

        modelFRecord.idDHIS2 = responseBody[z].id;
        modelFRecord.fosaCode = responseBody[z].code;
        modelFRecord.name = responseBody[z].name;
        modelFRecord.description = "FOSAID: " + responseBody[z].code + " TYPE: " + "XX";
        modelFRecord.lastUpdated = responseBody[z].lastUpdated;
        modelFRecord.openingDate = responseBody[z].openingDate;
        modelFRecord.coordinates = responseBody[z].coordinates;
        modelFRecord.phoneNumber = responseBody[z].phoneNumber;
        modelFRecord.email = responseBody[z].email;

        //Model geoPosition
        modelFRecord.province = parentTab[2];
        modelFRecord.district = parentTab[3];
        modelFRecord.sector = parentTab[4];
        modelFRecord.cell = parentTab[5];
        

        modelFRecord.type = responseBody[z].featureType;


        tbFRecords.push(modelFRecord);
        z+=1;

    }

    return tbFRecords;
}


exports.getFacilityRecordFromDHIS2 = function (callback) {
    
    var endPoint = "/api/organisationUnits.json?level=6&fields=id,code,name,lastUpdated,featureType,url,path,openingDate,closingDate,phoneNumber,coordinates,email&pageSize=30000";    
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
                    //console.log("AFFICHAGE  "  + JSON.stringify(JSON.parse(ResponseBody.body).organisationUnits));
                    var objResponse = JSON.parse(ResponseBody.body);
                    console.log("Le nombre des Facilities =  " + objResponse.organisationUnits.length)
                    var tab = [];
                    var facRegTab = objResponse.organisationUnits;
                    for(var e =0; e < objResponse.organisationUnits.length; e++){
                        tab.push(facRegTab[e])
                    }
                    console.log("Type tab : " + typeof(tab) + " length : " + tab.length);
                    
                    callback(tab);
                    
                } else {
                    console.log("An error occured on response: " + error);
                }
            } else {
                console.log("Error no ResponseBody found")
            }

        }
    });
};