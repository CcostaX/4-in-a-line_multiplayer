const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
});

server.listen(8080, () => {
  console.log('listening on *:8080');
})