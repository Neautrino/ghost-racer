package store

import (
	"context"
	"strconv"

	"github.com/redis/go-redis/v9"
)

type LeaderboardStore struct {
	rdb *redis.Client
}

type LeaderboardEntry struct {
	Rank     int64  `json:"rank"`
	Username string `json:"username"`
	Score    int64  `json:"score"`
	Attempts int64  `json:"attempts"`
}

func NewLeaderboardStore(rdb *redis.Client) *LeaderboardStore {
	return &LeaderboardStore{rdb: rdb}
}

func (l *LeaderboardStore) key(mode string) string {
	return "lb:" + mode
}

func (l *LeaderboardStore) attemptsKey(mode string) string {
	return "attempts:" + mode
}

func (l *LeaderboardStore) SubmitScore(ctx context.Context, mode string, username string, score int64) error {
	member := &redis.Z{
		Score:  float64(score),
		Member: username,
	}
	return l.rdb.ZAddGT(ctx, l.key(mode), *member).Err()
}

func (l *LeaderboardStore) IncrementAttempts(ctx context.Context, mode string, username string) error {
	return l.rdb.HIncrBy(ctx, l.attemptsKey(mode), username, 1).Err()
}

func (l *LeaderboardStore) GetTopScores(ctx context.Context, mode string, limit int64, ascending bool) ([]LeaderboardEntry, error) {
	var results []redis.Z
	var err error

	if ascending {
		results, err = l.rdb.ZRangeWithScores(ctx, l.key(mode), 0, limit-1).Result()
	} else {
		results, err = l.rdb.ZRevRangeWithScores(ctx, l.key(mode), 0, limit-1).Result()
	}
	if err != nil {
		return nil, err
	}

	if len(results) == 0 {
		return []LeaderboardEntry{}, nil
	}

	usernames := make([]string, len(results))
	for i, result := range results {
		usernames[i], _ = result.Member.(string)
	}

	attemptsMap, err := l.rdb.HMGet(ctx, l.attemptsKey(mode), usernames...).Result()
	if err != nil {
		return nil, err
	}

	entries := make([]LeaderboardEntry, 0, len(results))
	for i, result := range results {
		username, _ := result.Member.(string)
		var attempts int64
		if attemptsMap[i] != nil {
			if s, ok := attemptsMap[i].(string); ok {
				attempts, _ = strconv.ParseInt(s, 10, 64)
			}
		}

		rank := int64(i) + 1
		if ascending {
			rank = int64(len(results) - i)
		}

		entries = append(entries, LeaderboardEntry{
			Rank:     rank,
			Username: username,
			Score:    int64(result.Score),
			Attempts: attempts,
		})
	}
	return entries, nil
}
