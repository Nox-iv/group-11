#!/bin/bash

if [ ! -f "package.json" ]; then
    echo "Error: Must run from project root directory"
    exit 1
fi

docker compose -f docker-compose.test.yml down
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from node-app-test
docker compose -f docker-compose.test.yml down