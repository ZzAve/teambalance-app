#!/bin/sh
# Entrypoint of the stg image (api/Dockerfile, target `stg`): start the in-container Postgres, then
# run the app with the same JVM flags as prod; keep them in sync with the prod ENTRYPOINT in
# api/Dockerfile. The cluster in /app/pgdata was initialised at image build time, so every cold start
# begins with an empty `teambalance` database.
set -e
pg_ctl -D /app/pgdata -l /tmp/postgres.log -w -t 60 start
exec java -XX:+UseSerialGC -XX:TieredStopAtLevel=1 -XX:AOTCache=app.aot -Dspring.aot.enabled=true -jar app.jar
