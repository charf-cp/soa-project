const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'proto', 'verification.proto');

// Load proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const verificationProto = grpc.loadPackageDefinition(packageDefinition).verification;

// Dummy verification data
const verifiedUsers = {
  '1': { userId: '1', credential: 'passport', verified: true },
  '2': { userId: '2', credential: 'driver_license', verified: false },
};

// Implement the VerifyUser RPC method
function verifyUser(call, callback) {
  const { userId, credential } = call.request;
  const user = verifiedUsers[userId];

  if (user && user.credential === credential && user.verified) {
    callback(null, { verified: true, message: 'User verified successfully' });
  } else {
    callback(null, { verified: false, message: 'Verification failed' });
  }
}

// Start the gRPC server
function main() {
  const server = new grpc.Server();
  server.addService(verificationProto.VerificationService.service, { VerifyUser: verifyUser });

  const bindAddress = '0.0.0.0:50052';

  server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }

    console.log(`✅ VerificationService gRPC server running at ${bindAddress}`);
    server.start();
  });
}

main();
