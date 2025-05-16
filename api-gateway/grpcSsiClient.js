const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Path to your ssi-service proto file
const PROTO_PATH = path.join(__dirname, '../ssi-service/proto/ssi.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const ssiProto = grpc.loadPackageDefinition(packageDefinition).ssi;

const client = new ssiProto.SSIService(
  'localhost:50053', // make sure port matches your ssi-service
  grpc.credentials.createInsecure()
);

module.exports = client;
