FROM node:16-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

COPY .env.example .env

RUN npm run build && npx prisma generate

CMD ["npm", "run", "start:dev"]



