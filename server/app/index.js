#!/usr/bin/env node
'use strict'
const express = require('express');
const winston = require('winston');
const _ = require('underscore');
const cron = require('node-cron');
const mongodbCon = require('../models/mongodbCon');
var myConfig = require('../config/config')
var tools = require('../utils/tools');



// Logging setup
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { level: 'info', timestamp: true, colorize: true });

var port = myConfig.facilityregistry.port;

/**
 * setupApp - configures the http server for this mediator
 *
 * @return {express.App}  the configured http server
 */
function setupApp() {
  
  // start the rest of your app here
  const app = express();

  //Coonect only one time to the mongoDB
  mongodbCon.connectToServer( function( err, client ) {
    var db = mongodbCon.getDb();
    if (err) winston.info("Database connection error : ", err);
    
    //Call Facility record pulling fucntion each mn in the config with Cron 
    cron.schedule(myConfig.facilityregistry.cronschedule, () =>{

      tools.getFacilityRecordFromDHIS2(function(resultat){
    
        var resultTab = []
        resultTab = tools.structureFacilityRecord(db, resultat);
        console.log(resultTab);
        tools.saveFacilities(db, resultTab);


      })

    });


    //Facility registry resource endpoint for GET only
    app.get('/facilityregistry/', (req, res) => {
      winston.info(`Processing ${req.method} request on ${req.url}`);
      var resultTab = tools.getAllFacilities(db);
      winston.info('All facilities found. Number of facilities --> ' + resultTab.length);
      res.json({FacilitiesList: resultTab});
    })
    .get('/facilityregistry/fosa/:fosaID', (req, res) => {
      var fosaID = parseInt(req.params.fosaID);
      if(!fosaID && fosaID!==0){
        winston.info('No facility found for Fosa ID --> ' + fosaID);
        res.status(404).json({error: "on fosaID type"});
      }
      if(typeof(fosaID)=='number'){
        winston.info(`Processing ${req.method} request on ${req.url}`);
        var resultOne = tools.getOneFacilityByFosa(db,fosaID);
        if(resultOne!=''){
          winston.info('One facility found for Fosa ID --> ' + fosaID);
          res.json({facility: resultOne});
        } else {
          winston.info('No facility found for Fosa ID --> ' + fosaID);
          res.json({facility: "No facility for fosa=" + fosaID});
        }
      } 
    })
    .use(function(req, res, next){
      winston.info(`Processing ${req.method} request on ${req.url}`);
      res.setHeader('Content-Type', 'text/plain');
      res.status(404).send('Not such a resource !');
    });
    //End of resource
    
  });
  return app;
}




/**
 * start - starts the mediator
 *
 * @param  {Function} callback a node style callback that is called once the
 * server is started
 */
function start(callback) {
    let app = setupApp();
    const server = app.listen(port, () => callback(server));
}


  exports.start = start
  
  if (!module.parent) {
    // if this script is run directly, start the server
    start(() => winston.info(`Listening on ${port}...`));
  }