FROM --platform=linux/amd64 node:latest

WORKDIR /usr/app/client

COPY package.json .
RUN npm install

COPY public public
COPY index.js .
COPY cmd.sh .

ENV SERVER_URI=localhost:3000
ENV SOCKET_URI=localhost

RUN chmod +x cmd.sh

EXPOSE 8080

ENTRYPOINT ["./cmd.sh"]

