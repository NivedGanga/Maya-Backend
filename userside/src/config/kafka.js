const kafka = require('kafka-node');
const dotenv = require('dotenv').config();

try {
    console.log('Connecting to Kafka:', process.env.KAFKA_BROKER);
    const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
    const producer = new kafka.Producer(client);

    // Producer is readyg 
    producer.on('ready', () => {
        console.log('Kafka Producer is ready');
    });

    // Handle producer errors
    producer.on('error', (err) => {
        console.error('Kafka Producer Error:', err);
    });
    console.log('Kafka Producer is ready');
    module.exports = { producer };
} catch (error) {
    console.error('Error connecting to Kafka:', error);
    process.exit(1);
}