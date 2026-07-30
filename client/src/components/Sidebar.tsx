import { useState } from "react";
import { currentUser } from "../data";
import {
  ArtistsIcon,
  BattlesIcon,
  ArrowLeftIcon,
  BellIcon,
  CoinIcon,
  HomeIcon,
  LaunchpadIcon,
  LeaderboardIcon,
  MoonIcon,
  SignOutIcon,
  SunIcon,
  TradeIcon,
  WalletIcon,
} from "./icons";

const navItems = [
  { label: "Home", Icon: HomeIcon },
  { label: "Launchpad", Icon: LaunchpadIcon },
  { label: "Trade", Icon: TradeIcon },
  { label: "Battles", Icon: BattlesIcon },
  { label: "Artists", Icon: ArtistsIcon },
  { label: "Leaderboard", Icon: LeaderboardIcon, active: true },
  { label: "Wallet", Icon: WalletIcon },
  { label: "Notifications", Icon: BellIcon },
];

const section = "rounded-[14px] border border-line-soft bg-ink";

export default function Sidebar() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  return (
    <aside className="relative flex h-full w-[200px] flex-col gap-3 rounded-[20px] border border-line bg-panel p-3">
      {/* Collapse handle on the card edge */}
      <button
        aria-label="Collapse sidebar"
        className="absolute -right-[11px] top-[38px] z-10 grid h-[22px] w-[22px] cursor-pointer place-items-center rounded-full border border-line-hi bg-ink text-[#8B96B2] transition-colors hover:text-hi"
      >
        <ArrowLeftIcon size={11} />
      </button>

      {/* SECTION 1 — brand + balance */}
      <div className={`${section} p-3`}>
        <a
          href="#"
          className="logo-script mb-3 block px-1 text-[22px] leading-none text-hi"
        >
          ghost-racer
        </a>
        <div className="flex items-center justify-between rounded-[10px] border border-line-hi px-[10px] py-[9px]">
          <span className="text-[11px] font-medium text-dim">Balance</span>
          <span className="flex items-center gap-1.5">
            <CoinIcon size={14} />
            <span className="text-[12px] font-semibold text-hi">540</span>
          </span>
        </div>
      </div>

      {/* SECTION 2 — navigation */}
      <nav className={`${section} flex flex-1 flex-col gap-[3px] p-2`}>
        {navItems.map(({ label, Icon, active }) => (
          <a
            key={label}
            href="#"
            className={
              "flex h-[34px] items-center gap-[9px] rounded-[9px] px-[10px] text-[12px] font-medium transition-colors " +
              (active
                ? "border border-[#2e3a52] bg-row text-hi"
                : "text-[#7a86a3] hover:text-[#a8b4cc]")
            }
          >
            <Icon size={15} />
            {label}
          </a>
        ))}
      </nav>

      {/* SECTION 3 — theme + user */}
      <div className={`${section} p-3`}>
        <div className="mb-3 flex gap-[3px] rounded-full bg-[#1a2236] p-[3px]">
          {(
            [
              { key: "light", label: "Light", Icon: SunIcon },
              { key: "dark", label: "Dark", Icon: MoonIcon },
            ] as const
          ).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={
                "flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-full py-[6px] text-[11px] font-medium transition-colors " +
                (theme === key
                  ? "border border-[#3a4763] bg-panel text-hi"
                  : "border border-transparent text-dim hover:text-[#a8b4cc]")
              }
            >
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-[9px] px-1">
          <span className="relative shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-[34px] w-[34px] rounded-full ring-1 ring-line-hi"
            />
            <span className="absolute right-0 top-0 h-[9px] w-[9px] rounded-full border-2 border-ink bg-green" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[12px] font-semibold text-hi">
              {currentUser.name}
            </span>
            <button className="flex cursor-pointer items-center gap-1 text-[10px] text-dim transition-colors hover:text-[#a8b4cc]">
              Sign out
              <SignOutIcon size={10} />
            </button>
          </span>
        </div>
      </div>
    </aside>
  );
}
