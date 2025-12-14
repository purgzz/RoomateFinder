package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

type Response struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

type SwipeCreateRequest struct {
	SwiperUserID    int    `json:"swiper_user_id"`
	TargetProfileID int    `json:"target_profile_id"`
	Action          string `json:"action"` // "like" or "pass"
}

type Swipe struct {
	ID              int       `json:"id"`
	SwiperUserID    int       `json:"swiper_user_id"`
	TargetProfileID int       `json:"target_profile_id"`
	Action          string    `json:"action"`
	CreatedAt       time.Time `json:"created_at"`
}

func createSwipeHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req SwipeCreateRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			respondJSON(w, http.StatusBadRequest, Response{Message: "Invalid request body"})
			return
		}

		if req.Action != "like" && req.Action != "pass" {
			respondJSON(w, http.StatusBadRequest, Response{Message: "action must be 'like' or 'pass'"})
			return
		}

		var saved Swipe
		err := db.QueryRow(
			`INSERT INTO swipes (swiper_user_id, target_profile_id, action)
			 VALUES ($1, $2, $3)
			 RETURNING id, swiper_user_id, target_profile_id, action, created_at`,
			req.SwiperUserID, req.TargetProfileID, req.Action,
		).Scan(&saved.ID, &saved.SwiperUserID, &saved.TargetProfileID, &saved.Action, &saved.CreatedAt)

		if err != nil {
			log.Printf("swipe insert failed: %v", err) // <-- important: tells us the real reason in terminal
			respondJSON(w, http.StatusInternalServerError, Response{Message: "DB insert failed"})
			return
		}

		respondJSON(w, http.StatusCreated, Response{
			Message: "Swipe saved",
			Data:    saved,
		})
	}
}

type User struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

func main() {
	if err := godotenv.Load("../.env"); err != nil {
		_ = godotenv.Load()
	}

	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("create .env from .env.example")
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal("DB ping failed:", err)
	}
	fmt.Println("DB connected!")
	router := mux.NewRouter()

	// API routes
	router.HandleFunc("/api/health", healthCheckHandler).Methods("GET")
	router.HandleFunc("/api/users", getUsersHandler(db)).Methods("GET")
	router.HandleFunc("/api/users", createUserHandler(db)).Methods("POST")
	router.HandleFunc("/api/swipes", createSwipeHandler(db)).Methods("POST")

	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8081", "http://localhost:19000", "http://localhost:19006"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	port := ":8080"
	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(port, handler); err != nil {
		log.Fatal(err)
	}
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	response := Response{
		Message: "Server is running",
		Data: map[string]string{
			"status": "healthy",
			"time":   time.Now().Format(time.RFC3339),
		},
	}
	respondJSON(w, http.StatusOK, response)
}

func getUsersHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query(`SELECT id, name, email, created_at FROM users ORDER BY created_at DESC`)
		if err != nil {
			respondJSON(w, http.StatusInternalServerError, Response{Message: "DB query failed"})
			return
		}
		defer rows.Close()

		users := []User{}
		for rows.Next() {
			var u User
			if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.CreatedAt); err != nil {
				respondJSON(w, http.StatusInternalServerError, Response{Message: "DB scan failed"})
				return
			}
			users = append(users, u)
		}

		respondJSON(w, http.StatusOK, Response{
			Message: "Users retrieved successfully",
			Data:    users,
		})
	}
}

func createUserHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var input struct {
			Name  string `json:"name"`
			Email string `json:"email"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			respondJSON(w, http.StatusBadRequest, Response{Message: "Invalid request body"})
			return
		}
		if input.Name == "" || input.Email == "" {
			respondJSON(w, http.StatusBadRequest, Response{Message: "Name and email are required"})
			return
		}

		var u User
		err := db.QueryRow(
			`INSERT INTO users (name, email) VALUES ($1, $2)
			 RETURNING id, name, email, created_at`,
			input.Name, input.Email,
		).Scan(&u.ID, &u.Name, &u.Email, &u.CreatedAt)

		if err != nil {
			respondJSON(w, http.StatusConflict, Response{Message: "Could not create user (maybe email already exists)"})
			return
		}

		respondJSON(w, http.StatusCreated, Response{
			Message: "User created successfully",
			Data:    u,
		})
	}
}

func respondJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}
