FROM node:18-alpine as development

WORKDIR /usr/src/app

# Install bash
RUN apk add --no-cache bash

COPY package*.json prisma ./
RUN npm install

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh

FROM node:18-alpine as production

WORKDIR /usr/src/app

# Install bash
RUN apk add --no-cache bash

COPY package*.json prisma ./
RUN npm install

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh