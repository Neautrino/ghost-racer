-- KEYS[1] = sorted set key (lb:{mode})
-- KEYS[2] = attempts hash key (attempts:{mode})
-- ARGV[1] = username (member)
-- ARGV[2] = score (as string)

local score = tonumber(ARGV[2])
local member = ARGV[1]

-- 1. Only update best score if new score is greater (ZADD GT semantics)
local current = redis.call('ZSCORE', KEYS[1], member)
if current == false or score > tonumber(current) then
    redis.call('ZADD', KEYS[1], score, member)
end

-- 2. Increment attempt count
redis.call('HINCRBY', KEYS[2], member, 1)

return 1