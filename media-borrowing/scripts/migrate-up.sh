#!/bin/bash

if [ ! -f "package.json" ]; then
    echo "Error: Must run from project root directory"
    exit 1
fi

TEMP_APP_COMMAND=$APP_COMMAND
export APP_COMMAND="pnpm migrate:up"

docker compose -f docker-compose.dev.yml up --build --exit-code-from node-app

export APP_COMMAND="pnpm migrate:redo"

docker compose -f docker-compose.dev.yml up --exit-code-from node-app

export APP_COMMAND=$TEMP_APP_COMMAND