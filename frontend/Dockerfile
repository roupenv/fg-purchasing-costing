# pull the official base image
FROM node:lts-alpine AS node


FROM node as dev
# set working direction 
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm i

# start app
CMD ["npm", "start"]

FROM node as builder
# set working direction 
WORKDIR /app

COPY --from=dev /app/ ./

# Add app
COPY . ./

RUN npm run build
