#!/bin/bash

if [ ! -f "package.json" ]; then
    echo "Error: Must run from project root directory"
    exit 1
fi

TEMP_APP_COMMAND=$APP_COMMAND
export APP_COMMAND="pnpm seed:dev"

docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up --build --remove-orphans --exit-code-from node-app
docker compose -f docker-compose.dev.yml down

export APP_COMMAND=$TEMP_APP_COMMAND