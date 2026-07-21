package config

import "os"

type Config struct {
	RedisURL string
	Port     string
}

func Load() *Config {
	return &Config{
		RedisURL: getEnv("REDIS_URL", "redis://localhost:6379"),
		Port:     getEnv("PORT", ":8080"),
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
