import { podium, type Player } from "../data";
import { CrownBadge } from "./icons";

function PodiumColumn({
  player,
  bottom,
  center,
  first,
}: {
  player: Player;
  bottom: number;
  center: number;
  first?: boolean;
}) {
  const avatarSize = first ? 44 : 40;
  return (
    <div
      className="absolute flex w-[100px] flex-col items-center"
      style={{ bottom, left: center - 50 }}
    >
      {first && <CrownBadge size={20} className="-mb-[4px]" />}
      <img
        src={player.avatar}
        alt={player.name}
        className="rounded-full ring-2 ring-[#dce2f2]"
        style={{ width: avatarSize, height: avatarSize }}
      />
      <span className="mt-[6px] whitespace-nowrap text-[11px] font-bold text-hi">
        {player.name}
      </span>
      <span className="mt-[6px] whitespace-nowrap rounded-full bg-[#3a4164] px-[10px] py-[2px] text-[11px] font-semibold text-[#d9f3e6]">
        {player.score}
      </span>
    </div>
  );
}

export default function Podium() {
  return (
    /* negative bottom margin pulls the leaderboard card up under the skirt,
       recreating the junction from the reference (skirt lip sits on card edge) */
    <div className="relative z-10 mx-auto -mb-[6px] mt-[6px] h-[248px] w-[320px]">
      <PodiumColumn player={podium[0]} bottom={135} center={160} first />
      <PodiumColumn player={podium[1]} bottom={107} center={82} />
      <PodiumColumn player={podium[2]} bottom={83} center={238} />

      <svg
        width="320"
        height="124"
        viewBox="0 0 320 124"
        fill="none"
        className="absolute bottom-0 left-0"
      >
        <defs>
          <linearGradient id="pod-front-1" x1="0" y1="18" x2="0" y2="124" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c5cdf8" />
            <stop offset="1" stopColor="#a5b1f3" />
          </linearGradient>
          <linearGradient id="pod-front-2" x1="0" y1="42" x2="0" y2="124" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b8c2f5" />
            <stop offset="1" stopColor="#98a5ee" />
          </linearGradient>
          <linearGradient id="pod-front-3" x1="0" y1="66" x2="0" y2="124" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b0bcf3" />
            <stop offset="1" stopColor="#909ce9" />
          </linearGradient>
        </defs>

        {/* Skirt — thin base band flaring slightly past the blocks with
            concave fillets; bottom edge notched up at center, dot below */}
        <path
          d="M8 124 L8 122 Q8 119 13 119 L20 119 Q38 119 46 102 L274 102 Q282 119 300 119 L307 119 Q312 119 312 122 L312 124 L170 124 Q170 116 160 116 Q150 116 150 124 Z"
          fill="#8a97e8"
        />

        {/* 2nd place — left block, tucked behind center */}
        <path d="M40 52 Q40 46 46 46 L130 46 L130 124 L40 124 Z" fill="url(#pod-front-2)" />
        <path d="M40 46 L50 33 Q51 31 53 31 L142 31 L130 46 Z" fill="#d4dcfc" />

        {/* 3rd place — right block, tucked behind center */}
        <path d="M190 70 L280 70 Q286 70 286 76 L286 124 L190 124 Z" fill="url(#pod-front-3)" />
        <path d="M190 70 L180 57 Q179 55 182 55 L274 55 Q276 55 277 57 L286 70 Z" fill="#ccd5fa" />

        {/* 1st place — center block, drawn in front */}
        <path d="M122 24 Q122 18 128 18 L192 18 Q198 18 198 24 L198 124 L122 124 Z" fill="url(#pod-front-1)" />
        <path d="M124 18 L130 5 Q130.5 3 132 3 L188 3 Q189.5 3 190 5 L196 18 Z" fill="#e2e7fe" />

        {/* Dot just below the notch, centered under block 1 */}
        <circle cx="160" cy="121" r="2.6" fill="#3f4a68" />

        <g fill="#ffffff" fontFamily="'Baloo 2', sans-serif" fontWeight="800" textAnchor="middle">
          <text transform="translate(160 94) skewX(-6)" fontSize="64">1</text>
          <text transform="translate(82 104) skewX(-6)" fontSize="54">2</text>
          <text transform="translate(238 112) skewX(-6)" fontSize="46">3</text>
        </g>
      </svg>
    </div>
  );
}
