import { rewards } from "../data";
import { TrophyIcon } from "./icons";

export default function RewardsPanel() {
  return (
    <aside className="w-[300px] shrink-0 pb-8 pl-10 pr-8 pt-10">
      <div className="w-full">
        {/* Heading */}
        <header className="flex items-start gap-3">
          <TrophyIcon size={32} className="mt-0.5" />
          <span>
            <span className="block text-xs font-medium text-[#c9d2e6]">Monthly</span>
            <span className="serif-display block text-[26px] leading-tight text-hi">
              Rewards
            </span>
          </span>
        </header>

        <p className="mt-3 text-[10px] leading-[1.7] text-[#667187]">
          At the end of each month, the top 10 winners on our leaderboard receive $USDC
          rewards based on their ranking.
        </p>

        {/* Reward tiers */}
        <ul className="mt-5 flex flex-col gap-2.5">
          {rewards.map(({ place, suffix, amount }) => {
            const glass =
              place === 1
                ? "grain-glass"
                : place === 2
                  ? "grain-glass tier-2"
                  : place === 3
                    ? "grain-glass tier-3"
                    : "";
            return (
              <li
                key={place}
                className={
                  "flex h-[40px] items-center rounded-xl px-3.5 " +
                  (glass || "border border-[#253044] bg-panel")
                }
              >
                <span className="text-base font-bold text-white">{place}</span>
                <span className="relative -top-[6px] ml-[1px] text-[9px] font-semibold text-[#9aa5c0]">{suffix}</span>
                <span className={"ml-2 text-[11px] " + (glass ? "text-[#a8b3cc]" : "text-dim")}>
                  place
                </span>
                <span className="ml-auto text-[15px] font-bold text-white">
                  $ <span className="ml-0.5">{amount}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
