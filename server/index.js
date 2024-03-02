const { 
  client
 } = require('./db');

async function init() {
  try {
    await client.connect();
    console.log('connected to the datbase');
  } catch(err) {
    console.error(err);
  }
}
init();