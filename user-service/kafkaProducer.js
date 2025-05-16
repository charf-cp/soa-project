const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['localhost:9092'], // Make sure your Kafka broker is running here
});

const producer = kafka.producer();

const produceUserUpdate = async (user) => {
  await producer.connect();
  await producer.send({
    topic: 'user-updates',
    messages: [
      { key: user.userId, value: JSON.stringify(user) },
    ],
  });
  await producer.disconnect();
};

module.exports = { produceUserUpdate };
