const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'alias-ukr',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

