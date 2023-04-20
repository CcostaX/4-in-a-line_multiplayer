FROM --platform=linux/amd64 node:latest

WORKDIR /usr/app/server

COPY package.json .
RUN npm install
COPY index.js .

EXPOSE 3000

ENV database_uri="host.docker.internal"
CMD [ "npm", "start" ]
