FROM --platform=linux/amd64 node:latest

WORKDIR /usr/app/client

COPY package.json .
RUN npm install

COPY public public
COPY index.js .

ENV SERVER_URI=localhost:3000
ENV SOCKET_URI=localhost

RUN find /usr/app/client/public -type f -print0 | xargs -0 sed -i "s|SERVER_URI|${SERVER_URI}|g"
RUN find /usr/app/client/public -type f -print0 | xargs -0 sed -i "s|SOCKET_URI|${SOCKET_URI}|g"

EXPOSE 8080

CMD ["npm", "start"]
