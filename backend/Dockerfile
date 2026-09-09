FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL


RUN npx prisma generate

EXPOSE 10000

CMD ["npm", "start"]