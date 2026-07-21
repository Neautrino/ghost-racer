package api

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/redis/go-redis/v9"
)

type Server struct {
	rdb *redis.Client
}

func NewServer(rdb *redis.Client) *Server {
	return &Server{rdb: rdb}
}

func (s *Server) NewRouter() *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Get("/health", s.healthHandler())

	return r
}

func (s *Server) healthHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		redisStatus := "up"
		if err := s.rdb.Ping(ctx).Err(); err != nil {
			redisStatus = "down"
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"server": "up",
			"redis": redisStatus,
		})
	}
}