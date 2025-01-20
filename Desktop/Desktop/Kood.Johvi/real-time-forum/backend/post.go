package main

import (
	"database/sql"
	"log"
	"time"
)

// Post represents a post in the forum
type Post struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Category  string    `json:"category"`
	CreatedAt time.Time `json:"created_at"`
}

// GetAllPosts retrieves posts filtered by category
func GetAllPosts(category string) ([]Post, error) {
	log.Printf("Fetching posts for category: %s\n", category)

	var query string
	var rows *sql.Rows
	var err error

	if category == "All" {
		query = "SELECT id, title, content, category, created_at FROM posts"
		rows, err = db.Query(query)
	} else {
		query = "SELECT id, title, content, category, created_at FROM posts WHERE category = ?"
		rows, err = db.Query(query, category)
	}

	if err != nil {
		log.Printf("Error querying posts: %v\n", err)
		return nil, err
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		if err := rows.Scan(&post.ID, &post.Title, &post.Content, &post.Category, &post.CreatedAt); err != nil {
			log.Printf("Error scanning post: %v\n", err)
			return nil, err
		}
		posts = append(posts, post)
	}

	log.Printf("Fetched %d posts for category: %s\n", len(posts), category)
	return posts, nil
}

// CreatePost inserts a new post into the database
func CreatePost(post *Post) error {
	log.Printf("Inserting new post: %+v\n", post)

	_, err := db.Exec(
		"INSERT INTO posts (title, content, category, created_at) VALUES (?, ?, ?, ?)",
		post.Title, post.Content, post.Category, time.Now(),
	)
	if err != nil {
		log.Printf("Error inserting post: %v\n", err)
		return err
	}

	log.Println("Post successfully inserted")
	return nil
}

// DeletePost removes a post from the database by its ID
func DeletePost(postID string) error {
	log.Printf("Deleting post with ID: %s\n", postID)

	result, err := db.Exec("DELETE FROM posts WHERE id = ?", postID)
	if err != nil {
		log.Printf("Error deleting post: %v\n", err)
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("Error checking rows affected: %v\n", err)
		return err
	}

	if rowsAffected == 0 {
		log.Printf("No post found with the given ID: %s\n", postID)
		return sql.ErrNoRows
	}

	log.Println("Post successfully deleted")
	return nil
}
