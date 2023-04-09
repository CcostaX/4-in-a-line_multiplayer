FROM node:latest

WORKDIR /usr/app/server

COPY package.json .
RUN npm install

COPY index.js .

ENV DATABASE_URI="host.docker.internal"
ENTRYPOINT ["node", "index.js"]