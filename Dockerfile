# setup base layer
FROM node:16.13.2-alpine AS base

WORKDIR /app

#setup web app layer
COPY package*.json ./

RUN npm ci

# Build
FROM dependencies as build

ARG BUILD_ENV
ARG BUIL