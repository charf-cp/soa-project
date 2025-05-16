const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'proto', 'ssi.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const ssiProto = grpc.loadPackageDefinition(packageDefinition).ssi;

// Dummy data simulating users and verification status
const users = {
  '1': { userId: '1', name: 'Alice', email: 'alice@example.com' },
  '2': { userId: '2', name: 'Bob', email: 'bob@example.com' },
};

const verifiedUsers = {
  '1': { verified: true, message: 'User verified successfully' },
  '2': { verified: false, message: 'Verification failed' },
};

function verifyFullIdentity(call, callback) {
  const { userId, credential } = call.request;
  const user = users[userId];
  const verification = verifiedUsers[userId];

  if (user && verification && verification.verified) {
    callback(null, {
      userId: user.userId,
      name: user.name,
      email: user.email,
      verified: true,
      message: verification.message,
    });
  } else {
    callback(null, {
      userId: userId || '',
      name: '',
      email: '',
      verified: false,
      message: 'Verification failed or user not found',
    });
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(ssiProto.SSIService.service, { VerifyFullIdentity: verifyFullIdentity });
  const bindAddress = '0.0.0.0:50053';
  server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
    console.log(`SSIService gRPC server running at ${bindAddress}`);
    server.start();
  });
}

main();
