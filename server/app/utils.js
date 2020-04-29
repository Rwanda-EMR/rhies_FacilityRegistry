'use strict'
var URI = require('urijs');
var _ = require('underscore');
var moment = require('moment');
var request = require('request');
//var formMapping = require("../lib/formMapping");
var apiConf = process.env.NODE_ENV === 'test' ? require('../config/test') : require('../config/config')




exports.buildOrchestration = (name, beforeTimestamp, method, url, requestHeaders, requestContent, res, body) => {
  let uri = new URI(url)
  return {
    name: name,
    request: {
      method: method,
      headers: requestHeaders,
      body: requestContent,
      timestamp: beforeTimestamp,
      path: uri.path(),
      querystring: uri.query()
    },
    response: {
      status: res.statusCode,
      headers: res.headers,
      body: body,
      timestamp: new Date()
    }
  }
}
