FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile

COPY apps/api ./apps/api

WORKDIR /app/apps/api

EXPOSE 3333

CMD ["pnpm", "dev"]
