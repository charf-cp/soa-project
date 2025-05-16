const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Path to the verification proto file
const PROTO_PATH = path.join(__dirname, '../verification-service/proto/verification.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const verificationProto = grpc.loadPackageDefinition(packageDefinition).verification;

// Create gRPC client connected to VerificationService
const client = new verificationProto.VerificationService(
  'localhost:50052',  // Make sure this matches your verification service port
  grpc.credentials.createInsecure()
);

module.exports = client;
