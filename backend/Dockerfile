# --- Stage 1: deps (cached unless package.json changes) ---
FROM node:22-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci


# --- Stage 2: builder ---
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate


# --- Stage 3: runner ---
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# Prisma client needs the schema + generated engine to match THIS stage
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/server.js"]