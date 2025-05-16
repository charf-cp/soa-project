const { produceUserUpdate } = require('./kafkaProducer');

const testUser = {
  userId: '123',
  name: 'Test User',
  email: 'test@example.com',
};

produceUserUpdate(testUser)
  .then(() => {
    console.log('Kafka message sent successfully!');
  })
  .catch((err) => {
    console.error('Error sending Kafka message:', err);
  });
