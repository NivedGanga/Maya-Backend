docker exec -it kafka bash
kafka-topics --create --topic image-processing --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
kafka-topics --create --topic acknowledgement --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
kafka-topics --list --bootstrap-server localhost:9092
docker volume rm kafka_kafka-data
docker rmi imageid