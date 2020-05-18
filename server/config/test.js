

const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;



exports.showCellule = function(idDHIS2){
    var url = "mongodb://localhost:27017/";
    var cel = null
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FacilityRecord");
        var idValue = idDHIS2;
        dbo.collection("cellules").find({id: idValue}, { projection: { _id: 0, id: 1, displayName: 1 } }).toArray( function(err, result) {
            if (err) throw err;
             cel =  result[0].displayName;
             console.log('CEL == '+ cel);
            db.close();
        });
    });
    while(cel==null){
        deasync.runLoopOnce();
    }
    return cel;
};


exports.getCelluleName = function(id){
    return exports.showCellule(id)
};


console.log("TEST = " + this.getCelluleName("r9nQIpfj0rj"));