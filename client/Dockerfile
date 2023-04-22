FROM --platform=linux/amd64 node:latest

WORKDIR /usr/app/client

COPY package.json .
RUN npm install

COPY public public
COPY index.js .
COPY cmd.sh .

RUN chmod +x cmd.sh

EXPOSE 8080

CMD ["sh", "-c", "./cmd.sh && npm start"]
