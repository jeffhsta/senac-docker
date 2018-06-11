const amqplib = require( 'amqplib' );

const QUEUE = 'logs';
let originalLog = () => {};

const logOnRabbitMQ = async logPayload => {
  try {
    const connection = await amqplib.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    const logContent = typeof logPayload == 'object' ? JSON.stringify( logPayload ) : logPayload;
    channel.sendToQueue( QUEUE, new Buffer( logContent ) );
  } catch( error ) {
    //originalLog( 'Error when trying to log on RabbitMQ: ', error );
  }
};

const logger = ( content, logMetadata ) => {
  const metadata = Object.assign( {}, logMetadata, {
    timestamp: new Date(),
    source: process.env.SELF_NAME,
    request_id: process.env.REQUEST_ID
  } );

  const logPayload = { metadata, content };

  originalLog( logPayload );
  logOnRabbitMQ( logPayload );
};

const info = async ( content, metadata = {} ) => {
  logger( content, Object.assign( {}, metadata, { level: 'INFO' }) );
};

const debug = async ( content, metadata = {} ) => {
  logger( content, Object.assign( {}, metadata, { level: 'INFO' }) );
};

const warn = async ( content, metadata = {} ) => {
  logger( content, Object.assign( {}, metadata, { level: 'INFO' }) );
};

const error = async ( content, metadata = {} ) => {
  logger( content, Object.assign( {}, metadata, { level: 'INFO' }) );
};

const initialize = () => {
  originalLog = console.log;
  console.log = debug;
  console.debug = debug;
  console.info = info;
  console.warn = warn;
  console.error = error;
};

module.exports = { info, debug, warn, error, initialize };
