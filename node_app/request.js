const rp = require( 'request-promise' );
const logger = require( './logger' );

const randomInt = () => Math.floor( Math.random() * 10 ) % 2;

const request = async nextService => {
  if ( !nextService ) { return {}; }

  const endpoint = randomInt() === 0 ? '/' : '/error'

  const startTime = Date.now();
  let result = {};

  try {
    result = await rp( {
      uri: `http://${nextService}${endpoint}`,
      headers: { 'X-Request-Id': process.env.REQUEST_ID },
      json: true
    } );
  } catch ( err ) {}

  const time = Date.now() - startTime;
  logger.debug( { url: `http://${nextService}/`, time }, { type: 'http_client' } );

  return result;
};

module.exports = request;
