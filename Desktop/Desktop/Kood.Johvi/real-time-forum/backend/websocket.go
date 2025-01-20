package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// WebSocket connection upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow connections from any origin
	},
}

type Message struct {
	Type   string   `json:"type"`
	Sender string   `json:"sender,omitempty"`
	Text   string   `json:"text,omitempty"`
	Date   string   `json:"date,omitempty"`
	Users  []string `json:"users,omitempty"` // For online users list
}

var (
	clients      = make(map[string]*Client) // clientID -> Client
	clientsMutex sync.Mutex
	onlineUsers  = make(map[string]string) // clientID -> nickname
)

// Client represents a single WebSocket connection
type Client struct {
	ID       string
	Nickname string
	Conn     *websocket.Conn
	Mutex    sync.Mutex
	Send     chan []byte
}

// WebSocketHandler upgrades HTTP requests to WebSocket connections
func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}

	clientID := r.RemoteAddr // Use client IP as ID for now
	client := &Client{
		ID:       clientID,
		Nickname: "Guest", // Replace with actual nickname after login
		Conn:     conn,
		Send:     make(chan []byte),
	}

	clientsMutex.Lock()
	clients[clientID] = client
	onlineUsers[clientID] = client.Nickname
	clientsMutex.Unlock()

	// Notify all clients about the updated user list
	broadcastOnlineUsers()

	log.Println("Client connected:", clientID)

	go handleClientMessages(client)
	go handleClientWrites(client)

	// On disconnect, remove the client and update the user list
	defer func() {
		clientsMutex.Lock()
		delete(clients, clientID)
		delete(onlineUsers, clientID)
		clientsMutex.Unlock()
		broadcastOnlineUsers()
		client.Conn.Close()
		log.Println("Client disconnected:", clientID)
	}()
}

// handleClientMessages listens for messages from a client
func handleClientMessages(client *Client) {
	for {
		_, message, err := client.Conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break
		}

		log.Printf("Message received from %s: %s\n", client.ID, message)
		broadcastMessage(client.ID, message)
	}
}

// handleClientWrites listens for outgoing messages to the client
func handleClientWrites(client *Client) {
	for message := range client.Send {
		client.Mutex.Lock()
		err := client.Conn.WriteMessage(websocket.TextMessage, message)
		client.Mutex.Unlock()
		if err != nil {
			log.Println("Write error:", err)
			break
		}
	}
}

// broadcastMessage sends a message to all connected clients
func broadcastMessage(senderID string, message []byte) {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	for clientID, client := range clients {
		if clientID != senderID {
			select {
			case client.Send <- message:
			default:
				log.Printf("Client %s is not receiving messages\n", clientID)
			}
		}
	}
}

// broadcastOnlineUsers notifies all clients about the updated online users list
func broadcastOnlineUsers() {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	users := make([]string, 0, len(onlineUsers))
	for _, nickname := range onlineUsers {
		users = append(users, nickname)
	}

	message := Message{
		Type:  "onlineUsers",
		Users: users,
	}

	data, err := json.Marshal(message)
	if err != nil {
		log.Println("Error marshaling online users message:", err)
		return
	}

	for _, client := range clients {
		select {
		case client.Send <- data:
		default:
			log.Printf("Client %s is not receiving updates\n", client.ID)
		}
	}
}
