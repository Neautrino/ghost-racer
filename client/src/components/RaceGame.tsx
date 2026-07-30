import { useEffect, useRef, useState } from "react";

/* Score-arcade endless racer.
   Steer between lanes, throttle for more score-per-second, dodge oncoming
   cars. Higher score = better — matches the server's /game/score model.
   Runs entirely on local state (no backend wiring yet). */

type ModeId = "m1" | "m2" | "m3";
type Status = "idle" | "playing" | "crashed";

interface ModeCfg {
  id: ModeId;
  label: string;
  base: number; // cruising speed (px/s)
  spawn: number; // base seconds between spawns
  maxMul: number; // throttle ceiling as a multiple of base
}

const MODES: ModeCfg[] = [
  { id: "m1", label: "Easy", base: 175, spawn: 1.15, maxMul: 1.7 },
  { id: "m2", label: "Medium", base: 235, spawn: 0.9, maxMul: 1.8 },
  { id: "m3", label: "Hard", base: 305, spawn: 0.68, maxMul: 1.95 },
];

// Logical canvas size — drawn at devicePixelRatio, scaled to fit via CSS.
const W = 360;
const H = 540;
const ROAD_X = 42;
const ROAD_W = W - ROAD_X * 2;
const CAR_W = 34;
const CAR_H = 58;
const PLAYER_Y = H - 104;
const STEER = 300;

const OBST_COLORS = ["#f2c14b", "#e0668a", "#f28b50", "#7fd1a3"];

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

interface World {
  playerX: number;
  playerVX: number;
  speed: number;
  targetSpeed: number;
  cfg: ModeCfg;
  maxSpeed: number;
  scroll: number;
  distance: number;
  obstacles: Obstacle[];
  spawnTimer: number;
  running: boolean;
}

