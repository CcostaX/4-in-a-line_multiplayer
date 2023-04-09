FROM node:latest

WORKDIR /usr/app

COPY server/package.json server/
RUN npm --prefix server install

COPY server/index.js server/
COPY client/public client/public

ENV DATABASE_URI="host.docker.internal"
ENTRYPOINT ["node", "server/index.js"]