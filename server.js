const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = {}; // Хранение информации о комнатах

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'createRoom':
                if (!rooms[data.roomName]) {
                    rooms[data.roomName] = {
                        players: [],
                        playerCount: data.playerCount,
                    };
                    ws.send(JSON.stringify({ type: 'roomCreated', roomName: data.roomName }));
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Комната уже существует.' }));
                }
                break;
            case 'joinRoom':
                if (rooms[data.roomName]) {
                    const room = rooms[data.roomName];
                    if (room.players.length < room.playerCount) {
                        room.players.push({ name: data.playerName, character: data.character });
                        ws.send(JSON.stringify({ type: 'roomJoined', roomName: data.roomName, players: room.players }));
                        wss.clients.forEach(client => {
                            if (client !== ws && client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({ type: 'playerJoined', playerName: data.playerName }));
                            }
                        });
                    } else {
                        ws.send(JSON.stringify({ type: 'error', message: 'Комната полна.' }));
                    }
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Комната не найдена.' }));
                }
                break;
            case 'getRooms':
                const availableRooms = Object.keys(rooms).map(roomName => ({
                    name: roomName,
                    currentPlayers: rooms[roomName].players.length,
                    maxPlayers: rooms[roomName].playerCount,
                }));
                ws.send(JSON.stringify({ type: 'availableRooms', rooms: availableRooms }));
                break;
            default:
                console.log('Неизвестный тип сообщения:', data.type);
        }
    });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});