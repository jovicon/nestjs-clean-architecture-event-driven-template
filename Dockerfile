FROM node:20.13.1-alpine

# Docker Scout -- Vulnerability Scanning solved
RUN apk upgrade busybox 
RUN apk upgrade openssl 

WORKDIR /usr/src/app

COPY ["package.json", "./"]
COPY [".env.example", "./.env"]

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD node ./dist/src/main.js