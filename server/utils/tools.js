
var request = require('request');
var config = require('../config/config');
var fRecModel = require('../models/facilityModel')
var mapFile = require('./mapFile');
var deasync = require('deasync');
const mongodb = require('mongodb');
const winston = require('winston');
const async = require('async');
const MongoClient = mongodb.MongoClient;

var apiConfig = config;



exports.structureFacilityRecord =  function  (myDB,responseBody) {
    
    let tbFRecords = [];
    let extractDate = exports.getTodayDate();
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

        async.parallel(
            [
                function(callback){
                    mapFile.getProvinceName(myDB, tab[2], function(result){
                        callback(null, result);
                    });
                },
                function(callback){
                    mapFile.getDistrictName(myDB, tab[3], function(result){
                        callback(null, result);
                    });
                },
                function(callback){
                    mapFile.getSubDistrictName(myDB, tab[4], function(result){
                        callback(null, result);
                    });
                },
                function(callback){
                    mapFile.getSectorName(myDB, tab[5], function(result){
                        callback(null, result);
                    });
                }
            ], 
            function(err, allResults){
                if (err){
                    winston.info('Error when retrieving map info : ' , err);
                    modelFRecord.province = null;
                    modelFRecord.district = null;
                    modelFRecord.subdistrict = null;
                    modelFRecord.sector = null;
                } else {
                    modelFRecord.province = allResults[0];
                    modelFRecord.district = allResults[1];
                    modelFRecord.subdistrict = allResults[2];
                    modelFRecord.sector = allResults[3];
                }
            }
        );
        
        modelFRecord.coordinates = responseBody[z].coordinates;
        modelFRecord.phoneNumber = responseBody[z].phoneNumber;
        modelFRecord.email = responseBody[z].email;
        modelFRecord.extractDate = extractDate;
        
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


exports.getTodayDate = function() {
    
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let time = date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds() + ":" + date_ob.getMilliseconds();

    // prints date & time in YYYY-MM-DD_HH:MM:SS:MLS format
    return year + "-" + month + "-" + date + "_" + time;
}


exports.saveFacilities = function(myDB, facilityTab) {

    myDB.collection("facilities").deleteMany({}, function(err, result){
        if (err) {
            winston.info("Error while removing all facility documents into the database: ", err);
                     
        } else {
            winston.info("Old facility documents successfully deleted! ");
            winston.info("Number of new documents to insert----> " + facilityTab.length);
            for(let i=0; i<facilityTab.length; i++){
                myDB.collection("facilities").insertOne(facilityTab[i], function(err, result) {
                    if (err) {
                        winston.info("Error while inserting facility documents into the database: ", err);
                                 
                    } else {
                        winston.info("Facility succesfully inserted for the fosaCode: " + facilityTab[i].fosaCode);
                    };
                });
            }
                     
        }
    });

}


exports.getAllFacilities = function(myDB){
    
    var facilitiesTab = null;
    myDB.collection("facilities").find({}).toArray( function(err, result) {
        if (err) {
            winston.info("Error while retrieving DISTRICT name from the database: ", err);
                     
        } else {
            facilitiesTab =  result;        
        };
    });

    while(facilitiesTab==null){
        deasync.runLoopOnce();
    }
    return facilitiesTab;

}


exports.getOneFacilityByFosa = function(myDB, fosaId){

    var facilitiesTab = null
    var query = { fosaCode: '' + fosaId  };
    myDB.collection("facilities").find(query).toArray( function(err, result) {
        if (err) {
            winston.info("Error while retrieving DISTRICT name from the database: ", err);
                     
        } else {
            facilitiesTab =  result;
                     
        };
    });

    while(facilitiesTab==null){
        deasync.runLoopOnce();
    }
    return facilitiesTab;    

}