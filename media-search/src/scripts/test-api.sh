#!/bin/bash

docker-compose down

docker-compose up -f docker-compose.test.yml

docker-compose down