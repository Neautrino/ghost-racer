import {
  ArtistsIcon,
  BattlesIcon,
  BellIcon,
  HomeIcon,
  LaunchpadIcon,
  LeaderboardIcon,
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

export default function Nav() {
  return (
    <nav className="flex flex-col gap-[3px]">
      {navItems.map(({ label, Icon, active }) => (
        <a
          key={label}
          href="#"
          className={
            "flex h-[36px] items-center gap-[9px] rounded-[9px] px-[10px] text-[12px] font-medium transition-colors " +
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
  );
}
