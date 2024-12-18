#! /bin/bash

if [ ! -f "package.json" ]; then
    echo "Error: Must run from project root directory"
    exit 1
fi

TEMP_APP_COMMAND=$APP_COMMAND_MEDIA_SEARCH
export APP_COMMAND_MEDIA_SEARCH="pnpm run seed:dev"
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up --build --remove-orphans --exit-code-from media-search-app-dev
docker compose -f docker-compose.dev.yml down
export APP_COMMAND_MEDIA_SEARCH=$TEMP_APP_COMMAND