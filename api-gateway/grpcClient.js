const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load proto file
const PROTO_PATH = path.join(__dirname, '../user-service/proto/user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Create gRPC client connected to UserService
const client = new userProto.UserService(
  'localhost:50051', // make sure port matches your UserService
  grpc.credentials.createInsecure()
);

module.exports = client;
