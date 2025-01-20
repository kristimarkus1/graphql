package main

import (
	"log"
	"net/http"
)

func main() {
	// Initialize the database (only one function is needed)
	InitializeDB()  // This function creates the schema and connects to the database
	defer CloseDB() // Ensure the database is closed when the server stops

	// Define routes
	http.HandleFunc("/ws", WebSocketHandler) // WebSocket connection
	http.HandleFunc("/register", RegisterHandler)
	http.HandleFunc("/login", LoginHandler)
	http.HandleFunc("/posts", PostsHandler)

	// Serve static assets and HTML files
	serveStaticFiles()

	// Start the server
	log.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func serveStaticFiles() {
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("../frontend/css"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("../frontend/js"))))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			http.ServeFile(w, r, "../frontend/index.html")
		} else {
			http.NotFound(w, r)
		}
	})

	http.HandleFunc("/homepage.html", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../frontend/homepage.html")
	})
	http.HandleFunc("/posts.html", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../frontend/posts.html")
	})
}