function makeWorld(cfg: ModeCfg): World {
  return {
    playerX: W / 2,
    playerVX: 0,
    speed: cfg.base,
    targetSpeed: cfg.base,
    cfg,
    maxSpeed: cfg.base * cfg.maxMul,
    scroll: 0,
    distance: 0,
    obstacles: [],
    spawnTimer: 0.6,
    running: true,
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function bestKey(mode: ModeId) {
  return `ghost-racer-best-${mode}`;
}

export default function RaceGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const worldRef = useRef<World | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  const [mode, setMode] = useState<ModeId>("m1");
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [speedPct, setSpeedPct] = useState(0);
  const [best, setBest] = useState(0);

  // Keep the latest mode reachable from the imperative loop.
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const stored = Number(localStorage.getItem(bestKey(mode)) || 0);
    setBest(Number.isFinite(stored) ? stored : 0);
  }, [mode]);

  // Canvas backing-store setup + idle scene.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctxRef.current = ctx;
    drawScene(ctx, null);
  }, []);

  function drawScene(ctx: CanvasRenderingContext2D, w: World | null) {
    // Shoulders
    ctx.fillStyle = "#0e1526";
    ctx.fillRect(0, 0, W, H);

    // Road
    ctx.fillStyle = "#1a2338";
    ctx.fillRect(ROAD_X, 0, ROAD_W, H);

    // Road edge stripes
    ctx.fillStyle = "#2c3a56";
    ctx.fillRect(ROAD_X - 4, 0, 4, H);
    ctx.fillRect(ROAD_X + ROAD_W, 0, 4, H);

    // Scrolling lane dividers (two, splitting the road into thirds)
    const dash = 26;
    const gap = 24;
    const period = dash + gap;
    const offset = w ? w.scroll % period : 0;
    ctx.fillStyle = "#3a4763";
    for (const lx of [ROAD_X + ROAD_W / 3, ROAD_X + (ROAD_W * 2) / 3]) {
      for (let y = -period + offset; y < H; y += period) {
        ctx.fillRect(lx - 2, y, 4, dash);
      }
    }

    if (!w) return;

    // Obstacles (rival cars)
    for (const o of w.obstacles) drawCar(ctx, o.x, o.y, o.w, o.h, o.color, true);

    // Player car
    drawCar(ctx, w.playerX - CAR_W / 2, PLAYER_Y, CAR_W, CAR_H, "#a5b1f3", false);
  }

  function drawCar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    rival: boolean,
  ) {
    // Wheels
    ctx.fillStyle = "#0b1120";
    roundRect(ctx, x - 3, y + 8, 5, 14, 2);
    ctx.fill();
    roundRect(ctx, x + w - 2, y + 8, 5, 14, 2);
    ctx.fill();
    roundRect(ctx, x - 3, y + h - 22, 5, 14, 2);
    ctx.fill();
    roundRect(ctx, x + w - 2, y + h - 22, 5, 14, 2);
    ctx.fill();

    // Body
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, color);
    grad.addColorStop(1, rival ? shade(color, -0.22) : "#8a97e8");
    ctx.fillStyle = grad;
    roundRect(ctx, x, y, w, h, 9);
    ctx.fill();

    // Windshield
    ctx.fillStyle = "rgba(11,17,32,0.55)";
    const wy = rival ? y + h - 22 : y + 8;
    roundRect(ctx, x + 5, wy, w - 10, 14, 4);
    ctx.fill();

    // Roof line highlight
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    roundRect(ctx, x + 5, rival ? y + 8 : y + h - 22, w - 10, 5, 3);
    ctx.fill();
  }

  function shade(hex: string, amt: number) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255;
    let g = (n >> 8) & 255;
    let b = n & 255;
    r = Math.max(0, Math.min(255, Math.round(r + r * amt)));
    g = Math.max(0, Math.min(255, Math.round(g + g * amt)));
    b = Math.max(0, Math.min(255, Math.round(b + b * amt)));
    return `rgb(${r},${g},${b})`;
  }

  function update(w: World, keys: Set<string>, dt: number) {
    // Steering
    if (keys.has("ArrowLeft")) w.playerVX = -STEER;
    else if (keys.has("ArrowRight")) w.playerVX = STEER;
    else w.playerVX *= 0.78;
    w.playerX += w.playerVX * dt;
    const minX = ROAD_X + CAR_W / 2 + 4;
    const maxX = ROAD_X + ROAD_W - CAR_W / 2 - 4;
    if (w.playerX < minX) {
      w.playerX = minX;
      w.playerVX = 0;
    }
    if (w.playerX > maxX) {
      w.playerX = maxX;
      w.playerVX = 0;
    }

    // Throttle / brake
    if (keys.has("ArrowUp")) w.targetSpeed = w.maxSpeed;
    else if (keys.has("ArrowDown")) w.targetSpeed = w.cfg.base * 0.55;
    else w.targetSpeed = w.cfg.base;
    w.speed += (w.targetSpeed - w.speed) * Math.min(1, dt * 3.5);

    const move = w.speed * dt;
    w.scroll += move;
    w.distance += move;

    // Advance + prune obstacles
    for (const o of w.obstacles) o.y += move;
    w.obstacles = w.obstacles.filter((o) => o.y < H + 30);

    // Spawn — cadence tightens as speed climbs
    w.spawnTimer -= dt;
    if (w.spawnTimer <= 0) {
      const interval = Math.max(0.34, w.cfg.spawn * (w.cfg.base / w.speed));
      w.spawnTimer = interval * (0.7 + Math.random() * 0.6);
      const ow = CAR_W;
      const oh = CAR_H;
      const ox = ROAD_X + 8 + Math.random() * (ROAD_W - 16 - ow);
      w.obstacles.push({
        x: ox,
        y: -oh - 10,
        w: ow,
        h: oh,
        color: OBST_COLORS[(Math.random() * OBST_COLORS.length) | 0],
      });
    }

    // Collision (shrunk hitboxes for fairness)
    const pad = 6;
    const px = w.playerX - CAR_W / 2 + pad;
    const py = PLAYER_Y + pad;
    const pw = CAR_W - pad * 2;
    const ph = CAR_H - pad * 2;
    for (const o of w.obstacles) {
      if (
        px < o.x + o.w - pad &&
        px + pw > o.x + pad &&
        py < o.y + o.h - pad &&
        py + ph > o.y + pad
      ) {
        w.running = false;
        break;
      }
    }
  }

  function startLoop() {
    lastRef.current = null;
    const step = (t: number) => {
      if (lastRef.current == null) lastRef.current = t;
      const dt = Math.min((t - lastRef.current) / 1000, 0.05);
      lastRef.current = t;
      const w = worldRef.current;
      const ctx = ctxRef.current;
      if (!w || !ctx) return;

      update(w, keysRef.current, dt);
      drawScene(ctx, w);
      setScore(Math.floor(w.distance / 10));
      setSpeedPct(
        Math.round(
          ((w.speed - w.cfg.base * 0.55) /
            (w.maxSpeed - w.cfg.base * 0.55)) *
            100,
        ),
      );

      if (!w.running) {
        endGame(w);
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }

  function endGame(w: World) {
    const final = Math.floor(w.distance / 10);
    const key = bestKey(modeRef.current);
    const prev = Number(localStorage.getItem(key) || 0);
    if (final > prev) {
      localStorage.setItem(key, String(final));
      setBest(final);
    }
    setStatus("crashed");
  }

  function start() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    worldRef.current = makeWorld(MODES.find((m) => m.id === mode)!);
    setScore(0);
    setSpeedPct(0);
    setStatus("playing");
    startLoop();
  }

  // Keyboard handling — capture arrows, Space/Enter to start or retry.
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }
      keysRef.current.add(e.key);
      if ((e.key === " " || e.key === "Enter") && status !== "playing") {
        start();
      }
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
    // status/mode are read via closures/refs; re-bind on status change so
    // Space starts a fresh run with the current selection.
  }, [status, mode]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const activeMode = MODES.find((m) => m.id === mode)!;

  return (
    <section className="flex w-full flex-col rounded-[20px] border border-line bg-panel p-4">
      {/* Header: title + mode pills */}
      <header className="mb-3 flex items-center justify-between pl-1">
        <span className="flex items-center gap-2">
          <span className="grid h-[26px] w-[26px] place-items-center rounded-lg bg-[#232e45] text-[13px]">
            🏁
          </span>
          <span className="text-[15px] font-bold text-hi">Time Trial</span>
        </span>

        <div className="flex rounded-lg border border-line-soft bg-chip p-[3px]">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => status !== "playing" && setMode(m.id)}
              disabled={status === "playing"}
              className={
                "cursor-pointer rounded-[6px] px-2.5 py-[5px] text-[11px] font-semibold transition-colors disabled:cursor-not-allowed " +
                (mode === m.id
                  ? "bg-[#f4f6fb] text-ink"
                  : "text-dim hover:text-[#a8b4cc]")
              }
            >
              {m.label}
            </button>
          ))}
        </div>
      </header>

      {/* Canvas stage */}
      <div
        className="relative mx-auto w-full overflow-hidden rounded-[14px] border border-[#232e45]"
        style={{ maxWidth: W }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", aspectRatio: `${W} / ${H}`, display: "block" }}
        />

        {/* HUD */}
        <div className="pointer-events-none absolute inset-0 p-3">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-[#0b1120]/70 px-2.5 py-1.5 backdrop-blur-sm">
              <div className="text-[9px] font-medium uppercase tracking-wide text-faint">
                Score
              </div>
              <div className="text-[18px] font-bold leading-none text-hi tabular-nums">
                {score}
              </div>
            </div>
            <div className="rounded-lg bg-[#0b1120]/70 px-2.5 py-1.5 text-right backdrop-blur-sm">
              <div className="text-[9px] font-medium uppercase tracking-wide text-faint">
                Best
              </div>
              <div className="text-[18px] font-bold leading-none text-mintval tabular-nums">
                {best}
              </div>
            </div>
          </div>

          {/* Speed meter */}
          {status === "playing" && (
            <div className="absolute inset-x-3 bottom-3">
              <div className="mb-1 flex justify-between text-[9px] font-medium uppercase tracking-wide text-faint">
                <span>Speed</span>
                <span className="tabular-nums">{Math.max(0, speedPct)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#0b1120]/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-peri to-green transition-[width] duration-100"
                  style={{ width: `${Math.max(0, Math.min(100, speedPct))}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Start / Game-over overlay */}
        {status !== "playing" && (
          <div className="absolute inset-0 grid place-items-center bg-[#0b1120]/78 backdrop-blur-[2px]">
            <div className="flex flex-col items-center px-6 text-center">
              {status === "crashed" ? (
                <>
                  <div className="text-[13px] font-medium text-dim">Crashed!</div>
                  <div className="mt-1 text-[40px] font-bold leading-none text-hi tabular-nums">
                    {score}
                  </div>
                  <div className="mt-1 text-[11px] text-faint">
                    {score >= best && score > 0
                      ? "New best score 🎉"
                      : `Best ${best} · ${activeMode.label}`}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[22px] font-bold leading-tight text-hi">
                    Ghost Racer
                  </div>
                  <div className="mt-1.5 max-w-[210px] text-[11px] leading-relaxed text-dim">
                    Steer to dodge traffic. Throttle for more score — the faster
                    you drive, the faster it climbs.
                  </div>
                </>
              )}
              <button
                onClick={start}
                className="mt-4 cursor-pointer rounded-full bg-gradient-to-r from-peri to-peri-deep px-6 py-2 text-[13px] font-bold text-ink transition-transform hover:scale-[1.03]"
              >
                {status === "crashed" ? "Race again" : "Start race"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <footer className="mt-3 flex items-center justify-center gap-4 text-[10px] text-faint">
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-line-hi bg-chip px-1.5 py-0.5 text-[9px] text-dim">
            ← →
          </kbd>
          steer
        </span>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-line-hi bg-chip px-1.5 py-0.5 text-[9px] text-dim">
            ↑
          </kbd>
          throttle
        </span>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-line-hi bg-chip px-1.5 py-0.5 text-[9px] text-dim">
            ↓
          </kbd>
          brake
        </span>
      </footer>
    </section>
  );
}
