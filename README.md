# game-pop
This repository contains the poller for polling the various services reported on by game-pop. It posts the polling results to Kafka, to then be processed by other game-pop services. It is intended to be used as a scheduled AWS lambda function.

### Currently Supported services:
- Twitch

### Set up following in .env file or environment:
- KAFKA_HOST
- KAFKA_PORT
- TWITCH_CLIENT_ID
- TWITCH_CLIENT_SECRET 
