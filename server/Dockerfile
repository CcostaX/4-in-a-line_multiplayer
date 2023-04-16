FROM --platform=linux/amd64 node:latest

WORKDIR /usr/app/server

COPY package.json .
#RUN npm install pm2 -g
RUN npm install

COPY index.js .

EXPOSE 3000

#ENV DATABASE_URI="host.docker.internal"
CMD [ "npm", "start" ]
