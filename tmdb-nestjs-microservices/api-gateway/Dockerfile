FROM node:20.12-slim AS development

RUN apt-get update && apt-get install -y procps && apt-get clean

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .
