package main

import (
	"log/slog"
	"net/http"

	"github.com/neautrino/ghost-racer/internal/api"
)

const PORT = ":8080"

func main() {
	slog.Info("Server running on", "port", PORT);

	r := api.NewRouter()
	
	if err := http.ListenAndServe(PORT, r); err != nil {
		slog.Error("Failed to start server", "error", err)
	}
}