FROM node:alpine as builder

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn

COPY . .

CMD ["yarn", "start"]