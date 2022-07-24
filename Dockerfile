FROM node:16-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npx prisma generate && npm run build 

CMD npx prisma migrate deploy && npm run start:dev



