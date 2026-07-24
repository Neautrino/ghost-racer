package store

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type Ratelimiter struct {
	rdb *redis.Client
	limit int64
	window time.Duration
}

func NewRateLimiter(rdb *redis.Client, limit int64, window time.Duration) *Ratelimiter {
	return &Ratelimiter{
		rdb: rdb,
		limit: limit,
		window: window,
	}
}

func (r *Ratelimiter) Allow(ctx context.Context, key string) (bool, error) {
	count, err := r.rdb.Incr(ctx, r.key(key)).Result()
	if err != nil {
		return false, err
	}

	if count == 1 {
		r.rdb.Expire(ctx, r.key(key), r.window)
	}

	return count <= r.limit, nil
}

func (r *Ratelimiter) key(k string) string {
	return fmt.Sprintf("rate:%s", k)
}