import { useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  return (
    <div className="flex gap-[3px] rounded-full bg-[#1a2236] p-[3px]">
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
            "flex cursor-pointer items-center justify-center gap-1 rounded-full px-4 py-[6px] text-[11px] font-medium transition-colors " +
            (theme === key
              ? "border border-[#3a4763] bg-ink text-hi"
              : "border border-transparent text-dim hover:text-[#a8b4cc]")
          }
        >
          <Icon size={11} />
          {label}
        </button>
      ))}
    </div>
  );
}
