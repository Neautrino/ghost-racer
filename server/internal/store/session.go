package store

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type SessionStore struct {
	rdb *redis.Client
	ttl time.Duration
}

func NewSessionStore(rdb *redis.Client, ttl time.Duration) *SessionStore {
	return &SessionStore{
		rdb: rdb,
		ttl: ttl,
	}
}

func (s *SessionStore) Set(ctx context.Context, token string, username string) error {
	return s.rdb.Set(ctx, s.key(token), username, s.ttl).Err()
}

func (s *SessionStore) Get(ctx context.Context, token string) (string, error) {
	return s.rdb.Get(ctx, s.key(token)).Result()
}

func (s *SessionStore) key(token string) string {
	return fmt.Sprintf("session:%s", token)
}

