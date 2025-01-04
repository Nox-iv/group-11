#!/bin/bash

docker compose -f ../media-search/docker-compose.dev.yml up --build -d --remove-orphans --force-recreate
docker compose -f ../media-borrowing/docker-compose.dev.yml up --build -d --remove-orphans --force-recreate

pnpm start