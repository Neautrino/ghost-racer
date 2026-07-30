import Podium from "./components/Podium";
import LeaderboardCard from "./components/LeaderboardCard";
import Brand from "./components/Brand";
import ThemeSwitch from "./components/ThemeSwitch";
import UserProfile from "./components/UserProfile";
import Nav from "./components/Nav";

const block =
  "rounded-[28px] border border-[#2c3a56]/60 bg-ink shadow-[0_30px_80px_-40px_rgba(20,30,60,0.55)]";
const leftBlock =
  "rounded-[28px] border border-line-hi bg-ink shadow-[0_30px_80px_-40px_rgba(20,30,60,0.55)]";

function App() {
  return (
    <div className="min-h-full w-full p-5 md:p-8 lg:p-10">
      <div className="page-grain pointer-events-none fixed inset-0" />

      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-6">
        {/* TOP BAR — brand left (sidebar width), theme switch top-right */}
        <div className="flex items-center justify-between gap-4">
          <div className={`${leftBlock} w-full px-5 py-3 lg:w-[200px]`}>
            <Brand />
          </div>
          <div className={`${block} px-3 py-2`}>
            <ThemeSwitch />
          </div>
        </div>

        {/* MAIN — sidebar column + racing + leaderboard */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          {/* LEFT COLUMN — nav (top) + user profile (bottom) */}
          <div className="flex w-full shrink-0 flex-col gap-6 lg:w-[200px]">
            <div className={`${leftBlock} p-3`}>
              <Nav />
            </div>
            <div className={`${leftBlock} mt-auto px-4 py-4`}>
              <UserProfile />
            </div>
          </div>

          {/* Racing */}
          <main
            className={`${block} flex min-h-[560px] w-full min-w-0 flex-1 items-center justify-center`}
          >
            <span className="text-[13px] font-medium uppercase tracking-wide text-faint">
              Racing
            </span>
          </main>

          {/* Leaderboard */}
          <aside className={`${block} w-full shrink-0 px-5 pb-5 pt-6 lg:w-[400px]`}>
            <Podium />
            <LeaderboardCard />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;
