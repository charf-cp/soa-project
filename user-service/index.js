const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'proto', 'user.proto');

// Load protobuf
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Sample user data
const users = {
  '1': { userId: '1', name: 'Alice', email: 'alice@example.com' },
  '2': { userId: '2', name: 'Bob', email: 'bob@example.com' }
};

// Implement the GetUser RPC method
function getUser(call, callback) {
  const userId = call.request.userId;
  const user = users[userId];
  if (user) {
    callback(null, user);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'User not found'
    });
  }
}

// Start the gRPC server
function main() {
  const server = new grpc.Server();
  server.addService(userProto.UserService.service, { GetUser: getUser });
  const bindAddress = '0.0.0.0:50051';
  server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`UserService gRPC server running at ${bindAddress}`);
    server.start();
  });
}

main();
