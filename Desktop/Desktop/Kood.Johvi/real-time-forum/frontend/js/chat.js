const socket = new WebSocket("ws://localhost:8080/ws");

const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const userList = document.getElementById("userList");

// WebSocket Events
socket.onopen = () => console.log("Connected to WebSocket server");
socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "onlineUsers") {
        updateOnlineUsers(message.users);
    } else if (message.type === "chat") {
        displayMessage(message);
    }
};
socket.onerror = (error) => console.error("WebSocket error:", error);
socket.onclose = () => console.log("Disconnected from WebSocket server");

// Update Online Users List
function updateOnlineUsers(users) {
    userList.innerHTML = ""; // Clear the list
    users.forEach((user) => {
        const userElement = document.createElement("li");
        userElement.textContent = user;
        userList.appendChild(userElement);
    });
}

// Display Chat Messages
function displayMessage({ sender, text, date }) {
    const messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.classList.add(sender === "You" ? "user" : "other");
    messageElement.textContent = `[${date}] ${sender}: ${text}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
}

// Send Message
sendButton.onclick = () => {
    const message = {
        type: "chat",
        text: messageInput.value,
        sender: "You", // Replace with actual user nickname
        date: new Date().toLocaleString(),
    };
    socket.send(JSON.stringify(message));
    messageInput.value = ""; // Clear input
};


