const logger = require( './logger' );
logger.initialize();

const express = require( 'express' );
const app = express();
const addRequestId = require('express-request-id')();
const request = require( './request' );

const nextService = process.env.NEXT_SERVICE;
const selfName = process.env.SELF_NAME;

const requestIdGlobal = ( req, res, next ) => {
  process.env.REQUEST_ID = res.get( 'X-Request-Id' );
  next();
};

const logBeginRequest = ( req, res, next ) => {
  process.env.REQ_TIME = Date.now();
  next();
};

const sendResponse = ( req, res, bodyPayload ) => {
  const timeDiff = Date.now() - process.env.REQ_TIME;
  logger.debug( { time_in_ms: timeDiff, status_code: res.statusCode }, { type: "http_server" } );
  res.json( bodyPayload );
};

app.use( addRequestId );
app.use( requestIdGlobal );
app.use( logBeginRequest );

app.get( '/', async ( req, res ) => {
  logger.debug( { message: 'Got it!' } );

  let reply = await request(nextService);

  let bodyResponse = Object.assign( {}, reply );
  bodyResponse[selfName] = 'OK';

  sendResponse( req, res, bodyResponse );
} );

app.get( '/error', ( req, res ) => {
  res.status( 500 );
  sendResponse( req, res, { message: "Something went wrong" } );
} );

app.listen( 3000, () => logger.debug( 'Example app listening on port 3000!' ) );
