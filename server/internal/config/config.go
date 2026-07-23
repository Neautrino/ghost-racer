package config

import (
	"os"
	"strings"
	"time"
)

type Config struct {
	RedisURL string
	Port     string
	RedisTTL time.Duration
}

func Load() Config {
	port := getenv("PORT", "8080")
	if !strings.HasPrefix(port, ":") {
		port = ":" + port
	}

	ttl, err := time.ParseDuration(getenv("REDIS_TTL", "24h"))
	if err != nil {
		ttl = 24 * time.Hour
	}

	return Config{
		RedisURL: getenv("REDIS_URL", "redis://localhost:6379"),
		Port:     port,
		RedisTTL: ttl,
	}
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
