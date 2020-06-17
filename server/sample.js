var request = require('request');
var apiConf = require('../server/config/config')

exports.getDhis2District = function (value, callback) {
    var options = {
      url: apiConf.api.dhis2.url + '/api/organisationUnitGroups/'+ value + '.json?fields=shortName',
      headers: {
        'Authorization': 'Basic ' + new Buffer(apiConf.api.dhis2.user.name + ":" + apiConf.api.dhis2.user.pwd).toString('base64'),
        'Content-Type': 'application/json'
      }
    };
  
    request.get(options, function (error, response, body) {
      if (error) {
        callback("");
      } else {
        var resp = JSON.parse(body);
        if ((resp.shortName !== 'undefined') && (resp.shortName !== '')) {
          callback(resp.shortName);
        } else {
          callback("");
        }
      }
    });
  }


  exports.getDhis2District('kTGHFozEDeO',function(result){
      console.log(result);
  })