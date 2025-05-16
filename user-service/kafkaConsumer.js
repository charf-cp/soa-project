const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'user-update-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-updates', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

run().catch(console.error);
