import type { Team } from "../types";

export default function TeamCard({ team }: { team: Team }) {
  return (
    <div
      key={team.id}
      className="rounded-xl border bg-card text-card-foreground transition-shadow cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {team.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>

            <div>
              <div className="text-md font-base leading-tight">{team.name}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4.5 w-4.5"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-sm">{team.membersCount} Members</span>
              </div>
            </div>
          </div>

          <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <circle cx="12" cy="6" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="18" r="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
