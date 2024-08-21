document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Receive the user ID from the server
    socket.on('user id', (userId) => {
        console.log('Your user ID:', userId);
        // Store user ID for later use
    });

    // Example: Listen for chat messages
    socket.on('chat message', (data) => {
        console.log('Message from user', data.userId, ':', data.message);
    });
});