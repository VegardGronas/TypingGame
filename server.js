const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const words = require('an-array-of-english-words'); // Import the words list

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (optional, for client-side files)
app.use(express.static('public'));

app.get('/words', (req, res) => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    res.json(randomWord);
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle incoming messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Broadcast the message to all clients
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
