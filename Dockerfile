FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /server

COPY ./server/package*.json ./
RUN npm install

COPY ./server/prisma ./prisma/
COPY ./server/prisma.config.ts ./
RUN DATABASE_URL="postgresql://placeholder:5432" npx prisma generate

COPY ./server .

RUN npm run build

EXPOSE 8080

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]