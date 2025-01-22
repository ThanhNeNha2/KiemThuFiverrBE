FROM node:lts-alpine

# Cài đặt build dependencies
RUN apk add --no-cache build-base python3

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
