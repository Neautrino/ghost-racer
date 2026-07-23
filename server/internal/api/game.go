package api

import (
	"encoding/json"
	"net/http"

	"github.com/neautrino/ghost-racer/internal/game"
)

type submitScoreRequest struct {
	Mode string `json:"mode"`
	Score int `json:"score"`
}

type submitScoreResponse struct {
	Mode string `json:"mode"`
	Score int `json:"score"`
	Username string `json:"username"`
}

func (s *Server) submitScoreHandler(w http.ResponseWriter, r *http.Request) {
	username, ok := r.Context().Value("username").(string)
	if !ok {
		writeError(w, http.StatusUnauthorized, "no_user", "Could not identify user")
		return
	}

	var req submitScoreRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_request", "Could not parse request body")
		return
	}

	if _, ok := game.ModeByID(req.Mode); !ok {
		writeError(w, http.StatusBadRequest, "invalid_mode", "Mode does not exist")
		return
	}

	if req.Score < 0 {
		writeError(w, http.StatusBadRequest, "invalid_score", "Score must be non-negative")
		return
	}

	ctx := r.Context()

	if err := s.Leaderboard.SubmitScore(ctx, req.Mode, username, int64(req.Score)); err != nil {
		writeError(w, http.StatusInternalServerError, "submit_score", "Could not submit score")
		return
	}

	if err := s.Leaderboard.IncrementAttempts(ctx, req.Mode, username); err != nil {
		writeError(w, http.StatusInternalServerError, "increment_attempts", "Could not increment attempts")
		return
	}

	writeJSON(w, http.StatusOK, submitScoreResponse{
		Mode:     req.Mode,
		Score:    req.Score,
		Username: username,
	})
}