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