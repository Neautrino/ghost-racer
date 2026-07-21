package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/neautrino/ghost-racer/internal/api"
	"github.com/neautrino/ghost-racer/internal/config"
	"github.com/neautrino/ghost-racer/internal/store"
)

func main() {
	cfg := config.Load()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	rdb, err := store.NewRedisClient(ctx, cfg.RedisURL)
	if err != nil {
		slog.Error("failed to connect to redis", "error", err)
		os.Exit(1)
	}
	defer rdb.Close()

	slog.Info("connected to redis")

	srv := api.NewServer(rdb)
	router := srv.NewRouter()
	
	go func() {
		if err := http.ListenAndServe(cfg.Port, router); err != nil {
			slog.Error("Failed to start server", "error", err)
			cancel()
		}
	}()

	slog.Info("server started", "port", cfg.Port)

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	<- sigCh

	slog.Info("shutting down...")
	cancel()
	time.Sleep(500 * time.Millisecond)
}