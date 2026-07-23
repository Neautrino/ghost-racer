package api

import (
	"net/http"
	"strconv"

	"github.com/neautrino/ghost-racer/internal/game"
)

func (s *Server) getLeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	mode := r.URL.Query().Get("mode")
	if mode == "" {
		writeError(w, http.StatusBadRequest, "missing_mode", "Mode is required")
		return
	}

	if _, ok := game.ModeByID(mode); !ok {
		writeError(w, http.StatusBadRequest, "invalid_mode", "Mode does not exist")
		return
	}

	limit := int64(20)
	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.ParseInt(l, 10, 64); err != nil && parsed > 0 {
			limit = parsed
		}
	}

	if limit > 1000 {
		limit = 1000
	}

	ascending := false
	if order := r.URL.Query().Get("order"); order == "asc" {
		ascending = true
	}

	entries, err := s.Leaderboard.GetTopScores(r.Context(), mode, limit, ascending)
 	if err != nil {
		writeError(w, http.StatusInternalServerError, "redis_error", "Could not fetch leaderboard")
		return
  	}

  	writeJSON(w, http.StatusOK, entries)
}