const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const players = {};
const waitingPlayers = []; 

io.on('connection', (socket) => {
    console.log('A user connected');

    const userId = uuidv4();
    players[socket.id] = { userId, points: 0, started: false, startTime: 0, currentWord: '' };

    socket.emit('user id', userId);

    socket.on('start game', () => {
        waitingPlayers.push(socket.id);

        if (waitingPlayers.length >= 2) {
            const player1 = waitingPlayers.shift();
            const player2 = waitingPlayers.shift();

            io.to(player1).emit('game invitation', { opponentId: players[player2].userId });
            io.to(player2).emit('game invitation', { opponentId: players[player1].userId });
        }
    });

    socket.on('accept game', () => {
        const player = players[socket.id];

        if (player.started) return;

        player.started = true;

        const allPlayers = Object.values(players).filter(p => p.started);
        if (allPlayers.length >= 2) {
            allPlayers.forEach(p => {
                io.to(p.userId).emit('game start', { players: allPlayers.map(p => p.userId) });
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        clearInterval(players[socket.id]?.timer);
        delete players[socket.id];
        io.emit('game state', players);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
