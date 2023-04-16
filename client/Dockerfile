FROM --platform=linux/amd64 node:latest

WORKDIR /usr/app/client

COPY package.json .
RUN npm install

COPY public public
COPY index.js .

EXPOSE 8080

CMD [ "npm", "start" ]