#!/bin/bash
docker cp ../database_schema.sql yeet-db:/schema.sql
docker exec yeet-db psql -U postgres -d postgres -f /schema.sql
docker exec yeet-backend npx ts-node scripts/db_seed.ts