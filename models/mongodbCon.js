const MongoClient = require( '../server/node_modules/mongodb' ).MongoClient;
const apiConfig = require('../server/config/config.json');
const url = apiConfig.facilityregistry.mongodb.url;

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
      _db  = client.db('FacilityRecord');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};