FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/app/package.json ./apps/app/

RUN pnpm install --frozen-lockfile

COPY apps/app ./apps/app

WORKDIR /app/apps/app

RUN pnpm build

FROM nginx:alpine

COPY --from=builder /app/apps/app/dist /usr/share/nginx/html

EXPOSE 80
