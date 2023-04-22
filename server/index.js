const { MongoClient } = require("mongodb");
const http = require('http');

const server = http.createServer();
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);  
});

if (process.env.database_uri === "host.docker.internal") {
  client = new MongoClient(`mongodb://${process.env.database_uri}:27017`);
  console.log("Trying to connect to MongoDB locally");
} 
else {
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  const uri = `mongodb+srv://${username}:${password}@clustercnn.yt5qi60.mongodb.net/?retryWrites=true&w=majority`;
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Trying to connect to MongoDB Atlas");
}

const messages_collection = client.db('game').collection('messages')

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}
connectToDatabase();

const rooms = {};

function broadcastGameState(room, column, playerColor, origin) {
  const message = JSON.stringify({ type: 'newMove', column, playerColor, origin });
  io.to(room).emit('message', message);
}

io.on('connection', (socket) => {
  console.log('Client connected');

  messages_collection.find().toArray().then( (data) => {
    data.forEach(element => {
      socket.emit("history", element.text);
    });
  });

  socket.on('joinRoom', () => {
    let joined = false;
    for (const [room, players] of Object.entries(rooms)) {
        if (players.length < 2) {
            socket.join(room);
            players.push(socket);
            const playerColor = players.length === 1 ? 'red' : 'blue';
            socket.emit('joinRoom', { room, color: playerColor });
            joined = true;
            break;
        }
    }
    
    if (!joined) {
        const room = `room${Object.keys(rooms).length + 1}`;
        socket.join(room);
        rooms[room] = [socket];
        socket.emit('joinRoom', { room, color: 'red' });
    }
  });

  socket.on('move', (data) => {
      const { column, playerColor, room, origin } = JSON.parse(data);
      
      if (!rooms[room]) {
          console.error('Invalid room');
          return;
      }

      // Use room-based game state
      if (!rooms[room].gameState) {
          rooms[room].gameState = Array.from({ length: 6 }, () => Array(7).fill(null));
      }
      const gameState = rooms[room].gameState;
      
      for (let row = 5; row >= 0; row--) {
          if (gameState[row][column] === null) {
              gameState[row][column] = playerColor;
              break;
          }
      }

      // Broadcast the updated game state to all connected clients in the room
      broadcastGameState(room, column, playerColor, origin);

      // Notify the other player that it's their turn
      const otherPlayer = rooms[room].find((player) => player.id !== socket.id);
      if (otherPlayer) {
          otherPlayer.emit('yourTurn');
      }

  });

  socket.on('win', async (winnerColor) => {
    const obj = { 'date': new Date(), 'text': winnerColor };
    messages_collection.insertOne(obj);
    
    socket.broadcast.emit('history', winnerColor); 
    socket.emit('history', winnerColor); 
  });

  

  socket.on('reset', () => {
    socket.broadcast.emit('reset');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
