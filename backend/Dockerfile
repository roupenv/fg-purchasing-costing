# pull the official base image
FROM --platform=linux/amd64 node:lts-alpine AS node

# Dev Stage
FROM node as dev

# set working direction
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm i

COPY ./prisma/ ./prisma
RUN npx prisma generate

# start app
CMD ["npm", "start"]


# Build & compile Javascript project from Typescript


FROM node as builder

# set working direction
WORKDIR /app

COPY --from=dev /app/ ./ 

# Add app
COPY . ./

RUN npm run build


FROM node as production

# set working direction
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm i --only=production

COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma


CMD ["npm", "run", "start:prod"]



