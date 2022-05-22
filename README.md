
# FG-Purchasing-Costing
An internal full-stack application to record, consolidate, and evaluate costs related to purchasing finished goods.
Please note that this repo is a copy of the private repo used in production, and thus this public repo has limited git history.
Link to the Demo App and private repo is available upon request

## Motivation
The motivation for this project was to take an internal Microsoft Access project I created and learn how to write and build a full-stack application that would be of practical use for the company and management. This app is to be used in conjunction with company's ERP software vendor and augment it's capabilities.

I had experience building various small Python and Arduino projects but always wanted to learn how to build a viable web-application. I iterated through this project several times but ultimately decided to stick with Typescript for both the frontend and backend languages and use NodeJS runtime and Postgres for the data which was relational in nature.


## What I learned
- Postgres, SQL and relational schema design
- NodeJS and backend design patterns, designing API resources and endpoints.
- API Endpoint Testing with Jest 
- React, React Hooks, Custom Hooks, State Management using Context API and Reducers, as well as UI libraries like MUI
- Docker & Docker-Compose for multi-platform development and production. 
  - Multistage Dockerfiles to target dev and prod builds
- Linux Server setup, basic networking, crontab to backup files, etc...


## Features
- Dashboard Page for insight into YOY performance as well as other key metrics.
- Resource Data Summary and Data Input Pages with form validation.
- Reports Pages with report parameters and grouping/Aggregating Features.
- Authentication Login Page
- Authorization JWT Auth with roles to access select resources (Admin/User).


## Tech Stack
#### (PERN) with Typescript
- **Frontend:** React w/hooks, MUI UI Library
- **Backend:** NodeJs, Express, Prisma(ORM)
- **Database:** Postgres

#### Other Tools
- Jest for testing
- Docker for development and production


Simple Github CD workflow to deploy changes on local server running docker on push to main/master branch.
Migration Scripts from MS Access to Postgres were written in Python using ODBC and Postgres Libraries (not included in this repo).

## Launch

#### List Of `.Env` Files and Variables That Need To Be Defined
- `./backend/.env`
  - DATABASE_URL=`"postgresql://{username}:{password}@{hostname}:{port}/{database_name}?schema=public"`
  - EXCHANGE_RATE_API_KEY 
  - JWTSECRET


- `./db/postgres.env`
  - POSTGRES_USER
  - POSTGRES_PASSWORD
  - POSTGRES_DB


For Local Development make sure to do `npm install` for frontend and backend folders before running docker-compose up, as local filesystem is mounted into containers.
Requires seeding the database with some preliminary data to work.
Run `docker-compose up` 


## Inspirations
I am a Manufacturing Engineer and have worked on several self-initiated programming projects during my undergraduate studies and professional career. I worked into operations but my engineering background followed and I became motivated to develop my programing skills after working with **Shopify** on daily basis. I really liked Shopify's user interface, the immense value it brought to businesses, as well as my experience developing small apps using their API's to help with create efficiencies in our daily workflows. I became very intrigued on how it and other modern applications like it work and wanted to take steps to self-teach and develop my skills and pivot into becoming a software engineer. Many elements of this project was inspired from **Shopify**.



