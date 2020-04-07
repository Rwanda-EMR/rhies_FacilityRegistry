exports.structureFacilityRecord =  function  (responseBody) {
    
    var tbFRecords = [];
    i = 0;
    
    for(i = 0; i < responseBody.length; i++) {

        var modelFRecord = {
            "fosaCode" : "",
            "name" : "",
            "lastUpdated" : ""
    
        };

        modelFRecord.fosaCode = responseBody[i].code;
        modelFRecord.name = responseBody[i].name;
        modelFRecord.lastUpdated = responseBody[i].lastUpdated;

        tbFRecords.push(modelFRecord);

    }

    return tbFRecords;
}