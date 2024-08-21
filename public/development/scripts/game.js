document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const inputField = document.getElementById("inputField");
    const wordToWriteDisplay = document.getElementById("word");
    const timeDisplay = document.getElementById("time-display");
    const wordsDisplay = document.getElementById("words-display");
    const wpmDisplay = document.getElementById("wpm-display");
    const startButton = document.getElementById("startButton");
    const playerIdDisplay = document.getElementById("player-id");

    let userId;
    let playerData = {};

    socket.on('user id', (id) => {
        userId = id;
        playerIdDisplay.innerHTML = `Your ID: ${userId}`;
    });

    socket.on('game invitation', (data) => {
        const accept = confirm(`Player ${data.opponentId} wants to start a game. Do you accept?`);
        if (accept) {
            socket.emit('accept game');
        }
    });

    socket.on('game start', (data) => {
        startGame();
    });

    function startGame() {
        socket.emit('start game');
    }

    function onInputEnter() {
        const inputValue = inputField.value.trim();
        if (inputValue) {
            socket.emit('input', inputValue);
            inputField.value = "";
        }
    }

    function updateUI() {
        if (!playerData.started) {
            timeDisplay.innerHTML = formatTime(0);
            wordsDisplay.innerHTML = '0 Words';
            wpmDisplay.innerHTML = '0.00 WPM';
            return;
        }

        const elapsedTime = Math.floor((Date.now() - playerData.startTime) / 1000);
        const formattedTime = formatTime(elapsedTime);
        timeDisplay.innerHTML = formattedTime;

        const wpm = (playerData.points / (elapsedTime / 60)).toFixed(2);
        wpmDisplay.innerHTML = `${wpm} WPM`;
        wordsDisplay.innerHTML = `${playerData.points} Words`;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            onInputEnter();
        }
    });

    startButton.addEventListener('click', () => {
        startGame();
    });
});
