FROM node:18-alpine

RUN corepack enable

WORKDIR /frontend

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY next.config.js* ./
COPY tsconfig.json ./
COPY tailwind.config.js* ./

COPY public ./public
COPY app ./app

EXPOSE 4000

CMD ["pnpm", "dev"]