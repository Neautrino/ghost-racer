interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const base = ({ size = 18, className, strokeWidth = 1.7 }: IconProps) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
});

export function HomeIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

export function LaunchpadIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </svg>
  );
}

export function TradeIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M8 3 4 7l4 4" />
      <path d="M4 7h16" />
      <path d="m16 21 4-4-4-4" />
      <path d="M20 17H4" />
    </svg>
  );
}

export function BattlesIcon(p: IconProps) {
  const { size = 18, className } = p;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="m7.5 9 2 6 2-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.8 9.3c-.5-.4-2.4-.7-2.6.6-.2 1.4 2.8 1.1 2.6 2.6-.2 1.3-2.2 1-2.8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ArtistsIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.7-3.2 3.3-5 6.5-5s5.8 1.8 6.5 5" />
      <path d="M16 4.8a3.5 3.5 0 0 1 0 6.4" />
      <path d="M18.2 15.4c1.8.8 3 2.3 3.3 4.6" />
    </svg>
  );
}

export function LeaderboardIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 21V13" />
      <path d="M12 21V4" />
      <path d="M20 21v-11" />
    </svg>
  );
}

export function WalletIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M20 7H5a2 2 0 0 1-2-2 2 2 0 0 1 2-2h13v4" />
      <path d="M3 5v13a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1" />
      <path d="M16.5 13.5h.5" />
    </svg>
  );
}

export function BellIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M18 9a6 6 0 0 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 15 18 9" />
      <path d="M10.3 20a2 2 0 0 0 3.4 0" />
    </svg>
  );
}

export function ArrowLeftIcon(p: IconProps) {
  return (
    <svg {...base({ strokeWidth: 2, ...p })}>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  );
}

export function SunIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3" />
    </svg>
  );
}

export function MoonIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />
    </svg>
  );
}

export function SignOutIcon(p: IconProps) {
  return (
    <svg {...base({ strokeWidth: 1.9, ...p })}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function CalendarIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="4.5" width="18" height="17" rx="3" />
      <path d="M8 2.5v4M16 2.5v4M3 9.5h18" />
    </svg>
  );
}

export function CoinIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9.5" fill="#8F9AB8" />
      <circle cx="12" cy="12" r="9.5" stroke="#B9C2D8" strokeWidth="1" />
      <circle cx="12" cy="12" r="6" stroke="#C4CCE0" strokeWidth="1.4" />
      <path d="M12 9v6M10 10.4h3a1.3 1.3 0 0 1 0 2.6h-2a1.3 1.3 0 0 0 0 2.6h3" stroke="#DDE3F0" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

/* Small "VS" chip shown before "Battles won" in list rows */
export function VsTinyIcon({ size = 12, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="4.5" stroke="currentColor" strokeWidth="2" />
      <path d="m7.5 9 2 6 2-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.8 9.3c-.5-.4-2.4-.7-2.6.6-.2 1.4 2.8 1.1 2.6 2.6-.2 1.3-2.2 1-2.8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function TriangleUpIcon({ size = 8, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 8" className={className}>
      <path d="M5 0 10 8H0z" fill="currentColor" />
    </svg>
  );
}

/* Gold crown on a dark badge — sits on the #1 avatar */
export function CrownBadge({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={(size * 20) / 22} viewBox="0 0 22 20" fill="none" className={className}>
      <path d="M4 .5h14A3.5 3.5 0 0 1 21.5 4v5.6L11 19 .5 9.6V4A3.5 3.5 0 0 1 4 .5z" fill="#0D1421" stroke="#26314A" />
      <path d="m5.6 12.6-.9-6 3.2 1.9L11 4.8l3.1 3.7 3.2-1.9-.9 6z" fill="#F2C14B" />
      <circle cx="11" cy="9.6" r="1.1" fill="#FBE29A" />
    </svg>
  );
}

/* Filled periwinkle trophy for the rewards panel header */
export function TrophyIcon({ size = 34, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 3h12v6.5a6 6 0 0 1-12 0V3z" fill="#A6B4F2" />
      <path d="M6 4H3.4v1.8A3.4 3.4 0 0 0 6.8 9.2" stroke="#8290DF" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M18 4h2.6v1.8a3.4 3.4 0 0 1-3.4 3.4" stroke="#8290DF" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10.5 15h3v3.5h-3z" fill="#8290DF" />
      <rect x="7" y="18.5" width="10" height="2.8" rx="1.2" fill="#A6B4F2" />
    </svg>
  );
}
