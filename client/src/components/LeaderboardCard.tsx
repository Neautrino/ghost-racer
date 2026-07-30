import { players } from "../data";
import { CalendarIcon } from "./icons";

export default function LeaderboardCard() {
  return (
    <section className="relative w-full rounded-[20px] border border-line bg-panel p-4 pt-[14px]">
      {/* Header */}
      <header className="mb-3 flex items-center gap-2 pl-1 text-dim">
        <CalendarIcon size={15} />
        <span className="text-[15px] font-bold text-hi">Leaderboard</span>
      </header>

      {/* Rows */}
      <ul className="flex flex-col gap-1.5">
        {players.map((player) => (
          <li
            key={`${player.rank}-${player.name}`}
            className="flex h-[44px] items-center rounded-[10px] border border-[#232e45] bg-row px-3 transition-[filter] hover:brightness-110"
          >
            <span className="grid h-[20px] w-[20px] shrink-0 place-items-center rounded-full border border-[#2d3a55] text-[10px] font-medium text-[#7a86a3]">
              {player.rank}
            </span>
            <img
              src={player.avatar}
              alt={player.name}
              className="ml-2.5 h-[32px] w-[32px] shrink-0 rounded-full ring-1 ring-[#2d3a55]"
            />
            <span className="ml-2.5 min-w-0">
              <span className="block truncate text-[13px] font-bold leading-tight text-hi">
                {player.name}
              </span>
              <span className="mt-[1px] block text-[10px] leading-tight text-faint">
                Attempts: <span className="font-semibold text-dim">{player.attempts}</span>
              </span>
            </span>
            <span className="ml-auto flex items-center gap-2">
              <span className="text-[11px] text-faint">Score:</span>
              <span className="text-[13px] font-semibold text-mintval">{player.score}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
