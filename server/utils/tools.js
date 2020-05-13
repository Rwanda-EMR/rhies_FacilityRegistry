
var request = require('../app/node_modules/request');
var config = require('../config/config');
var fRecModel = require('../../models/facilityModel')
var mapFile = require('./mapFile');

var apiConfig = config;


exports.structureFacilityRecord =  function  (responseBody) {
    
    let tbFRecords = [];
    
    for (var  z = 0;  z < responseBody.length; z ++) {
        
        let modelFRecord = new fRecModel.facRecordModel.constructor();
        let tab = responseBody[z].path.split("/");
         
        modelFRecord.idDHIS2 = responseBody[z].id;
        modelFRecord.fosaCode = responseBody[z].code;
        modelFRecord.name = responseBody[z].name;
        modelFRecord.type = responseBody[z].featureType;
        modelFRecord.description = "FOSAID: " + responseBody[z].code + " TYPE: " + "XX";
        modelFRecord.lastUpdated = responseBody[z].lastUpdated;
        modelFRecord.openingDate = responseBody[z].openingDate;
        modelFRecord.province = mapFile.getProvinceName(tab[2]);
        modelFRecord.district = mapFile.getDistrictName(tab[3]);
        modelFRecord.sector = mapFile.getSubDistrictName(tab[4]);
        modelFRecord.cell = mapFile.getCelluleName(tab[5])
        modelFRecord.coordinates = responseBody[z].coordinates;
        modelFRecord.phoneNumber = responseBody[z].phoneNumber;
        modelFRecord.email = responseBody[z].email;
        modelFRecord.extractDate = Date.now;
        
        tbFRecords.push(modelFRecord);
       
        
        
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
                    var objResponse = JSON.parse(ResponseBody.body);
                    var tab = [];
                    var facRegTab = objResponse.organisationUnits;
                    for(var e =0; e < objResponse.organisationUnits.length; e++){
                        tab.push(facRegTab[e])
                    }
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

