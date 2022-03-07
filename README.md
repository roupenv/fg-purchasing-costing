
### Notes To Self
For Local Development make sure to do `npm install` for frontend and backend folders before running docker-compose up, as local filesystem is mounted into containers.


#### Steps to Migrate Old Microsoft Access DB to Postgres with Prisma
1. docker-compose up, will create a new empty volume that the postgres container can access
2. From the backend Dockerfile, it will run Prisma Generate which will create a new Prisma Client
3. Run python migrate script, needs to be run from Windows based Machine
4. To baseline Database run: `prisma migrate resolve --applied "20211217215134_initial_migration"`
5. To Apply any new changes to production Database without destroying data, run: `prisma migrate dev --create-only` to create new migration and  `prisma migrate deploy` to apply
6. To check if prisma and database are in sync run `prisma migrate status`
 
#### Docker Commands to Backup and Restore Postgres data using pg_dump
Replace all content inside curly braces{}
- To Backup:  
`docker exec -i {docker_postgres_container} /bin/bash -c "PGPASSWORD={password} pg_dump --username {username} {database_name}" > {insert-path/dump.sql}`

- To Restore:  
`docker exec -i {docker_postgres_container} /bin/bash -c "PGPASSWORD={password} psql --username {username} {database_name}" < {absolute path to dump.sql file}`



#### To Scan for Leaks:
- Run:  
`docker run -v $(pwd)/:/path zricethezav/gitleaks:latest detect --source="/path" `

#### List Of Env Variables That Need To Be Defined
- DATABASE_URL=`"postgresql://{username}:{password}@{hostname}:{port}/{database_name}?schema=public"`
- EXCHANGE_RATE_API_KEY 
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB