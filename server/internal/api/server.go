package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/neautrino/ghost-racer/internal/store"
	"github.com/redis/go-redis/v9"
)

type Server struct {
	rdb      *redis.Client
	Sessions *store.SessionStore
}

func NewServer(rdb *redis.Client, sessionTTL time.Duration) *Server {
	return &Server{
		rdb:      rdb,
		Sessions: store.NewSessionStore(rdb, sessionTTL),
	}
}

func (s *Server) NewRouter() *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Get("/health", s.healthHandler)

	r.Route("/auth", func(r chi.Router) {
		r.Post("/", s.loginHandler)
	})

	r.Group(func(r chi.Router) {
		r.Use(s.authMiddleware)
	})

	return r
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	redisStatus := "up"
	if err := s.rdb.Ping(ctx).Err(); err != nil {
		redisStatus = "down"
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"server": "up",
		"redis":  redisStatus,
	})
}
