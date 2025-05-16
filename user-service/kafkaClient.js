const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['localhost:9092'] // make sure Kafka broker is running here
});

const producer = kafka.producer();

const produceUserCreatedEvent = async (user) => {
  await producer.connect();
  await producer.send({
    topic: 'user-created',
    messages: [
      { value: JSON.stringify(user) },
    ],
  });
  await producer.disconnect();
};

module.exports = { produceUserCreatedEvent };
