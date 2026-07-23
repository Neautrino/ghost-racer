package api

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"github.com/redis/go-redis/v9"
)

func (s *Server) authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := bearerToken(r)
		if token == "" {
			writeError(w, http.StatusUnauthorized, "missing_auth", "Authorization required")
			return
		}

		username, err := s.Sessions.Get(r.Context(), token)
		if errors.Is(err, redis.Nil) {
			writeError(w, http.StatusUnauthorized, "invalid_session", "Session expired or invalid")
			return
		}

		if err != nil {
			writeError(w, http.StatusInternalServerError, "redis_error", "Could not read session")
			return
		}

		ctx := context.WithValue(r.Context(), "username", username)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func bearerToken(r *http.Request) string {
	auth := r.Header.Get("Authorization")
	if !strings.HasPrefix(auth, "Bearer ") {
		return ""
	}
	return strings.TrimPrefix(auth, "Bearer ")
}
