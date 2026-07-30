import { currentUser } from "../data";
import { SignOutIcon } from "./icons";

export default function UserProfile() {
  return (
    <div className="flex items-center gap-[9px]">
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
  );
}
