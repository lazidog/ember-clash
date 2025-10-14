# database

## Initial (for memorize)

```sh
yarn prisma init # init schema.prisma
yarn prisma:gen # generate Prisma Client
# ✔ Generated Prisma Client (v6.17.1) to ./../../node_modules/.pnpm/@prisma+client@6.17.1_prisma@6.17.1/node_modules/@prisma/client in 42ms
# import { PrismaClient } from '@prisma/client'
# const prisma = new PrismaClient()

```

## Dump data

```sh
docker exec -i digdig-postgres-1 psql -d postgres -U postgres < ./dump.sql
```

## Execute migration

### On production

(TBD)

### On local development

- install

```sh
docker compose up
```

- setup database

```sh
# POSTGRESQL DB

$ cd db
#log --> direnv: loading db/.envrc
#log --> direnv: export +MONGO_URI +POSTGRES_DATABASE_URL +POSTGRES_DIRECT_URL
$ yarn prisma:migrate

# check postgresql
docker exec -it {containerId} psql -U postgres -d postgres
postgres=# \dt
# quit psql
postgres=# \q
```


- Create data migration

```sh
# postgres
yarn prisma:migrate:data
yarn ts-node prisma/data-migrations/20231101044221_example

```

## Test

```bash
cd db/test
yarn prisma:db:push
```

```bash
yarn prisma:gen
```

```bash
yarn test
```
