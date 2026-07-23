package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/google/uuid"
)

type loginRequest struct {
	Username string `json:"username"`
}

type loginResponse struct {
	Username     string `json:"username"`
	SessionToken string `json:"session_token"`
}

func (s *Server) loginHandler(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_json", "Could not parse request body")
		return
	}

	if strings.TrimSpace(req.Username) == "" {
		writeError(w, http.StatusBadRequest, "missing_name", "Username is required")
		return
	}

	sessionToken := uuid.NewString()

	if err := s.Sessions.Set(r.Context(), sessionToken, req.Username); err != nil {
		writeError(w, http.StatusInternalServerError, "redis_error", "Could not create session")
		return
	}

	writeJSON(w, http.StatusOK, loginResponse{Username: req.Username, SessionToken: sessionToken})
}
