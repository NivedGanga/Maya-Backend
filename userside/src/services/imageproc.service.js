const { dbConnection } = require('../config/database');
const kafka = require('kafka-node');
const { producer } = require('../config/kafka');
const dotenv = require('dotenv').config();

let waitingForConsumer = false;

/**
 * Fetches a batch of 10 images and sends to Kafka.
 */
const fetchAndSendBatch = () => {
    if (waitingForConsumer) return; // Avoid sending another batch before acknowledgment

    const query = `SELECT * FROM filestore WHERE isVectorized = false LIMIT 2`;
    dbConnection.query(query).then(([results]) => {
        if (results.length === 0) {
            console.log('No more data to process.');
            return;
        }

        // Send the batch to Kafka
        const payloads = [
            { topic: process.env.KAFKA_TOPIC, messages: JSON.stringify(results) },
        ];
        producer.send(payloads, (err, data) => {
            if (err) {
                console.error('Error sending batch to Kafka:', err);
            } else {
                console.log('Batch sent to Kafka:', data);
                waitingForConsumer = true; // Wait for acknowledgment
            }
        });
    }).catch((err) => {
        console.error('Database Query Error:', err);
    });
};

// Start fetching and sending batches
fetchAndSendBatch();

/**
 * Listens for acknowledgment from consumer to send the next batch.
 */
const consumerClient = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const consumer = new kafka.Consumer(
    consumerClient,
    [{ topic: 'acknowledgement', partition: 0 }],
    { autoCommit: true }
);

consumer.on('message', (message) => {
    console.log('acknowledgement received from consumer:', message.value);
    waitingForConsumer = false; // Consumer finished the batch
    fetchAndSendBatch(); // Fetch and send the next batch
});

consumer.on('error', (err) => {
    console.error('Kafka Consumer Error:', err);
});

module.exports = { fetchAndSendBatch };
