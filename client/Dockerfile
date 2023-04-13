FROM node:latest

WORKDIR /usr/app/client

COPY package.json .
RUN npm install

COPY public public
COPY index.js .

EXPOSE 8080

CMD ["node", "index.js"]
