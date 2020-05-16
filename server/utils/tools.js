
var request = require('../app/node_modules/request');
var config = require('../config/config');
var fRecModel = require('../../models/facilityModel')
var mapFile = require('./mapFile');
var deasync = require('../app/node_modules/deasync');
const mongodb = require('../app/node_modules/mongodb');
const winston = require('../app/node_modules/winston');
const MongoClient = mongodb.MongoClient;

var apiConfig = config;



exports.structureFacilityRecord =  function  (responseBody) {
    
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
        modelFRecord.province = mapFile.getProvinceName(tab[2]);
        modelFRecord.district = mapFile.getDistrictName(tab[3]);
        modelFRecord.sector = mapFile.getSubDistrictName(tab[4]);
        modelFRecord.cell = mapFile.getCelluleName(tab[5])
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


exports.saveFacilities = function(facilityTab) {

    var url = apiConfig.facilityregistry.mongodb.url;
    MongoClient.connect(url, function(err, db) {
        if (err) {
            winston.info("Error while connecting to the database: ", err);
        } else {
            var dbo = db.db("FacilityRecord");
            dbo.collection("facilities").deleteMany({}, function(err, result){
                if (err) {
                    winston.info("Error while removing all facility documents into the database: ", err);
                    db.close();
                } else {
                    winston.info("Old facility documents successfully deleted! ");
                    winston.info("Number of new documents to insert----> " + facilityTab.length);
                    for(let i=0; i<facilityTab.length; i++){
                        dbo.collection("facilities").insertOne(facilityTab[i], function(err, result) {
                            if (err) {
                                winston.info("Error while inserting facility documents into the database: ", err);
                                db.close();
                            } else {
                                winston.info("Facility succesfully inserted for the fosaCode: " + facilityTab[i].fosaCode);
                            };
                        });
                    }
                    db.close();
                }
            });
        }
    });
}


exports.getAllFacilities = function(){
    var url = apiConfig.facilityregistry.mongodb.url;
    var facilitiesTab = null
    MongoClient.connect(url, function(err, db) {
        if (err) {
            winston.info("Error while connecting to the database: ", err);
        } else {
            var dbo = db.db("FacilityRecord");
            dbo.collection("facilities").find({}).toArray( function(err, result) {
                if (err) {
                    winston.info("Error while retrieving DISTRICT name from the database: ", err);
                    db.close();
                } else {
                    facilitiesTab =  result;
                    db.close();
                };
            });
        }
    });

    while(facilitiesTab==null){
        deasync.runLoopOnce();
    }
    return facilitiesTab;
}


exports.getOneFacilityByFosa = function(fosaId){

    var url = apiConfig.facilityregistry.mongodb.url;
    var facilitiesTab = null
    MongoClient.connect(url, function(err, db) {
        if (err) {
            winston.info("Error while connecting to the database: ", err);
        } else {
            var dbo = db.db("FacilityRecord");
            var query = { fosaCode: '' + fosaId  };
            dbo.collection("facilities").find(query).toArray( function(err, result) {
                if (err) {
                    winston.info("Error while retrieving DISTRICT name from the database: ", err);
                    db.close();
                } else {
                    facilitiesTab =  result;
                    db.close();
                };
            });
        }
    });

    while(facilitiesTab==null){
        deasync.runLoopOnce();
    }
    return facilitiesTab;    

}